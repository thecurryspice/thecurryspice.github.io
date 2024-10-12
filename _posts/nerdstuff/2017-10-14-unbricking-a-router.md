---
layout: post
title: De-bricking A Router
category: techblog
date: 2017-10-14
---

One of my friends brought in a router ([TL-WR841N v9](http://www.tp-link.com/us/download/TL-WR841N_V9.html)) today, which was apparently bricked.<br>
It had failed while installing openWRT.<br>
My friend had already tried hooking up serial wires from the UART channel on the router to an Arduino Uno Board (a decent *jugaad* for an FTDI), but he said he was still stuck in a boot loop.<br>

While checking it myself, I found that the serial was receiving everything dumped by the router, first, the initialisation and second, looping around this message:<br>

```
## Booting image at 9e040000 ...
Uncompressing Kernel Image ... Too big uncompressed streamLZMA ERROR 1 - must RESET board to recover
```

<br>

Receiving data is easy, because most devices dump verbose output at 115200 bps, 9600 bps in some cases. The router was using 115200 bps.<br>
The router boots after providing a 1 second window to go into bootloader mode.<br>
According to openWRT forums, sending `acl`  in this window should have resulted in this message:

![uboot Commands](/assets/ubootCommands.jpeg "Arduino IDE's Serial Monitor")<br>

But what was happening instead was that anything I sent resulted in garbled bytes on the serial monitor<br>
Since all the debug messages are expected to follow a Unicode encoding, I wrote a short python script to check the integrity of the transmission.<br>

```python
import serial

PORT = /dev/ttyACM0
BAUD = 115200

serialReceiver = serial.Serial(PORT, BAUD)
if serialReceiver.isOpen():
    while 1:
        try:
            x = (serialReceiver.read()).decode("utf-8")
        except UnicodeDecodeError as ude:
            print("UDE")
``` 
<br>
And the moment I sent any character over to the serial, it would collapse for about 3 seconds, flooding the terminal with `UDE`  and then boot in normal mode, trying to uncompress the kernel image and obviously looping endlessly over it.<br>
The message was pretty self-explanatory, I had a hint of what would have happened.<br>
The router features a [cFeon Q32B-104HIP](http://www.kean.com.au/oshw/WR703N/teardown/EN25Q32B%2032Mbit%20SPI%20Flash.pdf) , which is a 4MB flash storage device.
Any kernel image that is uncompressed and run as an OS for the router must be limited to 4MB, but somehow, my friend had managed to forcibly flash an image greater than 4MB, and the kernel was not being properly setup. The board would then reset and encounter this issue again, looping around forever.<br>

This meant that the problem could be easily solved, given the serial transmission worked flawlessly.<br>
For that, I powered the router's UART with an external 3V3 supply to eliminate the possibility of the serial not working due to limited power from Uno's on-board AMS1117, and used two 10k-ohm pullup resistors to keep the serial lines to their default high state.<br>
I tried typing `acl`  and the serial worked flawlessly, at least my python script didn't throw out UDE even once.<br>

Now, all that was left was to use `tftpboot`  to flash a new image.<br>
In this mode, the router expects a TFTP Server running with some specific configurations, specifically the fixed IP and filename, which are displayed once tftpboot is entered, and then the device blindly starts copying that data and flashes itself. The stock images can be easily found on the router's website.

Windows and Mac have applications that can setup TFTP servers in a click.<br>
But for someone like me who uses Linux and is obsessed with CLI, [this](https://askubuntu.com/questions/201505/how-do-i-install-and-run-a-tftp-server) would help.