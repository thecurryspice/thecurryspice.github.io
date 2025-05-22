---
layout: post
title: "Timers - Basic Concepts"
author: Akhil Raj Baranwal
date: 2017-07-10
comments: true
category: tutorial
---

*<sub>Last updated : July 10th, 2017</sub>*

*To an absolute beginner like me, learning about Timers can be more demanding than a girfriend. It is for this reason that I've decided to make multiple posts on Timers and PWMs. It will help me keep topics organised and follow this wonderful quote as well.*

<br>
>"Always build a strong base and continue your way slowly up to the top"
>
> -- Bob The Builder

<br>
<br>
*In this article, I focus on building a strong base.*

___
<br>
<br>
## Necessary Introduction to Timers

Timers are omnipresent. From fading an LED to timing light pulses in [femto-photography](https://en.wikipedia.org/wiki/Femto-photography "Check it out. It's really cool"), they find indispensable use. Anything that employs anything more than toggling the flow of current must employ timers.<br>
These little pieces of hardware are what makes electronics so precise in multitasking.<br>
From things as crude as a wall-clock to things as complex as GPS, everything relies on timers. Battery-powered wall-clocks use electrical power to keep a timer running, and pulses of current are sent over to a solenoid, which induces a shift in the second's hand of the clock. All processors are marketed with a tag of frequency, which is the timer frequency. You might have heard of gamers drooling over 3.9 GHz processors or normal folks dreaming of a phone with multi-core 1.5 GHz processors.<br>

But we are going to discuss another level of cool. The ATmega328 works at a frequency of a humble 16 or 20 MHz. Don't consider it slow, though. As even at a frequency of 16 MHz, one clock cycle takes only 62.5 nanoseconds.<br>

But wait, what is a timer?<br>
It's a combined set of registers.<br>
But that's too vague, isn't it?<br>
Yes. A better explanation would be that every electronic device needs to have a reference for bridging two tasks. But to know *when* a task has ended is very important as this serves as the precursor to shoot off the next task. Timers thus provide the time base on which all CPU calculations take place. They provide the concept of "measuring" events in a processor.<br>
But how do timers work? How does the actual counting take place?<br>
Well, you see? When studying about timers, starting off randomly can get ugly very quickly. So I'll try to give a simple analogy first, which will hopefully make things easier.

___
<br>
<br>

## A Childish Analogy

Consider a child A. He knows how to count only in single digits (0 to 9).<br>
You now give child A a task, which is to count.<br>
You instruct him to increment his counting on every second, and place an analog-clock in front of him.<br>
On every second, the second's hand move and the child increments one count. When he reaches 9, he loops around to 0. So it takes him 10 seconds to finish one loop and then he starts counting from 0 again.<br>
But why do you need a child to count? Well, because you can then perform your own tasks.<br>
Consider a case where you want to measure your pulse. Unless you're superhuman, you cannot count your pulse and keep track of time simultaneously.<br>
So you instruct child A to scream and say "done" whenever he counts to 9, and then you multiply the recorded pulse count with 6 to calculate your pulse rate.<br>
Simple, yes?<br>

Now consider another case where you want to actually count to 60. Why?<br>
Because results will be more accurate. How do you achieve that?<br>
You take a similar child, B, and instruct him to increment his count when child A screams "done".<br>
Yes, you guessed it. When child B screams "6", you'll know 60 seconds have passed.<br>
And now you have two children screaming numbers around you.<br>
Perfect, yes?<br>

But the maximum time-interval you can count with two children is 100 seconds (both children will scream "done" together). What if you want to count hours, or days for that matter?<br>
You reduce your count. But how?<br>
Let's call the event of child A screaming "done" as A<sub>done</sub> and that of B as B<sub>done</sub>.<br>
You teach these children how to divide and ask child A to divide his readings by a factor of 2, which is another way of saying that he should scream "1" when the second's hand has moved two times. You instruct child B to divide his results too. Now A<sub>done</sub> happens when 20 seconds have passed and B<sub>n</sub> happens on every second occurence of A<sub>done</sub>.<br>
Understood? Awesome.<br>

So now, when B<sub>done</sub> occurs, you can be pretty sure that 400 (100 x 2<sup>2</sup>) seconds have passed. Notice that we've lost on resolution, as the least count is now 2 seconds and not 1 second.<br>
Why?<br>
Because A<sub>n</sub> can happen on every 2 seconds now.<br>
Resolution decreases, but we get to measure a larger interval.

Ofcourse! You can ask the children to divide their readings not just by 2, but by any number. This will allow you to measure a much bigger time-span. Suppose the dividing factor is 100, then the maximum time period that can be measured is collectively 100 x 100<sup>2</sup> seconds. Or about 11 days and 14 hours!<br>
And yes, a lot of resolution has been lost, our least count is 100 seconds in this case.

___
<br>
<br>

## The Interpretation

Coming back to why I introduced these noisy children, it's time for the analogy.<br>

The child represents a timer (and a timer is essentially a combination of many registers).<br>

Just like the child, the timer can count only to a specific number.<br>
For a 8-bit timer register, it can count to 2<sup>8</sup> = 256 numbers (from 0 to 255). Once the register gets full at 255 (0b11111111 or 0xFF), adding 1 to the register makes it **overflow** and we are left with all bits equal to zero in the register, essentially looping around 255.<br>

<br>
The "sense" of time change that the child receives is from the second's hand of the clock placed in front of him.<br>
Hence the analog-clock is the clock frequency (also called the base frequency) in the processor.<br>
An electrical pulse is created at the clock frequency, and on every pulse the register adds 1 to itself.<br>

<br>
A<sub>done</sub> is marked by an interrupt flag.<br>
Interrupt flags are just specific bits in a specific register going high, equivalent to a child's scream.<br>
There's an interrupt flag for overflow, which means everytime the timer overflows, a bit named TOV (or Timer OVerflow) in a register named TIFR (Timer Interrupt Flag Register) is set to 1. It resets itself after timer value exceeds 0x00.<br>

We can also be notified of any general A<sub>n</sub> by setting up Output Compare Registers.<br>
The timer (counter) value is constantly compared to the value stored in the corresponding Output Compare Register. Once the value matches, the counter register is reset (looped around to 0). This is equivalent to the child screaming "done" and looping at a number lesser than 9.<br>
There's an interrupt flag for this too, and results are seen on OCF0 bit.<br>
Whenever timer value equals the value stored in Output Compare register, the interrupt is *fired* and the timer is set to 0x00.

<br>
Dividing our readings by a number allows us to pre-scale our values, and is therefore, illogicaly and unintuitively, called **prescaling**.<br>
Assuming clock frequency is 20 MHz, one clock cycle is 50 nanoseconds (least count).<br>
For an 8-bit register, the maximum time we can measure is (256 x 50 nanoseconds) 12.8 microseconds.<br>
If we introduce a prescalar (prescaling factor) equal to 4, the timer updates every 200 nanoseconds (prescaling divides frequency, hence multiplies time).
So now the maximum time that can be measured is 51.2 microseconds.<br>
In AVR timers, only powers of 2 can be used as prescalars.


#### A Small Example

Suppose that we want to measure 35 microseconds.<br>

Let's choose a proper prescalar first.

| Presaclar| Frequency| Least Count| Max Time|
|:---:|:---:|:---:|:---:|
|1|20 MHz| 50 ns| 12.8 us|
|2|10 MHz| 100 ns| 25.6 us|
|4|5 MHz| 200 ns| 51.2 us|
|8|2.5 MHz| 400 ns| 102.4 us|

<br>
Looking at the table, it's easy to infer that we can choose a prescalar >= 4.<br>
4, 8, 16 all are good choices. But we know that the higher the prescalar, the lesser the resolution. So we make our best bet at 4.

To calculate the value at which an interrupt must be fired, we use a powerful mathematical tool, [unitary method](https://en.wikipedia.org/wiki/Unitary_method).<br>
At prescalar 4,<br>
If, **51.2 microseconds** are measured in **256 divisions**,<br>
then, **35 microseconds** are measured in (35 x 256)/51.2, or **175 divisions**.

Counting from 0, 175th reading starts at 174. So we must set the Output Compare Register to 174.

Now that we have chosen a prescalar value 4 and set the Output Compare register to 174,<br>
whenever the **timer/counter value** will reach 174, an interrupt will be fired, signifying that the programmed time has elapsed.<br>

Congratulations! We have successfully measured 35 microseconds.

___
<br>
<br>

*I hope we were able to establish a solid base in the concept of timers. Remember that you can always return back to the childish analogy whenever these concepts feel too complex. We need to make sure that a strong base exists, before moving on to the [next tutorial](https://arbaranwal.github.io/tutorial/2017/07/15/timers-gory-details.html) which includes dealing with all the inter-connected registers of a basic digital timer.*
