---
layout: post
title: "Advanced I/O"
author: Akhil Raj Baranwal
date: 2017-06-30
comments: true
category: tutorial
---
*<sub>Last updated : July 7, 2017</sub>*


*The following article uses port addressing. If you're not familiar with it, check out [this post](https://arbaranwal.github.io/tutorial/2017/06/23/atmega328-register-reference.html#ddrx-portx-and-pinx) for a quick reference.*

___
<br>
<br>
## Generic Preface

Digital electronics are very strict about timing. They are so precise that an offset of a few hundred nanoseconds can confuse any other digital electronics connected to it.<br>  
<br>
When I was a beginner in Arduino, these concepts were as arcane to me as footpaths to Salman Khan. So when I tried making an Infrared Remote from scratch, all I knew was that I had a 38 Khz pulse to deal with, which is roughly 26 microseconds. As a test condition, I had made the remote learn the TV on/off signal. Even after half an hour of fiddling with the remote, the TV kept blaring. I observed no output, no Off signal.  
I was using an IR bulb so there were no hopes of visual feedback. Putting out a test-character (1 byte) through UART at the highest baud rate (230400) would disturb the timing by approximately 34 microseconds, which would be pointless.  
I did not even have an oscilloscope, so I couldn't actually measure the pulses Arduino was generating.  
There simply wasn't any immediate way of knowing what was going on.  
But fortunately, I realised that my program was merely switching a GPIO pin rapidly, so I took a blind shot at that specific function.

