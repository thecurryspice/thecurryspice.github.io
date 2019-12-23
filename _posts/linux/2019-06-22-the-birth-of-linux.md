---
layout: post
title: A Brief History of Linux
category: linuxdoc
date: 2019-06-16
---

As engaging as the history of the creation of Linux is, it is also a stark reminder of the fact of how impressively seemingly-orthogonal events conspired towards the birth of the open-source revolution.

We'll wrap back our timelines to about 1960, when most research groups started requiring computational services, but not everyone had the resources or the skills required to operate a computer.  
It was then, when a time-shared system was necessary. MIT and General Electric, in collaboration with [Bell Labs](https://en.wikipedia.org/wiki/Bell_Labs), started developing a system called **MULTiplexed Information and Computing Service (MULTICS)**. This service allowed multiple users to access the mainframe at once.  
The mainframe being used was General Electric's 36-bit GE-645. It used 36-bit words and 18-bit addresses.  
Notice that an address of 18 bits means a total of **only 1KiB words**. The GE-600 series also included a channel-controller for handling I/O, that derived instructions from the CPU and raised an interrupt whenever the job was done. This facilitated the time-sharing model of the CPU.  
Very crudely, this model of handling I/O has been refined exponentially to employ PRUs (Programmable Realtime Units) and RPUs (Realtime Processing Units).

---
<br>
<br>

## The Birth of Unix

Given the limited tools and experience to manage software development at that time, the MULTICS project did not make significant progress. Dissatisfied, Bell Labs withdrew their participation in the project.  
However, <a title="Ken Thompson, Dennis Ritchie, Doug McIlroy, Joe Ossanna, and others">some programmers at Bell Labs</a> decided to redo the work, which was named **UNiplexed Information and Computing Service** (UNICS), *intended as a pun* on the MULTICS project, which was finally spelled as Unix. Since Unix was a single-tasking system, the first use it saw was that of a word processor. Automating the formatting and beautification of printed text on a cheap system was a huge deal because everything from journals to official manuals were produced using typists.  
Undettered by the notion of an operating system being sophisticated enough to be written only in assembly language, Ken Thomoson and Dennis Ritchie rewrote Unix in C in 1973. This move offered portability and the demand for Unix saw a sharp rise.  
Let's digress a little.  
3 years earlier, Intel had launched **8008**, *the first 8-bit processor*. This was significant because Intel, at that time, was primarily a DRAM manufacturer. The 8008 incorporated its memory within itself, and even though it was a processor, it didn't expose any address pins for this reason, and therefore came in a small form factor of only 18 pins.  
The **16-bit 8080** was released a couple years later, which had a separate address bus and a few other features, exposing 40 pins. During this time, companies like Intel, Motorola, National Semiconductor, Zilog started producing 16-bit and 32-bit processors. Zilog was born as a startup by Intel's employees, who produced the famous cheap and cloned enhancement of the 8080, the [Zilog Z80](https://en.wikipedia.org/wiki/Zilog_Z80), which found its use in everything from cash registers to military products. Since the Zilog Z80 had the same architectural backbone as that of the 8080, it was software-compatible, making it readily accepted by giants like Toshiba, NEC and Hitachi. The revenue generated from the Zilog Z80 was huge enough to let Zilog set up its own chip manufacturing factories!

In a response to all of these advances in the processor industry and widespread acceptance of mainframe computing, Intel tried coming up with [iAPX 432](https://en.wikipedia.org/wiki/Intel_iAPX_432), which was supposed to be a 32-bit architecture, but failed miserably, unfortunately.  
As a backup/side-project, Intel, in 1976, unintentionally seeded a butterfly effect in the commercial-processor industry by releasing the successor of the 8080 and the 8085, the **16-bit 8086** processor. Due to its involved CISC philosophy, the 8086 was able to use its 16-bit capabilities in a much more programmer-friendly and efficient manner. Most notable was the use of **base+offset addressing** and **support for signed integers**, which made it extremely useful in accounting and financing markets. After the widespread use of the 8086, Intel kept refining its design, creating the famous x86 architecture.  
Widespread commercial availability meant cheaper market costs. In around 1981, Microsoft (with its aim of Personal Computers) used x86 to deploy MS-DOS, which initially became popular because it provided direct control over the hardware, which was essential for playing games. The 32-bit x86 architecture stayed with Microsoft for long enough to make a deep indentation in the 32-bit software section. This is mostly why libraries which support 32-bit architectures are still tagged `i386` and 32-bit program files are structured under `Program Files (x86)` folder.  

Let's come back to 1973 now.  
An excerpt from Wikipedia says:  
*The Unix operating system was first presented formally to the outside world at the 1973 Symposium on Operating Systems Principles, where Ritchie and Thompson delivered a paper. This led to requests for the system, but under a 1956 consent decree in settlement of an antitrust case, the Bell System (the parent organization of Bell Labs) was forbidden from entering any business other than "common carrier communications services", and was required to license any patents it had upon request.<sub>[ref](http://www.groklaw.net/article.php?story=20050414215646742)</sub>  
Unix could not, therefore, be turned into a product. Bell Labs instead shipped the system for the cost of media and shipping. Ken Thompson quietly began answering requests by shipping out tapes and disks, each accompanied by – according to legend – a note signed, "Love, Ken"<sub>[ref](http://www.faqs.org/docs/artu/ch02s01.html)</sub>*

This was possibly the first time when someone freely distributed their code for the larger benefit of the developer-community. Since Unix was now distributed freely, a lot of versions of Unix spawned, BSD, AT&T Unix, etc.  

---
<br>
<br>

## POSIX

(Portable Operating System Interface) POSIX is a standard for operating systems.
Again, Wikipedia [here](https://en.wikipedia.org/wiki/POSIX) says:  
*Unix was selected as the basis for a standard system interface partly because it was "manufacturer-neutral". However, several major versions of Unix existed—so there was a need to develop a common denominator system. The POSIX specifications for Unix-like operating systems originally consisted of a single document for the core programming interface, but eventually grew to 19 separate documents (POSIX.1, POSIX.2, etc.).[5] The standardized user command line and scripting interface were based on the UNIX System V shell.[6] Many user-level programs, services, and utilities (including awk, echo, ed) were also standardized, along with required program-level services (including basic I/O: file, terminal, and network). POSIX also defines a standard threading library API which is supported by most modern operating systems. In 2008, most parts of POSIX were combined into a single standard (IEEE Std 1003.1-2008, also known as POSIX.1-2008).*

After the acceptance of POSIX, developers and programmers got a comprehensive guideline of how the APIs of a standardized OS should function.  
When Linux was initially developed by Linux Torvalds, POSIX standards were followed because it was based on MINIX, which was itself a POSIX compliant Unix-like operating system. On MINIX forums, Linus had openly asked about the problems in MINIX so that he could correct them in Linux. Since MINIX openly provided its source-code, but did not provide license for changing it, many programmers already knew what the problems were and how to possibly correct them as well. Seeking such mass review helped everyone accept the new software readily.  

**The Linux we know today is a blob of software consisting of GNU and the Linux kernel.**  
What GNU is another adventure to pursue, mostly because GNU stands for GNU's Not Unix.

---
<br>
<br>
*The Linux kernel was a personal project that Linus wrote specifically for the hardware he was using and independent of an operating system because he wanted to use the functions of his new PC with an 80386 processor.*

The above statement alone is enough to deride me, and for that matter, the entire education system that I am part of today. Every semester, I pick courses that I like depending on my academic interests. Unfortunately though, nearing the end of the semester, I always seem to have lost the curiosity towards the subject. Don't get me wrong, I love assignments, but I think there's something inherently wrong with the agreed syllabus that maybe limits what each individual wants to learn. Maybe a common syllabus, without sacrificing its content, can **never** actually satisfy every individual...

---
