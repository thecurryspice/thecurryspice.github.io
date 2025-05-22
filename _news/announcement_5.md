---
layout: post
date: 2022-02-14
title: I tape out the first chip of my career
inline: false
related_posts: false
---

I spent the later part of 2020 and 2021 learning about [Universal Flash Storage (UFS)](https://en.wikipedia.org/wiki/Universal_Flash_Storage) at Micron, and owning the transport and application-level host interface verification. This was a fantastic team I worked in. There's some faff on LinkedIn about how smooth someone's onboarding process went and how excited they are to join a company. But it is now my iron-clad understanding that the quality of your mentor is what defines your career trajectory too. I was lucky to have a great mentor, who didn't think of me as a mere side quest even when I joined Micron at a fast-paced time when they were moving to a new internal architecture.<br>
The learning curve at Micron was steep. But what better challenge can you throw at a college graduate sitting home with a brand-new, fully-reimbursed workstation?<br>
A new architecture meant making new files with my name in the author's title. It was quite validating to be making such contributions to the codebase during my first year at a MNC like Micron that was already celebrating 42 years of establishment when I joined.

A select few members of the Hyderabad team were on call throughout the night continuing from a normal workday (which I now realize was probably a grave violation of labour laws, but I had tremendous enthusiasm coursing through my veins, so I'll excuse myself about any such considerations). The team on the other end, in San Jose, were monitoring the voltage levels in person on a busy morning. Three host machines in San Jose were setup with three separate test-beds to test the silicon. The engineering sample had been brought in at the San Jose site, and the team there had setup remote connections for us, exposing control over the test-bed halfway across the Earth in Hyderabad. The chips would have arrived in India three days later, but we wanted to achieve something called a _Day Zero Lead_, which means proving the correctness of the chip the day it is scheduled to arrive. Obviously, if successful, it would have meant fat bonuses and promotions. In that moment though, these thoughts didn't cross my mind.

My eyes were glued to the screen, which was sharing a PuTTY terminal connected to the UART of the chip.
The first time the chip is powered, there are all sorts of voltage and current measurements that are monitored.
The internal ROM is configured to put some boot messages and if successful, a greeting on UART. Since UART works on a local clock, the first few reads are all garbled.
Because of the manufacturing process of the silicon wafer, each chip is unique and produces a different clock than what is expected.
For example, a chip configured to produce 25MHz internally might not necessarily produce this exact value, leading to all sorts of unexpected behaviour. The design compensates for this by providing a _trim_ register, which controls the voltage being fed to the internal PLL, which in turn acts like a digital knob on the internal clock frequency.
Multiple reloads of the firmware with varying CSR values perform a linear sweep or binary search for the perfect _trim_ value of the internal oscillator to match the expectation. Until this value is matched, everyone sat on call with their brows sweating profusely at the terminal screen-share displaying the UART output. *There is absolutely no way of knowing if the chip will work*. Because hey, garbled output can be anything - it can be a mismatched clock, or a faulty chip. We'll never know unless we understand what the little silicon guy on life-support test-bed is saying.

While I was evaluating the gravity of verification as a formal job, being the gate to tens of hundred of million dollar orders at once, the terminal flushed with boot messages revealing all sort of internal chip stats, ending with a nice  
```
HELLO FROM ******** ROM
```
I can't share the name of the project due to CIPA considerations. I can share that I was struck by a hit of adrenaline I felt when a tight lump in my throat melted into my heart, making it resume beating more aggressively than it had ever before. I was floating. It was as if 4 years of my undergraduate education in Electronics was suddenly redeemed, that I deserved to be part of this success, albeit standing on the shoulders of giants.

The applause on the call doesn't matter. Corporate beer doesn't matter. That bonus you've been eyeing for a year doesn't matter. You know you've made it. You've done your part. And you're proud of it. That's a distinct feeling of decimating any lingering vestiges of impostor syndrome.

I will always remember my time working with the SoCC-DV team at Micron, Hyderabad for this very reason - for taping out the first chip of my career.
