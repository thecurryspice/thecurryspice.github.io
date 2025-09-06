---
layout: post
title: Restarting in 2024
category: blogpost
date: 2024-10-12
---

Hmm...
The world ended in March 2020.
We are all ghosts today.
Or, well, were at least supposed to be, instead of the loves ones that became ghosts.

Four years later, so much has changed.  
Take `Jekyll`, for example. I make this post after 3 hours of peeling my eyes and pulling my hair while scrolling through StackOverflow.
It took me about forty trials to set up `rbenv` and `Jekyll` correctly, just to add this post.  
Frankly, I don't even know if the current setup is how it should be installed. All I know is that it works.  
Every new configuration line I add feels like removing a block from a Jenga tower. No matter how carefully I deal with this setup, it is bound to collapse in the future. As for the past, I would be remiss to not admit I haven't been active here since about the past three years. Here's a quick recap.

---
<br>

## Micron
By the end of two years at Micron, I owned the verification for the host-interface to our **first UFS 4.0 controller**. I wrote firmware, debugged waveforms, debugged datapath software on FPGA emulations, debugged link errors during post-silicon validation, and eventually got to a stage where I had enough understanding about the architecture to write high-performance firmware.<br>
What I cherished most though, was talking to engineers from multiple geographies and finding that everyone is as confused as the other. But engineers have this flex, that they hammer something here and wrench something there and find precisely and exactly what is wrong. The redemption of information and knowledge in that moment is nothing short of an adrenaline rush.

There are 3 key moments during my verification experience that I will never forget.
1. The most bugs I have found as a verification engineer were obviously in my own code. I remember facing a complex issue related to a datapath hang (which can occur due to any of its constituent IPs failing) that was found out to be a RTL issue. Pointers are quite common in high performance firmware (and they do nothing more than organise memory addressing). However, one flaw in a multi-level organisation of memory addresses can have effects that can easily push a developer to insanity. What I finally realised, after about two days of debugging (and I quote from my journal) was:
> "There's a pointer (P) to a pointer to a structure of pointers to lists of pointers to decoder-buffers (D). Pointer P receives an invalid value due to wrong arithmetic and makes the datapath hang because the decoder tries to access something not available on its memory bus. Ooof!"

2. The second moment was [validating the signs of silicon life in the first tapeout of my career](/folio/news/announcement_5)

3. Working with post-silicon validation was humbling, to say the least. The bursts that would take 30 hours to simulate on compute-farms would take 20 ms to finish in the real world. During the later days of post-silicon validation with an actual host, we were seeing an error in one of our end-to-end tests, where the device would be able transfer TiBs of data in low-performance modes, but would fail towards the trailing end of 2MiB when using its full bandwidth. This was weird. We rinsed through the firmware looking for modules going out of coordination after transferring ~2MiB of data. Next, we re-simulated everything in RTL. Several discussions ensued. There was a brooding sense of fear that maybe verification of some RTL misbehaviour was omitted.<br>
Whenever this happens, it is a great time to understand who likes to point fingers and who likes to own their code.<br>
A week later, different sort of expensive gadgets and scopes were brought in to log these real world transfers at 40Gbps happening on a 1W power budget.
I kid you not, we checked _everything_ from the firmware binary and handshake signals to the voltage measurements on the copper wires. Everything couldn't have been better. So, **what was wrong**? The team who was responsible for the hardware testbed boards offered to redo the entire setup. Their request was dismissed twice, under the claim that doing so would increase the work and introduce unknown errors instead of solving the obvious ones right now. The third time, they were allowed to do it. I was there with one of the other engineers when the frontend host interface was being disassembled. What we found while intending to clean the 8 coaxial copper cables that connected the RX-TX lanes between the host and the device, left us looking at each other almost on the simultaneous verge of tears and laughter. For some reason, I remember that moment with the memory of the tone that used to play when Mario would lose a life.<br>
These elite gold-plated coaxial cables had a pin at the centre, and a small tubular shielding on the side. A small section, hardly 20 degrees out of 360, of one of these cables had chipped off and was hanging loose. The touch of a finger dropped this gold plated flake on the white desk. It was this flake that was the reason that low-speed transfers worked flawlessly, but high-speed (high frequency) transfers saw all sorts of weird capacitance effects making the transfer fail roughly around the time when 2MiBs had been transferred. **1/12th of a 3mm tubular connector failing, overruled all the fault tolerance we had designed in all five layers of the communication stack ദ്ദി ༎ຶ‿༎ຶ )** - from the link level to the application firmware.

