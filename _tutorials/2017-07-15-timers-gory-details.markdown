---
layout: post
title: "Timers - Gory Details"
author: Akhil Raj Baranwal
date: 2017-07-15
comments: true
category: tutorial
---

<sub>*Last Updated: July 15th, 2017*</sub>

*The following text assumes you have already read the [previous tutorial](https://arbaranwal.github.io/tutorial/2017/07/10/timers-basic-concepts.html "Basic Concepts explained ever so deeply") and are aware of the basic concepts of timers. If not, I strongly recommend you to read it to have a fair idea of how timers work. Here is a [reference](https://arbaranwal.github.io/tutorial/2017/06/23/atmega328-register-reference.html#reference-table) of a lot of registers that you might want to check out, although, most registers concerned with timers will be mentioned here too.*

____
<br>
<br>
## ATmega328's Timers

The ATmega328 has three timers, with each timer having two channels:<br>

**Timer0 (8-bit)**: This timer is used in elementary functions like **delay()**, **millis()** and **micros()**. Yes, you used Timer0 for your very first sketch on Arduino. Timer0 helped you say *Hello World* to Electronics, or Embedded for that matter. Take a moment to appreciate timer0. Timer0 FTW!<br>
Channels A and B control PD5(pin 5) and PD6(pin 6) respectively.

**Timer1 (16-bit)**: Using the servo library employs this timer. Since it is 16 bit, it allows for a much better resolution even while measuring larger time scales. For reference, Timer1 will provide 256 times higher resolution while measuring the same amount of time interval as compared to Timer0 (or Timer2).<br>
Channels A and B control PB1(pin 9) and PB2(pin 10) respectively.


**Timer2 (8-bit)**: This timer is a prime example of the typical third guy in a startup who is not so popular. The tone() function uses timer2.<br>
Channels A and B control PD3(pin 3) and PB3(pin 11) respectively.
<br>

### Related Registers


| Register | Offset | Bit7 | Bit6 | Bit5 | Bit4 | Bit3 | Bit2 | Bit1 | Bit0 |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
|TCCR0A|0X44|COM0A1|COM0A0|COM0B1|COM0B0|Reserved|Reserved|WGM01|WGM00|
|TCCR0B|0X46|FOC0A|FOC0B|Reserved|Reserved|WGM02|CS02|CS01|CS00|
|TIMSK0|0X6E|Reserved|Reserved|Reserved|Reserved|Reserved|OCIEB|OCIEA|TOIE|
|TIFR0]|0X35|Reserved|Reserved|Reserved|Reserved|Reserved|OCF0B|OCF0A|TOV0|

