---
layout: post
title: EasyMouse
category: techblog
date: 2017-08-28
---

<br>
<br>
Recently, after playing CS 1.6 (judge me all you can) for around 3 hours, I felt some discomfort in my wrist, and **WebMD** proudly suggested [Carpal Tunnel Syndrome](https://www.webmd.com/pain-management/carpal-tunnel/tc/carpal-tunnel-syndrome-topic-overview).<br>
This is a common problem with people who are involved in desk-work, working with a traditionally designed mouse (correctly, a pointing device). 

Here's what happens:

![Carpal Tunnel Syndrome](/assets/carpalTunnelSyndrome.jpg)

<br>
<br>

---

## What Is EasyMouse

**EasyMouse** is an attempt to make a pointing device based solely on gestures, so that the Carpal Tunnel Syndrome can be avoided in the long run.<br>

But wait, where's the fun in that. Also, there are some alternatives available which will always be preferred over an incomplete open-source project.<br>Moreover, there's no incentive to work on this, because simply shaking the hand after every 15 minutes or so is enough to drop any chances of the syndrome affecting someone.<br>
Allow me to rephrase.<br>

**EasyMouse** is an attempt to make a pointing device **optimised for gaming**, based solely on gestures. As a side-effect, Carpal Tunnel Syndrome is avoided in the long run.<br>
Hardware includes an MPU-6050 and an ADXL345 as the MVPs, attached to an Arduino Nano, connected to the computer via serial, which will be upgraded to a wireless link using nRF24L01.<br>
The 'driver' (for loss of a better word) which is written in Python, receives instruction packets from the Arduino and uses pyautogui to perform GUI operations.

Now, what do I mean by 'optimised for gaming'?<br>
Well, since this is a custom mouse, a gesture can be programmed to trigger, for example, 5 mouse-clicks in 250 milliseconds.<br>
In FPS games, this is really helpful if your aim is decent.<br>
Similarly, another gesture can be programmed to trigger a series of perfectly timed combination of keystrokes and mouse-clicks, which are useful in hitting combos in games like Mortal Kombat.

General pointing and cursor movement will also have greater precision and sensitivity, all of which can be customised according to personal preference.
<br>
<br>

---

## Status

The project is still under development.<br>
I've focused on writing the 'driver' till now.<br>
3D printing the wearable can start once the wireless feature is implemented.<br>
Feel free to contact me to suggest ideas or contribute to this project.<br>

All files related to the project can be found [here](https://www.github.com/akhilrb/easymouse "Trust the readme on the target page more than the description provided here").