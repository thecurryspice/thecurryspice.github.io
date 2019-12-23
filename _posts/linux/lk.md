# Linux Kernel

*This article is intended with a final aim of understanding the Linux kernel. It does not intend to be useful for Linux kernel development, which requires an understanding of various other dependencies like toolchains.*

At a given moment, the CPU can be working in one of these three states:
* Process Context
* Interrupt Context
* Kernel Context

Linux doesn't differentiate between processes and threads. It treats threads like processes which share memory.  
Processes can run either in **user-space** or **kernel-space**, depending on what is being executed.  
When executing compute routines, the process is in user-space, but it is in kernel-space when executing system calls.  
This is different from **user-mode** and **kernel-mode**, where the mode decides the priveleges of the process and, therefore, the system calls available to it.  
There'a a catch however. A process initiated in user-mode *can be elevated to kernel-space, but cannot change to kernel-mode*. From a perspective of security, this feature prevents corruption of kernel-data and kernel-memory itself.  
Therefore, even with UID=0, the CPU cannot perform kernel-mode operations (like maintaining page-tables for itself) when working in user-mode. The ability to change the *mode*, if allowed, would render the difference in the modes futile. Please read more about the security [here]("link to be updated") for an in-depth understanding of why this is in place.  
On a shallow level, it is safe to say that Linux uses only ring-0 (kernel-mode) and ring-3 (user-mode) only.  
The other two rings are available on x86 architectures and some kernels support it.

A fact to notice here is that the hardware does not know, and thus does not care about what it is being used for. It is the responsibility of the kernel to determine whether to make a particular system-call available to the process running in userland. In essence, all user-spawned processes always communicate with the kernel. The hardware, however, always runs just the kernel.

Linux is commonly described with two words: **preemptive** and **monolithic**.
### Preemptive : 

To pre-empt means to interrupt. Preemptive scheduling (in contrast to non-preemptive scheduling) does not weigh in a lot on allotting a specific *time-slice* to processes. Time-slice is the time interval for which a process runs on a processor. This means that processes can be interrupted while they are being executed. (This is where task-priorities come in, after which a whole web of controls of critical events come into picture.)

In non-preemptive scheduling, a process runs either for its allotted time-slice, or it continues to run unless it terminates itself. The former is a more common scheduling used for very minimal applications (for example, while arbitering using round-robin), the latter is a very rarely seen, finding use only in specifically targeted applications.