<br>
```c
// A pulseIn function analyses a signal and populates elements in an array(dat).
// 'dat' is the predefined array that stores consecutive high and low pulse durations.
void flash(uint8_t n, uint16_t *dat)
{
  for(uint16_t i = 0; i < n; i++)
  {
    digitalWrite(ledPin, HIGH);
    delayMicroseconds(dat[i++]);
    digitalWrite(ledPin, LOW);
    delayMicroseconds(dat[i]);
  }
}
```
<br>
<br>
This looked really good on my computer screen owing to [Stino](https://github.com/Robot-Will/Stino)'s syntax highlighting. Builtin fuctions like pinMode(), digitalWrite(), and digitalRead() functions light up with different colours and are easy to use because they neatly abstract embedded commands. It is because of this reason that they are otiose in projects that require switching I/O pins within microseconds with precision.

___
<br>
<br>

## Register Manipulations

A bit on addressing registers first. The three registers that control I/O on a port are **DDRx**, **PORTx** and **PINx**.  
Just a heads up, you might want to open the [reference](https://arbaranwal.github.io/tutorial/2017/06/23/atmega328-register-reference.html#ddrx-portx-and-pinx) for these I/O registers in another tab.

In the most minimal sense,  
DDRx initialises a pin.  
PORTx declares a pin HIGH or LOW.  
PINx reads from a pin.

Congratulations! You have just learned about nine registers! Because *x* can either be **B**, **C** or **D** depending on which port you want to interface.  

**Port D**:

Available Registers: **PIND** *(0x29)*, **DDRD** *(0x2A)*, **PORTD** *(0x2B)*<br>
Each register is 8-bit. [7:0] bits map from GPIO-7 to GPIO-0 respectively.


**Port B**:

Available Registers:  **PINB** *(0x23)*, **DDRB** *(0x24)*, **PORTB** *(0x25)*<br>
Each register is 8-bit. [5:0] bits map from GPIO-13 to GPIO-8 respectively.  
[7:6] bits are reserved for oscillators.


**Port C**:

Available Registers: **PINC** *(0x26)*, **DDRC** *(0x27)*, **PORTC** *(0x28)*<br>
Each register is 8-bit. *When using as GPIO*, [5:0] bits map from A5 to A0 respectively. **These pins can be used as regular GPIOs**.  
[7:6] bits are not accessible on the Uno board.

Now that most of the jazz is done with, it's time to perform tango.<br>
For the next few examples, let's assume *x* as *B*.  
I'll stick to using general I/O functions as that will make it easier to relate to all of this pile-up.

```c
pinMode(8, OUTPUT);
pinMode(10, OUTPUT);
pinMode(13, OUTPUT);
// the above three lines can be condensed to one line.
DDRB = 0b00100101;
//It's important to note that all pins are inherently declared as inputs.

//Now that we've initialised our pins, let's declare them.

digitalWrite(8,LOW);
digitalWrite(10,HIGH);
digitalWrite(13,LOW);

//The above three lines are equivalent to:
PORTB = 0b00000100; //only pin 10 has to be HIGH
```

DDRx always takes precedence over PORTx or PINx. This means that digitalWrite() won't affect the output state of the pin if it has been declared as an input in pinMode().<br>
Go on, read the above lines again. It will make you feel good.<br>
Okay let's clear it out with an example.

```c
DDRB  = 0b00100101; //1 represents OUTPUT; 0 is INPUT
PORTB = 0b00010100; //1 represents HIGH; 0 is LOW

COMBO = 0b00000100; //1 represents output HIGH, 0 LOW

//The above register (COMBO) is not an identified variable.
//It's just for demonstrating an example.
```

<br>
But what happens on calling a read function on an output-defined pin?

```c
DDRB  = 0b00100101; //1 represents OUTPUT, 0 is INPUT
PINB  = 0b00110110; //1 represents a call to read from the pin

COMBO = 0b00010010; //1 represents that the pin was read

//Once again, the above register (COMBO) is not an identified variable.
//It's just for demonstrating an example.
```

A thorough and even more detailed explanation can be found on [maxEmbedded's webpage]().<br>
It should now be clear that DDRx takes precedence over PORTx and PINx. It gives direction to a rather unclear set of pin states. Hence the name Data Direction Register.

___
<br>
<br>
## Digging Deep

<br>
The source code for the Arduino's **pinMode** function pulled up from *wiring.c* is this:

```c
void pinMode(uint8_t pin, uint8_t mode)
{
  uint8_t bit = digitalPinToBitMask(pin);
  uint8_t port = digitalPinToPort(pin);
  volatile uint8_t *reg, *out;

  if (port == NOT_A_PIN) return;

  reg = portModeRegister(port);
  out = portOutputRegister(port);

  if (mode == INPUT) {
    uint8_t oldSREG = SREG;
          cli();
    *reg &= ~bit;
    *out &= ~bit;
    SREG = oldSREG;
  } else if (mode == INPUT_PULLUP) {
    uint8_t oldSREG = SREG;
          cli();
    *reg &= ~bit;
    *out |= bit;
    SREG = oldSREG;
  } else {
    uint8_t oldSREG = SREG;
          cli();
    *reg |= bit;
    SREG = oldSREG;
  }
}
```
<br>
and that for **digitalWrite()** is this:
```c
{
  uint8_t timer = digitalPinToTimer(pin);
  uint8_t bit = digitalPinToBitMask(pin);
  uint8_t port = digitalPinToPort(pin);
  volatile uint8_t *out;

  if (port == NOT_A_PIN) return;

  if (timer != NOT_ON_TIMER) turnOffPWM(timer);

  out = portOutputRegister(port);

  uint8_t oldSREG = SREG;
  cli();

  if (val == LOW) {
    *out &= ~bit;
  } else {
    *out |= bit;
  }

  SREG = oldSREG;
}
```
<br>
<br>
Now let's compare that with direct port access. Consider manipulating pin 7.  
Setting up pin 7 as output requires the corresponding bit value in the Data Direction Register(DDR) to be 1, 0 otherwise. Therefore:
```c
DDRD = DDRD | B10000000;    //equivalent to pinMode(7, OUTPUT); notice that bit 7 is 1, we don't want to change other pins
```
and for logic manipualtions at the pin,
```c
PORTD = PORTD | B10000000;  //equivalent to digitalWrite(7, HIGH);  notice that bit 7 is 1
PORTD = PORTD | B00000000;  //equivalent to digitalWrite(7, LOW);
```
<br>

Getting back to my childish remote, the code now looked something like this:
```c
void flash(uint8_t n, uint16_t *dat)
{
  for(uint16_t i = 0; i < n; i++)
  {
    PORTD |= B10000000;   //pin 7 HIGH
    delayMicroseconds(dat[i++]);
    PORTD &= ~(B10000000);   //pin 7 LOW
    delayMicroseconds(dat[i]);
  }
}
```

Here, `~(B10000000)`  converts to `B01111111`  which when used with bitwise-AND with any byte will result in the 7th bit definitely getting 0.
<br>
<br>
It's obvious that 2 lines of low level code is definitely faster than 36 lines doing the same thing. What's also obvious now is that by the time the MCU processes the actual command of manipulating register bits, several microseconds have already passed, which corrupts the signal.  

___

<br>
<br>

## But Wait...

<br>
Directly addressing the ports made my project work and I had a wonderful time switching random things on and off. Although there were some moments that the remote would fail me.  
But now something bugged me more than ever.  
Is `delayMicroseconds(1)`  practical? What if loading the function in the stack creates enough time delay to make a 1us delay redundant?

<br>
Turns out that it has been taken care of and very well documented with support for under/over-clocked models too.

```c
void delayMicroseconds(unsigned int us)
{
        // call = 4 cycles + 2 to 4 cycles to init us(2 for constant delay, 4 for variable)
#if F_CPU >= 24000000L
    if (!us) return; //  = 3 cycles, (4 when true)
      us *= 6; // x6 us, = 7 cycles
      us -= 5; //=2 cycles
#elif F_CPU >= 20000000L
      __asm__ __volatile__ (
        "nop" "\n\t"
        "nop" "\n\t"
        "nop" "\n\t"
        "nop");
    if (us <= 1) return; //  = 3 cycles, (4 when true)
    us = (us << 2) + us; // x5 us, = 7 cycles
    us -= 7;
```
<br>
The function simply returns on a 1 microsecond delay because the overhead of the function call takes 18 (or 20) cycles, which is (*50ns* x *18*(*or 20*) ) 1 microsecond approximately.  
delayMicroseconds(< single digit >) is actually feasible!

<br>
No wonder everyone loves Arduino :)

___
<br>
<br>
## Efficient Switching with Bitwise Operations

<br>
Consider an application of toggling an LED on pin 13 every time pin 8 is pulled HIGH.

```c
if(digitalRead(8))  //the condition is true if pin 8 is high
{
  if(!state)   //state is a boolean which stores LED state
  {
    digitalWrite(13, HIGH);
    state = true;
  }
  else
  {
    digitalWrite(13, LOW);
    state = false;
  }
}
```

<br>
But combining a little [bit-math](http://playground.arduino.cc/Code/BitMath) with port addressing, the logic shrinks to one line.

```c
if(digitalRead(8))  //the condition is true if pin 8 is high
{
  PORTB ^= (1 << 5);  //toggles LED on pin 13(bit 5)
}
```

<br>
Now, isn't that awesome?

___
<br>
<br>

*Read the [next tutorial on Timers and PWMs](https://arbaranwal.github.io/tutorial/2017/07/10/timers-basic-concepts.html) from my Exploiting an Arduino series.*
