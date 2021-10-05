---
layout: post
title: VLC Sync on MQTT
category: techblog
date: 2018-06-06
---


[Please view the VMS (VLC MQTT Sync) project here.](https://github.com/arbaranwal/vms)<br>
VMS is a Python utility to keep multiple devices playing the same video file in sync, using MQTT. VMS has a very small network footprint, and works reliably well in situations of limited network bandwidth.

The rest of this post contains outputs of some performance benchmarks that I required for the VMS project, for which I was using a RaspberryPi SBC as a MQTT server. The following text contains no code, no explanations, and some data, generated out of nothing but sheer curiosity.

---

<br>
<br>
## Process

The performance stats were done in three stages:<br>
* **Idle** : Only the MQTT client along with some SSH sessions were running<br>
* **2 Cores maxed out** : Max CPU utilisation was measured to be 209% with an average of 199.6%
* **4 Cores maxed out** : Available RAM never fell below 521 MB with 111 MB active usage and about 260 MB cache

An Arduino Nano was programmed such that changes in ambient light would trigger a state change on one GPIO, which was picked up by the Raspberry Pi, which publishing the changes to the MQTT broker (cloud) *after* sending an acknowledgement pulse. The acknowledgement pulse would be picked up by the Nano as hardware latency, and the network analysis would be left to the Pi.
<br>

---
<br>
<br>
## Control Flow

* Nano detects change in ambient light and toggles state of its GPIO
* Raspberry Pi reads the state change and tries to send acknowledgement pulse instantaneously
* This hardware latency is measured by the Nano
* The appropriate message is published to the MQTT broker, and received on a laptop
* Network Latency is calculated by timing the `os.system()`  call and printed on CLI

---
<br>
<br>
## Hardware Parameters

* For the test, I used a Raspberry Pi 3B+ with a heatsink on the Broadcom chip.
* I guess the Pi was slightly underpowered with a 7.5 Watt power source, but I assumed it will be enough. Why? Because I'm too broke to get a better power source.
* There was no screen connected to the Pi, no USB peripherals, no VNC, except the WiFi obviously.
* The Arduino Nano was, well, a Chinese clone, which works brilliant.


The final hardware setup looked like this:

![hwsetup](/assets/hwsetup.jpg "I")

<sub>*If you're wondering where the light sensor is, it's the green LED connected to the analog input channel. At that time, I did not happen to have an LDR and my laziness forced me to use an LED instead of finding a more precise light sensor. Also, the original design of this awesome Raspberry Pi Case can be found [here](https://www.thingiverse.com/thing:922740).*</sub>

---
<br>
<br>
## Software Parameters

### Scripts

I wrote a Python script for managing the GPIOs using the `RPi.GPIO`  module. However, I didn't use any MQTT library for Python, rather, installed `mosquitto-clients`  and pushed the commands using `os.system()`.<br>
I used callbacks for detecting Nano's state changes, as that saved me from polling the GPIOs on a periodic basis, which would have required a sleep time.<br>
Using callbacks, I could create listeners for a specific channel and let the code loop endlessly, without straining the Pi with continuous GPIO polls.

### Stages

For stressing the cores, I used `sysbench`  and ran the conventional tests for calculating primes using different number of threads in different stages.<br>
The idle state meant maintaining 3 SSH sessions, including the one running the MQTT publisher.<br>
2 cores maxed out means that I ran `sysbench`  on one thread, because the continuous looping in the Python script had already utilised one core completely.<br>
However, for 4 cores, I used 4 threads to run `sysbench`  to really not produce any idle state for any core, at least virtually.<br>


---
<br>
<br>
## Network Parameters

### Internet

The Pi was connected to a smartphone hotspot with a host network enjoying 11 ms pings.<br>
MQTT doesn't need a lot of bandwidth, and the direct download speeds were exponentially more than what MQTT would ever use.<br>

### Local

I was logged into the Pi with three separate SSH sessions to:<br>
1. Log the MQTT output
2. Run `sysbench`
3. Monitor performance using `htop`

---
<br>
<br>
## The Data

<br>
<br>

---
<div style="font-size:30px; text-align:center">Almost Idle State</div>
---

|Ambient Light Changed At (ms)|RPi Responded At (ms)|Hardware Latency (ms)|Avg HW Latency (ms)|Network Latency (secs)|Avg Network Latency (secs)|
|:---:|:---:|:---:|:---:|:---:|:---:|
|2502	|2609	|107|107|0.7155358791|0.7155358791|
|4706	|4907	|201|154|0.6554811001|0.6855084896|
|8611	|8770	|159|155|0.9793241024|0.7834470272|
|10615	|10653	|38	|125|1.268370867|0.9046779871|
|13219	|13365	|146|129|0.9799640179|0.9197351933|
|15123	|15152	|29	|112|0.8042521477|0.900488019|
|28240	|28278	|38	|101|0.8299069405|0.8904050078|
|30645	|30681	|36	|92	|0.9476191998|0.8975567818|
|40758	|40840	|82	|90	|0.8499820232|0.8922706975|
|43561	|43672	|111|92 |0.8251478672|0.8855584145|


<br>
<br>

---
<div style="font-size:30px; text-align:center">2 Cores Maxed Out</div>
---

|Ambient Light Changed At (ms)|RPi Responded At (ms)|Hardware Latency (ms)|Avg HW Latency (ms)|Network Latency (secs)|Avg Network Latency (secs)|
|:---:|:---:|:---:|:---:|:---:|:---:|
|1000	|1024	|24	|24	|0.7759919167	|0.7759919167
|3304	|3329	|25	|24	|0.7156870365	|0.7458394766
|5107	|5216	|109|52	|0.80636096		|0.7660133044
|7712	|7917	|205|90	|1.59829998		|0.9740849733
|15322	|15332	|10	|74	|0.8282778263	|0.9449235439
|18827	|18832	|5	|62	|0.7700800896	|0.9157829682
|23734	|23966	|232|86	|0.8780038357	|0.9103859493
|29942	|30360	|418|127|0.8158609867	|0.898570329
|34049	|34162	|113|125|0.8401181698	|0.8920756446
|40357	|40416	|59	|118|0.7099101543	|0.8738590956


<br>
<br>

---
<div style="font-size:30px; text-align:center">4 Cores Maxed Out</div>
---

|Ambient Light Changed At (ms)|RPi Responded At (ms)|Hardware Latency (ms)|Avg HW Latency (ms)|Network Latency (secs)|Avg Network Latency (secs)|
|:---:|:---:|:---:|:---:|:---:|:---:|
|3403	|3530	|127	|127	|0.9647641182	|0.9647641182|
|8811	|10178	|1367	|747	|1.499953985	|1.232359052|
|17723	|22565	|4842	|2112	|6.080174923	|2.848297675|
|26534	|33438	|6904	|3310	|0.6842401028	|2.307283282|
|35446	|36558	|1112	|2870	|0.9954409599	|2.044914818|
|42556	|42766	|210	|2426	|0.7150270939	|1.823266864|
|||*Squashed Reading*	|		|0.6783769131	|1.659711157|
|57175	|57787	|612	|2199	|0.7496321201	|1.545951277|
|65586	|66101	|515	|2011	|0.9600679874	|1.480853134|
|73597	|73831	|234	|1833	|0.7069909573	|1.403466916|
|||*Squashed Reading*	|		|0.6708030701	|1.336861112|
|||*Squashed Reading*	|		|0.6886820793	|1.282846193|
|||*Squashed Reading*	|		|0.6935629845	|1.237516715|
|99730	|100326	|596	|1744	|0.9804048538	|1.219151582|
|104337	|105025	|688	|1673	|1.007570028	|1.205046145|
|112948	|113026	|78		|1573	|0.9525270462	|1.189263701|
|121159	|122044	|885	|1532	|0.8199808598	|1.167541181|
|135878	|136137	|259	|1461	|0.7443029881	|1.144027948|
|144589	|145337	|748	|1423	|0.7600209713	|1.123817055|

<sub>*Squashed Reading signifies an erroneous reading that occurred due to the Pi taking longer than 10 seconds to respond, because I believed it would corrupt the average data. The Nano was programmed to time this out and not consider these readings for evaluating the average. Note that the Network Latency readings for the squashed readings still exist, because the MQTT service was always functional*</sub>
