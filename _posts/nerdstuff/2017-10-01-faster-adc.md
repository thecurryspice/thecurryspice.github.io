---
layout: post
title: Faster ADC
category: techblog
date: 2017-10-01
---

Yesterday, I found myself in a situation where I had to get an Arduino Nano to write some data in an SD card as fast it could.<br>
The aim was to pull strings on Arduino's timings, and not the write delay on the SD card.<br>

## A Few More Details

Channel A0 of the ADC had to be polled 4 times and that data had to be stored in an SD card after dropping 2 LSBs from the reading.<br>
All this was originally taking 1.8 ms (oscilloscope readings), and it wasn't satisfactory. I knew that this could be reduced without getting a better SD card, but like I said, I had to reduce Arduino's lag.<br>
It's more of a common issue now, reducing the time delay on Arduino.<br>

---
<br>
<br>
## analogRead()


Here's a *snippet* of the `analogRead()`  function:

```cpp
int analogRead(uint8_t pin)
{
	uint8_t low, high;

	if (pin >= 14) pin -= 14; // allow for channel or pin numbers

  	// set the analog reference (high two bits of ADMUX) and select the
	// channel (low 4 bits).  this also sets ADLAR (left-adjust result)
	// to 0 (the default).
#if defined(ADMUX)
	ADMUX = (analog_reference << 6) | (pin & 0x07);
#endif

	// without a delay, we seem to read from the wrong channel
	delay(1);

#if defined(ADCSRA) && defined(ADCL)
	// start the conversion
	sbi(ADCSRA, ADSC);

	// ADSC is cleared when the conversion finishes
	while (bit_is_set(ADCSRA, ADSC));

	// we have to read ADCL first; doing so locks both ADCL
	// and ADCH until ADCH is read.  reading ADCL second would
	// cause the results of each conversion to be discarded,
	// as ADCL and ADCH would be locked when it completed.
	low  = ADCL;
	high = ADCH;
#else
	// we dont have an ADC, return 0
	low  = 0;
	high = 0;
#endif

	// combine the two bytes
	return (high << 8) | low;
}
```

Fairly simple, the first **if** condition checks whether someone was too naive to type 0 to 5 as 14 to 19.<br>
Next, the ADMUX register is programmed.<br>
The analog reference is chosen with `analog_reference << 6`  and the pin to read is set using `pin & 0x07`.<br>
Then we see a compulsory 1 ms delay!<br>
`Update: The 1ms  delay has been commented out in a recent edit`<br>
A normal conversion takes place after producing a right-adjusted result.<br>
The two variables (low and high) are combined and returned as the output of the `analogRead()`  function.

---
<br>
<br>
## Implementation

Arduino's aim has forever been bridging the gap between electronics and DIY, and it succeeds in that.<br>
But for slightly advanced uses, the features that help kick-start experimentation with electronics start to come off as a hindrance.<br>
Timing is not of much importance for elementary projects, but the very essence of *electronics* lies in processing data as fast as possible. A microsecond is a huge time period for today's embedded devices, and I am not even scratching the surface with Arduino.<br>
If I can find out what all cautionary checks and unnecessary initialisations `analogRead()`  function goes through, I'll remove them and hopefully save some time.

Consider a very sketchy observation:

I found in the [datasheet](http://www.atmel.com/Images/Atmel-42735-8-bit-AVR-Microcontroller-ATmega328-328P_Datasheet.pdf) that the first conversion takes 25 clock cycles and all the rest take 13, unless the ADC is disturbed and turned on again.<br>
Considering that the conversion is done for all 8 analog channels,<br>
1 clock cycle = 62.5 ns <br>
Total clock cycles = 25 + 13 x 7 =  <br>
Minimum time = 116 x 62.5 = 7250 ns <br>

Very sketchy, I understand, but giving a 500% error margin *due to unforeseeable events*, the minimum time will still be 29 microseconds, way under the recorded 1.8 ms.<br>

The first thing was to remove the 1ms compulsory delay. The delay is required when the analog channel being read is changed.<br>
For example, if I use `analogRead(A1)`  *just after* `analogRead(A0)`, I'll have to provide a time buffer to shift to the next channel, otherwise, `A0`  might be read again.<br>
Since I was always reading from one channel, I didn't need to have the 1ms delay.

The second thing was the prescalar for the ADC's clock frequency.<br>
It can be set to any 2<sup>n</sup> from 2<sup>1</sup> to 2<sup>7</sup>.<br>
ADPS bits ( ADSCRA[2:0] ) can be edited to select the prescalar.<br>
Setting it to 000 or 001 results in a prescalar of value 2.<br>
The datasheet warns about an increased error with increased frequency.<br>
It doesn't matter much here because I have to drop 2 bits anyway, which is a scaling factor of 0.25, and I believe errors that bad wouldn't be significant.<br>

The third thing was the ADLAR bit in the ADMUX register.<br>
The ADLAR bit defaults to 0, and signifies how the 10 bit conversion is stored in the ADCH and ADCL registers.<br>
Normally, ADCH contains the 2 MSBs and ADCL stores the remaining 8 (Right Adjusted Result).<br>
When ADLAR is set to 1, ADCL will contain the 2 MSBs and the remaining will be stored in ADCH (Left Adjusted Result).<br>
The advantage here is that I can skip reading ADCH altogether (because I have to drop 2 LSBs anyway) and also skip combining the two readings.<br>
The final result can be dumped in a 1 byte `uint8_t`  instead of a 2 byte `uint16_t`, the data type corresponding to `int`.<br>

So now, this is the resultant code:

```cpp

// set up pin 5 as output
// It is used for getting readings on the oscilloscope
DDRD |= 0b00100000;

// select a prescalar value 2.
ADCSRA &= ~0b00000111;

// set up analog reference and left-adjust
ADMUX = _BV(REFS0) | _BV(ADLAR);

// or use this instead, same thing
// ADMUX = 0b01100000;

// pin 5 is pulled HIGH
PORTD |= 0b00100000;

// Start Conversion
ADCSRA |= _BV(ADSC);
while (bit_is_set(ADCSRA,ADSC));

// read the 8 MSBs
uint8_t a = ADCH;

// repeat for all 4 variables
ADCSRA |= _BV(ADSC);
while (bit_is_set(ADCSRA,ADSC));
uint8_t b = ADCH;
ADCSRA |= _BV(ADSC);
while (bit_is_set(ADCSRA,ADSC));
uint8_t c = ADCH;
ADCSRA |= _BV(ADSC);
while (bit_is_set(ADCSRA,ADSC));
uint8_t d = ADCH;

// pin 5 is pulled LOW
PORTD |= 0b00000000;
```

<br>
Also, [this](https://pastebin.com/Mi8DvWQy) function can be appended to wiring_analog.c, to get a stock function that can approximate values faster with 8 bit precision.