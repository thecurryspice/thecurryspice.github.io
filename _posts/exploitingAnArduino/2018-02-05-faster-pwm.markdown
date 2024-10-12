---
layout: post
title: Faster PWM
category: tutorial
author: Akhil Raj Baranwal
date: 2018-05-02
---

*This article focuses on hitting the maximum frequency of PWM that can be stably generated using the ATMega328. This is an extension of the FastPWM mode (which maxes out at 31.25 kHz)and stable pulses of 4 MHz can be generated using the information in this article. Please note that I mention **pulses** and not PWM.*

---

<br>
<br>
It has happened many times now that I find Arduino IDE's default frequency for the `analogWrite()`  function too slow to work with, for example, DAC application and power supplies.<br>
I don't intend to explain how PWM is generated in the ATMega328 chip, rather how to implement it in code.<br>


---
<br>
<br>
## Precautions

The following text involves changing the properties of any of the three timers on the ATMega328, which control different inbuilt functions. Some libraries use one specific timer to get their job done.<br>
For example, all time-keeping functions work on Timer0.<br>
So, if you love the `millis()`  or `delay()`  functions, do not change values for Timer0.<br>
Similarly, the **servo** library uses Timer1, and editing Timer1 parameters can result in the servo not working as intended.<br>

Since common applications usually involve defaults of Timer0 and Timer1, it's good practice to edit Timer2 unless needed otherwise.<br> 
Timer2 controls GPIOs 3 and 11, hence the PWM on only these two pins will be affected.


---
<br>
<br>
## Precautions

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
	// delay(1);

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
### Walkthrough

The first **if** condition corrects 14-19 to 0-5.<br>
Next, the ADMUX register is programmed.<br>
The chosen analog reference is validated using `analog_reference << 6`  and the analog pin to be read is set using `pin & 0x07`.<br>
A normal conversion takes place after that with right-adjusted values.<br>
The two variables (low and high) are combined and returned as the output of the `analogRead()`  function.

---
<br>
<br>
## Modifications

### Prescalar

The simplest way to speed up the ADC, is, well, speeding up the clock frequency.<br>
Originally, it is derived from the CPU clock frequency and is usually set between 50kHz to 200kHz using prescalars.<br>
ADPS bits in the ADCSRA register can be manipulated to select the prescalar.<br>

|ADPS[2:0]|Prescalar|
|:---:|:---:|
|000|2|
|001|2|
|010|4|
|011|8|
|100|16|
|101|32|
|110|64|
|111|128|

<br>
Obviously, 2 will result in the highest frequency and can be set using<br>
```c
ADCSRA &= ~0b00000111;
```
or
```c
ADCSRA &= ~0b00000110;
```

### Efficiency

So, what else can be done?<br>
If there is room for being pedantic, the program can be made much more efficient by some simple implementations.

#### ADLAR

The ADLAR bit in the ADMUX register defaults to 0, and signifies how the 10 bit conversion is stored in the ADCH and ADCL registers.<br>
Normally, the result is right adjusted, which means ADCH contains the 2 MSBs and ADCL stores the remaining 8, which is why the registers are named so, abbreviations of ADCHigh and ADCLow.<br>
When ADLAR is set to 1, the result is left adjusted, i.e. ADCL will contain the 2 LSBs and the remaining will be stored in ADCH.<br>

ATMega328 has only 8-bit registers, and the ADC has a 10-bit resolution, so storing those values will need two registers.<br>
Suppose we need to store 669, which is `0010 1001 1101`  (0x29D).<br>
<br>

|||||ADCH|||||||||ADCL|||||
||Bit7|Bit6|Bit5|Bit4|Bit3|Bit2|Bit1|Bit0||Bit7|Bit6|Bit5|Bit4|Bit3|Bit2|Bit1|Bit0||
||:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:||:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
|Left Adjusted |1|0|1|0|0|1|1|1||0|1|0|0|0|0|0|0|
|Right Adjusted|0|0|0|0|0|0|1|0||1|0|0|1|1|1|0|1|

<br>
Right-adjusted results are common practice, and this type of output *feels* correct, doesn't it?<br>
It can be used directly with the nth bit representing nth level of binary precision.<br>

But when is left-adjustment useful?<br>
Left-adjusted results are useful when a very high resolution/precision is not necessary.<br>
Reading one register will directly offer 8 bits of precision.<br>
The advantage here is that reading the ADCL register can be skipped entirely, and the processing used to concatenate the ADCH and ADCL register values in a right-adjusted mode is also not needed.<br>
The final result can be dumped in a 1 byte `uint8_t`  instead of a 2 byte `uint16_t`, the data type corresponding to `int`, which will save RAM as well, and is significantly useful when heaps of data has to be collected or huge arrays have to be made to calculate simple rolling averages or complex PID constants.<br>

Left-adjusted results can be obtained by setting ADLAR 1.<br>
But it's not as easy, because that spoils the output of `analogRead()`, which still expects a right-adjusted result.

Let us write a function for getting an 8-bit precision output.<br>

```cpp
uint8_t analogRead8bit(uint8_t pin)
{
	uint8_t result;

	if (pin >= 14) pin -= 14; // allow for channel or pin numbers

	// set ADLAR high
	ADMUX |= _BV(ADLAR);

#if defined(ADMUX)
	ADMUX = (analog_reference << 6) | (pin & 0x07);
#endif

	// without a delay, we seem to read from the wrong channel
	// delay(1);

#if defined(ADCSRA) && defined(ADCL)
	// start the conversion
	sbi(ADCSRA, ADSC);

	// ADSC is cleared when the conversion finishes
	while (bit_is_set(ADCSRA, ADSC));

	//read only ADCH, 8 bits
	result = ADCH;
#else
	// we don't have an ADC, return 0
	result = 0;
#endif

	// combine the two bytes
	return result;
}
```
<br>
This function can be put inside *wiring_analog.c* to be used in future programs.<br>
It can only be used with Arduino Uno and Nano.<br>
For compatibility with all boards, use [this](https://pastebin.com/Mi8DvWQy).
<br>

---
<br>
<br>
*It is exhilarating to realise how jam-packed a small chip from the AVR family can be. I have developed a deep respect for the engineering world, and am always humbled whenever I learn about an embedded system. The modularity of these systems always reminds me of the individual inventions great minds have done in this field. An embedded system packs all of them into itself, making all their inventors forever immortal.<br>
Until next time, analogRead between the lines :)*