Non-preemptive kernels have a strict **determinism**, given their scheduling policy.  
But when preemptive scheduling is used, the system can spiral in deadlocks, undergo resource corruption, and create long extended [starvation](https://en.wikipedia.org/wiki/Starvation_(computer_science)) if contexts are not maintained properly, therfore an overhead is associated with scheduling these processes. This scheduling becomes cost-associative if data is shared between two processes.


### Monolithic :



## POSIX and Unix

### The History of UNIX

"What's the deal with POSIX and Unix? Why do I keep hearing POSIX and Unix so many times?"  

We'll wrap back our timelines to about 1960, when everyone started requiring computer services, but not everyone had the resources or the skills required to operate a computer.  
It was then, when a time-shared system was necessary. MIT and General Electric, in collaboration with [Bell Labs](https://en.wikipedia.org/wiki/Bell_Labs), started developing a system called MULTiplexed Information and Computing Service (MULTICS). This service allowed multiple users to access the mainframe at once.  
The mainframe being used was General Electric's 36-bit GE-645. It used 36-bit words and 18-bit addresses.  
Notice that an address of 18 bits means a total of only 1KiB words. The GE-600 series also included a channel-controller for handling I/O, that derived instructions from the CPU and raised an interrupt whenever the job was done. This facilitated the time-sharing model of the CPU.

Given the limited tools and experience to manage software development at that time, the project did not make significant progress. Dissatisfied, Bell Labs withdrew their participation in the project.  
However, Ken Thompson, Dennis Ritchie, Doug McIlroy, Joe Ossanna, and others decided to redo the work, which was named UNiplexed Information and Computing Service (UNICS), intended as a pun on the MULTICS project, which was finally spelled as Unix. Since Unix was a single-tasking system, the first use it saw was that of a word processor. Automating the formatting and beautification of printed text on a cheap system was a huge deal because everything from journals to official manuals were produced using typists.  
Undettered by the notion of an operating system being sophisticated enough to be written only in assembly language, Ken Thomoson and Dennis Ritchie rewrote Unix in C in 1973. This move offered portability and the demand for Unix saw a sharp rise.  
Let's digress a litle.  
3 years earlier, Intel had launched **8008**, *the first 8-bit processor*. This was significant because Intel, at that time, was primarily a DRAM manufacturer. The 8008 incorporated its memory within itself, and even though it was a processor, it didn't expose any address pins for this reason, and therefore came in a small form factor of only 18 pins.  
The 16-bit 8080 was released a couple years later, which had a separate address bus and a few other features, exposing 40 pins. During this time, companies like Intel, Motorola, National Semiconductor, Zilog started producing 16-bit and 32-bit processors. Zilog was born as a startup by Intel's employees, who produced the famed cheap cloned enhancement of the 8080, the [Zilog Z80](https://en.wikipedia.org/wiki/Zilog_Z80), which found its use in everything from cash registers to military products. Since the Zilog Z80 had the same architectural backbone as that of the 8080, it was software-compatible, making it readily accepted by giants like Toshiba, NEC and Hitachi. The revenue generated from the Zilog Z80 was huge enough to let Zilog set up its own chip manufacturing factories!  
In a response to all of these advances in the processor industry and widespread acceptance of mainframe computing, Intel tried coming up with [iAPX 432](https://en.wikipedia.org/wiki/Intel_iAPX_432), which was supposed to be a 32-bit architecture, but failed miserably.  
As a side-project, Intel, in 1976, unintentionally seeded a butterfly effect in the commercial-processor industry by releasing the successor of the 8080 and the 8085, the 16-bit 8086 processor. Due to its involved CISC philosophy, the 8086 was able to use its 16-bit capabilities in a much more programmer-friendly and efficient manner. Most notable was the use of *base+offset addressing* and *support for signed integers*, which made it extremely useful in accounting and financing markets. After the widespread use of the 8086, Intel kept refining its design, creating the famous x86 architecture.  
Widespread commercial availability meant cheaper market costs. In around 1981, Microsoft (with its aim of Personal Computers) used x86 to deploy MS-DOS, which initially became popular because it provided direct control over the hardware, which was essential for playing games. The 32-bit x86 architecture stayed with Microsoft for long enough to make a deep indentation in the 32-bit software section. This is mostly why libraries which support 32-bit architectures are still tagged `i386` and 32-bit program files are structured under `Program Files (x86)` folder.  

Let's come back to 1973 now.  
An excerpt from Wikipedia says:  
*The Unix operating system was first presented formally to the outside world at the 1973 Symposium on Operating Systems Principles, where Ritchie and Thompson delivered a paper. This led to requests for the system, but under a 1956 consent decree in settlement of an antitrust case, the Bell System (the parent organization of Bell Labs) was forbidden from entering any business other than "common carrier communications services", and was required to license any patents it had upon request.<sub>[ref](http://www.groklaw.net/article.php?story=20050414215646742)</sub> Unix could not, therefore, be turned into a product. Bell Labs instead shipped the system for the cost of media and shipping.  
Ken Thompson quietly began answering requests by shipping out tapes and disks, each accompanied by – according to legend – a note signed, "Love, Ken”.[ref](http://www.faqs.org/docs/artu/ch02s01.html)*

This was possibly the first time when someone freely distributed their code for the larger benefit of the developer-community. Since Unix was now distributed freely, a lot of versions of Unix spawned, BSD, AT&T Unix, etc.  
The Linux we know today is a blob of software consisting of GNU and the Linux kernel.

### POSIX

(Portable Operating System Interface) POSIX is a standard for operating systems.
Again, Wikipedia [here](https://en.wikipedia.org/wiki/POSIX) says:  
*Unix was selected as the basis for a standard system interface partly because it was "manufacturer-neutral". However, several major versions of Unix existed—so there was a need to develop a common denominator system. The POSIX specifications for Unix-like operating systems originally consisted of a single document for the core programming interface, but eventually grew to 19 separate documents (POSIX.1, POSIX.2, etc.).[5] The standardized user command line and scripting interface were based on the UNIX System V shell.[6] Many user-level programs, services, and utilities (including awk, echo, ed) were also standardized, along with required program-level services (including basic I/O: file, terminal, and network). POSIX also defines a standard threading library API which is supported by most modern operating systems. In 2008, most parts of POSIX were combined into a single standard (IEEE Std 1003.1-2008, also known as POSIX.1-2008).*

---

## Kernel Source Tree

Directory | Description
--------- | -----------
`arch` | Architecture-specific source
`block` | Block I/O layer
`crypto` | Crypto API
`Documentation` | Kernel source documentation
`drivers` | Device drivers
`firmware` | Device firmware needed to use certain drivers
`fs` | The VFS and the individual filesystems
`include` | Kernel headers
`init` | Kernel boot and initialization
`ipc` | Interprocess communication code
`kernel` | Core subsystems, such as the scheduler
`lib` | Helper routines
`mm` | Memory management subsystem and the VM
`net` | Networking subsystem
`samples` | Sample, demonstrative code
`scripts` | Scripts used to build the kernel
`security` | Linux Security Module
`sound` | Sound subsystem
`usr` | Early user-space code (called initramfs)
`tools` | Tools helpful for developing Linux
`virt` | Virtualization infrastructurehttps://en.wikipedia.org/wiki/Starvation_(computer_science)
