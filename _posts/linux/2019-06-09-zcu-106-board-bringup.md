---
layout: post
title: Starting with PetaLinux
category: linuxdoc
date: 2019-06-16
---

With Xilinx keeping its PetaLinux project open-source, it has become ridiculously easy to get a custom Linux version running on Xilinx's development boards. Although it gets the job done easily, there is a presence of a thick layer of abstraction involved.  
It is still a good jumpstart, nonetheless.


---
<br>
<br>

## What Is PetaLinux

An excerpt from the official [PetaLinux page](https://www.xilinx.com/products/design-tools/embedded-software/petalinux-sdk.html) reads:

```
PetaLinux tools eases the development of Linux-based products,
all the way from system boot to execution with the following tools:

* Command-line interfaces
* Application, Device Driver & Library generators and development templates
* Bootable system Image builder
* Debug agents
* GCC tools
* Integrated QEMU Full System Simulator
* Automated tools
* Support for Xilinx System Debugger

With these tools developers can customize the boot loader, Linux kernel, or Linux applications.
They can add new kernels, device drivers, applications, libraries, and boot and test
software stacks on the included full system simulator (QEMU) or on physical hardware via
network or JTAG.
```

For ease of understanding, I will unapologetically consider it an exceedingly-beastly version of the Arduino IDE.  
Both, the Arduino IDE and PetaLinux, are tools that are meant for deploying custom software on targeted hardware.  
The Arduino IDE provides a bare-metal implementation, which gets converted into the required assembly instructions depending on the hardware definitions stored for the target hardware selected (Uno, Mega, Duemilanove, etc)  
Similarly enough, PetaLinux generates the Linux environment (device tree, multi-stage bootloaders, PMU firmware, etc) depending on the hardware defintions provided to it.  
These hardware defintions can come either in the form of a BSP (board support package) available for download from Xilinx [directly on this page](https://www.xilinx.com/support/download/index.html/content/xilinx/en/downloadNav/embedded-design-tools.html), or be generated via [Vivado](https://www.xilinx.com/products/design-tools/vivado.html) for some custom hardware that achieves the minimum hardware requirements for running Linux.


---
<br>
<br>

## Starting with PetaLinux

Xilinx's [user guide for starting with PetaLinux](https://www.xilinx.com/support/documentation/sw_manuals/xilinx2018_2/ug1144-petalinux-tools-reference-guide.pdf) can be safely assumed the holy grail for an easy start.  

For most tasks, the linked user-guide is enough.  
There are many things to be taken care about, however, and a list of applications that must be installed to make the PetaLinux environment work.

PetaLinux runs on [Yocto](https://www.yoctoproject.org/). I'll strongly advise to go through the website (at least the homepage) to get an understanding of what is done. How it's done is a different ballgame.

A few important things for working with PetaLinux are mentioned below.

---
<br>
<br>

### SState-Cache

Shared State Cache (or *sstate-cache*) is important.  
It will significantly reduce build-time and internet usage. It is a collection of multiple objects required during the build process like already compiled files and previously run tasks.  
The size of this folder can bloat to more than 50 GiB. It's **not** a good idea to store it in the `/opt/` folder. Why, you ask?  
1. The space on that partition is precious.
2. Permissions to the that folder would required to be changed (`chmod 777`).

If you don't face any of these problems, feel free.

### BSP Generation

On the [download page](https://www.xilinx.com/support/download/index.html/content/xilinx/en/downloadNav/embedded-design-tools.html), make sure to choose the correct BSP depending on the PetaLinux version from the left pane.  
For generating a custom BSP, there are still some posts floating around on the internet that instruct using the SDK to build the BSP from the hardware definition files. Please note that PetaLinux (v17 onwards) integrates this task in its toolchain and can feed from the hardware definitions directly using the `--get-hw-description` flag while running `petalinux-config`.

### Custom Device Trees

When writing your custom device tree, *append* your changes to the main dts file by editing the contents of `system-user.dts` or `system-top.dts` file. Make sure these files are included in the main device-tree file inside the `components` folder.


---