<br>
I strongly recommend opening this [reference](https://arbaranwal.github.io/tutorial/2017/06/23/atmega328-register-reference.html#tc0-control-register-a) in another tab to be clear about register descriptions.<br>

___
<br>
<br>
## Saying "Hello World" Again

Let's start with something as basic as blinking an LED, but using only registers. No fancy functions (with all due respect **and** condolences to *delay()*).<br>
Assuming our ATmega is working at a frequency of 16 MHz, and that we need a delay of 2 milliseconds between each toggle, this is how we decide our variables.<br>

First, choose a prescalar.<br>

| Presaclar| Frequency| Least Count| Max Time|
|:---:|:---:|:---:|:---:|
|1|16 MHz| 62.5 ns| 16 us|
|8|2 MHz| 500 ns| 128 us|
|64|250 KHz| 4 us| 1.024 ms|
|256|62.5 KHz| 16 us| 4.096 ms|
|1024|15.625 KHz| 64 us| 16.384 ms|

256 seems to be the best choice as it gives higher resolution.<br>

Next, we calculate the value that corresponds to 2 milliseconds. This gives (2 x 256)/4.096 = 125<br>

Now 125th reading begins at 124, so our target should be 124.


```c
void setup()
{
  DDRB |= 0x01; //set pin 8 as output
  TCCR0B |= (1 << CS02);  //Initialise Timer with prescalar 256
  TCNT0 = 0;  //Set timer value to 0x00
}

void loop()
{
  if(TCNT0 >= 124)
  {
    PORTB ^= (1 << 0);  //toggle LED
    TCNT0 = 0;  //reset counter
  }
}
```

<br>
Pretty simple code, yes?<br>
But there's a catch here.  
If some other function is being carried out *while* the value in TCNT0 exceeds 124, the **if** condition will not be evaluated exactly at *== 124*.<br>
It is for this reason that an inequality ( >= 124) is used. Doing this prevents the CPU from having to switch the LED in a small window (that is, exactly at 124), otherwise, many missed compares might be witnessed.<br>
Still, if another function is taking up huge processing time, it is obvious that the toggling of the LED will be disturbed, because maybe the **if** condition is checked when TCNT0 is way past 124.<br>

But hey, it's overkill to buy such a good microcontroller to blink LEDs on the only process thread ATMega328 can boast of.
We need a way of automating this process of resetting TCNT0 when it reaches past a certain value. That will allow us to run some other instruction on the main thread.<br>
Enter **CTC** mode, or Clear Timer on Compare mode.<br>
As the name suggests, it keeps comparing values in OCR0A and TCNT0. Whenever there's a match, an interrupt is fired and voila! the timer resets automatically. Isn't that awesome?<br>

These registers will be used for structuring this automation: TCNT0, OCR0A, TCCR0A, TCCR0B, TIMSK0 and TIFR0.<br>

We'll also be needing the functions **sei()** and **cli()**.<br>

**sei()** : Enables global interrupts. Equivalent to:

```c
//Bit 7 in SREG register, named 'I',
//determines whether interrupts are
//enabled or disabled
SREG |= (1 << 7)
```

<br>
**cli()** : Disables global interrupts. Equivalent to:

```c
SREG |= (0 << 7)
```

*Enabling* and *Disabling* Interrupts is just a **masking** process. Actually, there is nothing to stop the hardware from generating an interrupt, but whether the interrupt will be noted or not is what is meant by the terms *enabling* and *disabling* an interrupt.

<br>
We'll also need to include *avr/interrupt.h* header file to use the interrupts.

<br>
```c
void setup()
{
  #include<avr/io.h>
  #include <avr/interrupt.h>

  DDRB |= 0x01; //set pin 8 as output

  //Choose CTC mode
  TCCR0A |= (1 << WGM01);

  //Initialise Timer with prescalar 256
  TCCR0B |= (1 << CS02);

  //Enable global-interrupts
  //I is 7th bit
  SREG |= (1 << I);

  //Enable comapre-interrupts
  TIMSK0 |= (1 << OCIEA);

  //Setup compare value
  OCR0A = 124;

  //Set timer value to 0x00
  TCNT0 = 0;
}

//A vector named TIMER0_COMPA_vect is responsible for notifying about the compare match.
//We make an Interrupt Service Routine for this vector,
//which executes everytime the interrupt is fired.
ISR(TIMER0_COMPA_vect)
{
  PORTB ^= (1 << 0);  //toggle LED
}

void loop(){}
```

Whenever compare matches occur, the respective interrupt vector is caught by the ISR.<br>
The main process is stopped and the ISR is executed first, then the main process continues again.<br>
Remember that timing functions like *micros()*, *delay()* will be disturbed, and PWM channels on pins 5 and 6 won't work either as all these use Timer0 to work.<br>

There's another interesting thing we can do if we just have to toggle an LED. Recall that channels A and B control PD5(pin 5) and PD6(pin 6) respectively.<br>
If we use only pins 5 or 6, we don't even have to write the ISR!<br>

<br>

|COM0A1|COM0A0|Description|
|:---:|:---:|:---:|
|0|0| Normal port operation, OC0A disconnected|
|0|1| Toggle OC0A on Compare Match|
|1|0| Clear OC0A on Compare Match|
|1|1| Set OC0A on Compare Match|

<sub>*OC0A is pin 5 (PD5)*</sub>

```c
void setup()
{
  DDRD |= 0x05; //set pin 5 as output

  //Choose CTC mode
  //Toggle OC0A on Compare Match
  TCCR0A |= (1 << WGM01) | (1 << COM0A0);

  //Initialise Timer with prescalar 256
  TCCR0B |= (1 << CS02);

  //Enable global-interrupts
  //I is 7th bit
  SREG |= (1 << I);

  //Enable comapre-interrupts
  TIMSK0 |= (1 << OCIEA);

  //Setup compare value
  OCR0A = 124;

  //Set timer value to 0x00
  TCNT0 = 0;
}

void loop(){}
```

This code will toggle the LED on pin 5 automatically! No ISR required.<br>

These types of toggles are especially useful in creating *PWMs*, because the pulse doesn't get affected by any other task and is handled internally by hardware.<br>
It's worth noting again that PWMs on pins 5 and 6 are controlled by Timer0, on pins 9 and 10 by Timer1, and on pins 3 and 11 by Timer2. All timers have two channels, and this is why ATmega328 is said to have **6 PWM channels**.

We can obviously try [bit-banging](https://en.wikipedia.org/wiki/Bit_banging "I know what you're thinking") to produce a crude PWM on other pins, but it will never be as accurate as the ones generated independently by hardware.<br>

___
<br>
<br>
## A Custom millis() Function

Let's write a custom millis() function that returns milliseconds.<br>
I'll demostrate this by using timer0.<br>
F_CPU is a macro which stores the frequency of CPU in MHz. This defaults to 16 MHz, but we'll still use F_CPU to make our code run even if we overclock it.<br>
The number of microseconds that would have passed during one overflow is (256 * 1000000) / F_CPU. Com'on you can do the math yourself.<br>


```c
#define us_passed_on_overflow ((256 * 1000000) / F_CPU)

//for storing microseconds
unsigned int us = 0;

//for storing milliseconds
unsigned long ms = 0;

//enable global interrupts
//alternative to SREG |= (1 << I)
sei();

//configuring the Interrupt Service Routine
ISR(TIMER0_OVF_vect)
{
  //defined by macro
  us += us_passed_on_overflow;

  //increment ms accordingly
  if (us > 1000)
  {
    ms++;
    us = us % 1000;
  }
}

unsigned long millis()
{
  return ms;
}
```

<br>
It is quite obvious that the above code is a tokenish version of the actually complex millis() function in the Arduino libraries.<br>
I encourage you to search for and go through the original library named *wiring.c*, which contains function definitions for millis(), micros(), delay() and delayMicroseconds().

The aim of this article is not to motivate you to program timers this way, no. That would be redundant, if not futile.<br>
The aim here is to know and appreciate what's going on in the background.<br>
Take a moment to realise that the CPU has to make 16 x 10<sup>6</sup> *idle* ticks to produce a 1 second delay.<br>
That it takes a total of 3 bytes of data to measure digital time in an AVR.<br>
Digital Time, that dictates your projects ever since your first sketch of a blinking LED.<br>
Remember that little blinking LED once again, and marvel at how the internals work in sheer accuracy to get that to happen.<br>
That all of this is so beautifully abstracted into an elementary chip.<br>
And that exponentially more complex tasks are carried out in insanely more intricate processors...

<br>
Welcome to the World of Embedded Electronics!

___
<br>
<br>

*If you want to extend your mental database to include the other two counters as well, please read sections 20 and 21 of the ATmega328/P [datasheet](http://www.atmel.com/Images/Atmel-42735-8-bit-AVR-Microcontroller-ATmega328-328P_Datasheet.pdf) for further details. If the concept of timers is known, it must be a breeze to go through the Timer1's sections, which is only slightly different. Timer2 is just a copy of Timer0 working on different channels. Datasheets are meant to be read and no one actually expects all this information to be memorised. Just knowing about how things happen will be enough knowledge to implement solutions in problem statements, and datasheets can always be referred for the __gory details__*