There's an unpopular saying in the semiconductor industry, I understood it in that moment.  
>"Semiconductor Engineering industry is not rocket science. It's more complex"


---
<br>

## Imagination

Saying goodbye to Micron was a tough decision. I was _restarting_ my career as a design engineer, essentially discarding the headstart and promotions I would have enjoyed had I stayed in verification. Imagination Technologies had already worked on an in-order CPU core, that they were trying to expand into a ASIL-D certified processor. The weight of responsibility is crazy. You certainly don't want the processor to delay triggering the Collision Avoidance System (CAS) because it was busy blinking the lights for the lane-assist.

Linting and CDC is mostly what was on my plate initially, and I was offered to work on a reset synchronisation logic for the lock-step cores. High frequency designs are structured very differently than high bandwidth designs. There was a lot to learn, and I started feeling that there was a lot more that I wanted to explore. I decided to pack my bags for future studies in designing hardware accelerators.

---
<br>

## Vancouver

I moved to Vancouver in Fall 2023. Some folks like the mountains. Some like the beach. Vancouver offers both!


{% include figure.liquid loading="eager" path="assets/img/posts/blog/2024-10-12/IonaTerminus.jpg" title="Somewhere around Iona Terminus" class="img-fluid rounded z-depth-1" %}
<div class="caption">
    Somewhere around Iona Terminus
</div>

{% include figure.liquid loading="eager" path="assets/img/posts/blog/2024-10-12/WhiteRock.jpg" title="Somewhere around White Rock" class="img-fluid rounded z-depth-1" %}
<div class="caption">
    Somewhere around White Rock
</div>

{% include figure.liquid loading="eager" path="assets/img/posts/blog/2024-10-12/StanleyPark.jpg" title="Somewhere around Stanley Park" class="img-fluid rounded z-depth-1" %}
<div class="caption">
    Somewhere around Stanley Park
</div>

---
<br>
<br>

## SFU

It is very important to choose where to stay while studying, and I feel lucky to have found accommodation at SFU's on-campus housing. It makes a huge difference. Here are a couple of photos from SFU campus. Both are HDR shots from a Samsung phone. No post edits. Someone professional might capture much better photos.

{% include figure.liquid loading="eager" path="assets/img/posts/blog/2024-10-12/campusFall.jpg" title="campusFall" class="img-fluid rounded z-depth-1" %}
<div class="caption">
    Sharad. Autumn. Here, it's called Fall because well ... leaves ... fall down. Captured late-October.
</div>

{% include figure.liquid loading="eager" path="assets/img/posts/blog/2024-10-12/campusMountain.jpg" title="campusMountain" class="img-fluid rounded z-depth-1" %}
<div class="caption">
    Always better to cry amidst mountains than on a busy street. Yes, this view is from campus. Captured mid-March.
</div>

The occasional deer and bear sightings are a bonus. The air is cleaning out my lungs as quickly as the expenses are clearing out my wallet. It is fun to return to student life. But let me not romanticise it for you. In another universe, I probably wouldn't have liked this change in lifestyle. This type of a lifestyle change is quite subjective and is only for the brave at heart.<br>
I am able to survive the delusion that I am ᕕ(⌐■_■)ᕗ ♪♬

hehe.

---
<br>
<br>

## HiAccel


[HiAccel Lab](https://www.sfu.ca/~zhenman/group.html) works on a breadth of topics related to computer engineering - HPC accelerators, novel architectures, and compiler support for the same. I am glad to continue my research on accelerator-rich architectures with brilliant, clever colleagues who share my interests and frustrations.

Three years ago, I had stopped updating this space.<br>
So what happened now? Did a horse kick my head?<br>
Why am I starting to write this blog again? Nobody reads it anyway.<br>
I don't know. But maybe humans scream the loudest when nobody is listening.
I shall scream into this void here, laying down human thoughts for some web-scraping AI chatbot to adopt into its learning of what makes text human.

I often wonder where I will fit better - academia or corporate.<br>
I don't know, honestly. All I know is that I am trying to find the right place, and just hang around.

{% include figure.liquid loading="eager" path="assets/img/posts/blog/unsorted/calvinhobbesrightplacetime.png" title="CHRightPlaceTime" class="img-fluid rounded z-depth-1" %}

