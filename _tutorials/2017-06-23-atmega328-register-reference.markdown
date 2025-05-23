---
layout: post
title: ATmega328 Register Reference
img: assets/img/tutorials/atmega328Dark.png
date: 2017-06-23
comments: true
category: tutorials
---

*<sub>Last Updated : July 9th, 2017</sub>*

*This is a really quick reference for commonly used registers on the ATmega328/P. For further details on the usage of a specific register, relevant links have been provided in the register's section. For any registers not included here, please refer to the Register Summary (pg 428) of the Atmel ATmega328/P [datasheet](http://www.atmel.com/Images/Atmel-42735-8-bit-AVR-Microcontroller-ATmega328-328P_Datasheet.pdf "reading an epic is often boring"), which has been the holy grail for writing this article.*

______

<br>
<br>

## General Stuff

You may like to [skip this bullshit and get to the point](https://arbaranwal.github.io/tutorial/2017/06/23/atmega328-register-reference.html#reference-table "Absolutely!")

<br>
**avr/io.h**:   This is a stock library that must be included to work around directly with registers.

<br>
**Register**:   A register is a memory space inside the CPU itself and can be operated upon rapidly.  
                The individual bits of a register represent something specific.  
                Since most registers on an ATmega328 are 8 bit, the chip is termed an 8-bit processor.
                Registers and their corresponding bits have names.  

For example, one register in the chip is identified as ACSR. It stands for Analog compare Control and Status Register.

|Register|Offset|Bit7|Bit6|Bit5|Bit4|Bit3|Bit2|Bit1|Bit0|
|:---------:|:---------:|:---------:|:---------:|:---------:|:---------:|:---------:|:---------:|:---------:|:---------:|
|ACSR|0x50|ACD|ACBG|ACO|ACI|ACIE|ACIC|ACIS1|ACIS0|

<br>
Although we refer to the register by its name, the chip can't. It communicates with the register on a virtual address. The offset (here, 0x50) is the address on which the register resides. All communication between the chip and ACSR is done on address 0x50.


<br>
**Ports**   :   Ports on the ATmega328 are bi-directional I/O ports. Ports B and D are 8-bit while Port C is 7-bit.   

<br>
**_BV**     :   `_BV`  is a macro that is used to set a predefined specific bit.  
                <br>
                Usage:  
                *register* = _BV(*any-bit-of-that-register*) | _BV(*another-bit-of-that-register*)  

`ACSR = _BV(ACIE) | _BV(ACIS1) | _BV(ACIS0);`

<br>
**bitSet**  :   A function that can set a specific bit of an input byte.  
                <br>
                Usage:  

```c
byte register = 0b00000000;
bitSet(register,6); //sets 6th bit 1 (0b01000000)
ACSR |= register;  //modifies ACSR only if 6th bit was 0.
```

<br>
Unless there is a need of rewriting the whole register (which isn't a very popular need), it is sensible to use the "OR" operator while manipulating a register. This ensures that previously set bits are not affected.  
<br>

```c
//*register* = *register* | *8-bit-value*
ACSR = ACSR | 0b01001010;

//it's also acceptable to use hex values
ACSR = ACSR | 0x4A;
```

___

<br>
<br>

## Reference Table

|Register|Offset|Bit7|Bit6|Bit5|Bit4|Bit3|Bit2|Bit1|Bit0|
|:---------:|:---------:|:---------:|:---------:|:---------:|:---------:|:---------:|:---------:|:---------:|:---------:|
|[ADCSRA]|0x7A|ADEN|ADSC|ADATE|ADIF|ADIE|ADPS2|ADPS1|ADPS0|
|ADCSRB|0x7B|Reserved|ACME|Reserved|Reserved|Reserved|ADTS2|ADTS1|ADTS0|
|[ADMUX]|0x7A|REFS1|REFS0|ADLAR|Reserved|MUX3|MUX2|MUX1|MUX0|
|[PINB]|0x23|PINB7| PINB6| PINB5| PINB4| PINB3| PINB2| PINB1| PINB0|
|[DDRB]|0x24|DDRB7| DDRB6| DDRB5| DDRB4| DDRB3| DDRB2| DDRB1| DDRB0|
|[PORTB]|0x25|PORTB7| PORTB6| PORTB5| PORTB4| PORTB3| PORTB2| PORTB1| PORTB0|
|[PINC]|0x26|Reserved| PINC6| PINC5| PINC4| PINC3| PINC2| PINC1| PINC0|
|[DDRC]|0x27|Reserved| DDRC6| DDRC5| DDRC4| DDRC3| DDRC2| DDRC1| DDRC0|
|[PORTC]|0x28|Reserved| PORTC6| PORTC5| PORTC4| PORTC3| PORTC2| PORTC1| PORTC0|
|[PIND]|0x29|PIND7| PIND6| PIND5| PIND4| PIND3| PIND2| PIND1| PIND0|
|[DDRD]|0x2A|DDRD7| DDRD6| DDRD5| DDRD4| DDRD3| DDRD2| DDRD1| DDRD0|
|[PORTD]|0x2B|PORTD7| PORTD6| PORTD5| PORTD4| PORTD3| PORTD2| PORTD1| PORTD0|
|MCUCR|0x55|Reserved|BODS|BODSE|PUD|Reserved|Reserved|IVSEL|IVCE|
|[PRR]|0x64|PRTWI0|PRTIM2|PRTIM0|Reserved|PRTIM1|PRSPI0|PRUSART0|PRADC|
|[TIFR0]|0x35|Reserved|Reserved|Reserved|Reserved|OCFB|OCFA|TOV|
|[GTCCR]|0X43|TSM|Reserved|Reserved|Reserved|Reserved|Reserved|PSRASY|PSRSYNC|
|[TCCR0A]|0X44|COM0A1|COM0A0|COM0B1|COM0B0|Reserved|Reserved|WGM01|WGM00|
|[TCCR0B]|0X45|FOC0A|FOC0B|Reserved|Reserved|WGM02||CS0[2:0]|
|[TCNT0]|0X46||||TCNT0[7:0]|
|[OCR0A]|0X47||||OCR0A[7:0]|
|[OCR0B]|0X48||||OCR0B[7:0]|
|[TIMSK0]|0X6E|Reserved|Reserved|Reserved|Reserved|Reserved|OCIEB|OCIEA|TOIE|

_____

<br>
<br>

## Reference Image

Here's an image of an SMD ATMega328

![atmega328](/assets/atmega328.png "Open image in a new tab if doesn't show up")


_____

<br>
<br>

### ADC Control and Status Register A

| Register | Offset | Bit7 | Bit6 | Bit5 | Bit4 | Bit3 | Bit2 | Bit1 | Bit0 |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
|ADSCRA|0x7A|ADEN|ADSC|ADATE|ADIF|ADIE|ADPS2|ADPS1|ADPS0|

<br>
**ADEN** : ADC Enable<br>
Determines whether the ADC is enabled or not.

**ADSC** : ADC Start Conversion<br>
The ADC starts approximating a value when ADSC is set to 1. Bit is cleared after the conversion is complete.<br>
Clearing this bit does not make a difference.

**ADATE** : ADC Auto Trigger Enable<br>
Sets up the ADC to be triggered by the positive edge of the external signal.<br>
The external signal acts as a trigger and can be selected using ADTS in ADSCRB.<br>

**ADIF** : ADC Interrupt Flag
This bit is set when an ADC conversion completes and the Data Registers are updated.<br>
The ADIE bit and the I-bit in SREG must be set, or `sei()`  must have been called before.

**ADIE** : ADC Interrupt Enable
This bit controls whether ADIF is enabled or not.<br>
It serves as an interrupt mask for ADIF.

**Bits [2:0]** : ADPSn (ADC Prescalar Selection)
Selects the prescalar for the ADC clock frequency.

|ADPS[2:0]|Prescalar|
|:---:|:---:|
|000|2|
|001|2|
|010|4|
|011|8|
|100|16|
|101|32|
|110|64|
|111|128|

_____

<br>
<br>

### ADC Multiplexer Selection Register

| Register | Offset | Bit7 | Bit6 | Bit5 | Bit4 | Bit3 | Bit2 | Bit1 | Bit0 |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
|ADMUX|0x7c|REFS1|REFS0|ADLAR|Reserved|MUX3|MUX2|MUX1|MUX0|

<br>
**Bits [7:6]**  :   REFSn (*Reference Selection*)<br>
These bits select the voltage reference for the ADC.

|REFS[1:0] | Voltage Reference Selection|
|:---:|:---:|
|00| AREF, Internal V<sub>ref</sub> turned off|
|01| AV<sub>cc</sub> with external capacitor at AREF pin|
|10| Reserved|
|11| Internal 1.1V Voltage Reference with external capacitor at AREF pin|

<br>
The 1v1 voltage reference has a tolerance of about 10%. This is awful as it produces swings of 100 millivolts. Although it works fine for crude applications with reasonable parameters, do not rely on this reference for sensitive applications. Rather, consider the use of the widely popular TL431 precision shunt regulator.

<br>
**Bits [3:0]**  :   Determine the analog channel connected to the ADC.

| MUX[3:0] | AD Channel Input |==  ==| MUX[3:0] | AD Channel Input |
|:---:|:---:|---|:---:|:---:|
|0000|ADC0||1000|[Temperature sensor](https://akhilrb.github.io/tutorial/2017/07/22/temperature-sensor.html "An inbuilt temperature sensor? WHAAAAT?")|
|0001|ADC1||1001|Reserved|
|0010|ADC2||1010|Reserved|
|0011|ADC3||1011|Reserved|
|0100|ADC4||1100|Reserved|
|0101|ADC5||1101|Reserved|
|0110|ADC6||1110|1.1V (V<sub>BG</sub>)|
|0111|ADC7||1111|0V (GND)|


_____

<br>
<br>
### DDRx, PORTx and PINx


**DDRx**    : Data Direction Register for port 'x'  
                The DDRx register is responsible for initialising the pins for use either as inputs or outputs.  
                A 1 bit signifies a pin initialised as output. A 0 bit signifies a pin initialised as input.  

`DDRD = 0b01000100`  initialises pins 2, 6 as output, pin 0,1,3,4,5,7 as input.  

**PORTx**    : Defines state of Output Pins on port 'x'  
                The PORTx register determines whether the output state of a pin is HIGH or LOW.  
                A 1 bit signifies HIGH and 0 signifies LOW.  
                DDRx takes precedence over PORTx. A pin previously defined as input won't be affected by PORTx. The pin must be initialised as an output by DDRx first to manipulate it through PORTx.

```c
DDRD =  0b01000100
PORTD = 0b01000000  //declares pin 2 LOW and pin 6 HIGH.
```

**PINx**    : Reads state of Input Pins on port 'x'  
                The PINx register simply reads the value from the pins. This value, as obvious, is digital.  
                Although Port C pins have ADCs attached, they can still be used as digital GPIOs.


For a detailed article, look up [Advanced I/O](https://akhilrb.github.io/tutorial/2017/06/30/advanced-io.html) from my *Exploiting An Arduino* series.

<br>

**Port D**:

Available Registers: **PIND** *(0x29)*, **DDRD** *(0x2A)*, **PORTD** *(0x2B)*

Each register is 8-bit. [7:0] bits map from GPIO-7 to GPIO-0 respectively.


**Port B**:

Available Registers:  **PINB** *(0x23)*, **DDRB** *(0x24)*, **PORTB** *(0x25)*

Each register is 8-bit. [5:0] bits map from GPIO-13 to GPIO-8 respectively.  
[7:6] bits are reserved for oscillators.


**Port C**:

Available Registers: **PINC** *(0x26)*, **DDRC** *(0x27)*, **PORTC** *(0x28)*

Each register is 8-bit. *When using as GPIO*, [5:0] bits map from A5 to A0 respectively. These pins can be used as regular GPIOs.  
[7:6] bits are not accessible on the Uno board.


**NOTE**: PUD bit in MCUCR register is common to all GPIOs. It must be set to 0 to use Input Pullup resistors on GPIO pins.


_____

<br>
<br>

### Power Reduction Register

The Power Reduction Register (PRR) can minimise power usage by selectively switching off specific hardware on the chip.


**PRTWI0**: Power Reduction TWI0 (*Bit 7*)  
                Setting this bit shuts down the TWI 0 by stopping the clock to the module. When waking up  
                the TWI again, the TWI should be re initialized to ensure proper operation.

**PRTIM2**: Power Reduction Timer/Counter2 (*Bit 6*)  
                Setting this bit shuts down the Timer/Counter2 module in synchronous mode (AS2 is 0).  
                When the Timer/Counter2 is enabled, operation will continue like before the shutdown.

**PRTIM0**: Power Reduction Timer/Counter0 (*Bit 5*)  
                Setting this bit shuts down the Timer/Counter0 module. When the Timer/Counter0 is  
                enabled, operation will continue like before the shutdown.

**PRTIM1**: Power Reduction Timer/Counter1 (*Bit 3*)  
                Setting this bit shuts down the Timer/Counter1 module. When the Timer/Counter1 is  
                enabled, operation will continue like before the shutdown.

**PRSPI0**: Power Reduction Serial Peripheral Interface (*Bit 2*)  
                If using debugWIRE On-chip Debug System, this bit should not be written to one. Writing a logic one to  
                this bit shuts down the Serial Peripheral Interface by stopping the clock to the module. When waking up  
                the SPI again, the SPI should be re initialized to ensure proper operation.

**PRUSART0**: Power Reduction USART0 (*Bit 1*)  
                Setting this bit shuts down the USART by stopping the clock to the module. When waking  
                up the USART again, the USART should be re initialized to ensure proper operation.

**PRADC**: Power Reduction ADC (*Bit 0*)  
                Setting this bit shuts down the ADC. The ADC must be disabled before shut down. The
                analog comparator cannot use the ADC input MUX when the ADC is shut down.

___
<br>
<br>

### TC0 Control Register A

| Register | Offset | Bit7 | Bit6 | Bit5 | Bit4 | Bit3 | Bit2 | Bit1 | Bit0 |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
|TCCR0A|0X44|COM0A1|COM0A0|COM0B1|COM0B0|Reserved|Reserved|WGM01|WGM00|

<br>
**Bis[7:6]**: Compare Output Mode for Channel A.

<br>
When WGM bits are selected to CTC (non-PWM):

|COM0A1|COM0A0|Description|
|:---:|:---:|:---:|
|0|0| Normal port operation, OC0A disconnected|
|0|1| Toggle OC0A on Compare Match|
|1|0| Clear OC0A on Compare Match|
|1|1| Set OC0A on Compare Match|

<br>
When WGM bits are set to Fast PWM:

|COM0A1|COM0A0|Description|
|:---:|:---:|:---:|
|0|0|Normal port operation, OC0A disconnected.|
|0|1|WGM02 = 0: Normal Port Operation, OC0A Disconnected<br>WGM02 = 1: Toggle OC0A on Compare Match|
|1|0|Clear OC0A on Compare Match, set OC0A at BOTTOM (non-inverting mode)|
|1|1|Set OC0A on Compare Match, clear OC0A at BOTTOM (inverting mode)|

<br>
When WGM bits are set to Phase-Correct PWM:

|COM0A1|COM0A0|Description|
|:---:|:---:|:---:|
|0|0|Normal port operation, OC0A disconnected.|
|0|1|WGM02 = 0: Normal Port Operation, OC0A Disconnected<br>WGM02 = 1: Toggle OC0A on Compare Match|
|1|0|Clear OC0A on Compare Match, set OC0A at BOTTOM (non-inverting mode)|
|1|1|Set OC0A on Compare Match, clear OC0A at BOTTOM (inverting mode)|

<br>
<br>
**WGM0[2:0]**:  Waveform Generation Mode. WGM00 and WGM01 are found in TCCR0A and WGM02 in TCCR0B.<br>


|Mode|WGM02|WGM01|WGM00|Mode of Operation|TOP|Update of OCR0x at|TOV Flag Set on|
|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
|0|0|0|0| Normal| 0xFF| Immediate| 0xFF|
|1|0|0|1| Phase Correct PWM| 0xFF| TOP| 0x00|
|2|0|1|0| CTC| OCRA| Immediate| 0xFF|
|3|0|1|1| Fast PWM| 0xFF| 0x00| 0xFF|
|4|1|0|0| Reserved| -| -| -|
|5|1|0|1| Phase Correct PWM| OCRA| TOP| 0x00|
|6|1|1|0| Reserved| -| -| -|
|7|1|1|1| Fast PWM| OCRA| 0x00| TOP|

___
<br>
<br>

### TC0 Control Register B

| Register | Offset | Bit7 | Bit6 | Bit5 | Bit4 | Bit3 | Bit2 | Bit1 | Bit0 |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
|TCCR0B|0X46|FOC0A|FOC0B|Reserved|Reserved|WGM02|CS02|CS01|CS00|

<br>
**Bits[2:0]**:  Determine Clock Source to be used.
<br>

|CA02|CA01|CS00|Description|
|:---:|:---:|:---:|:---:|
|0|0|0|No clock source (Timer/Counter stopped)|
|0|0|1|clk I/O /1 (No prescaling)|
|0|1|0|clk I/O /8 (From prescaler)|
|0|1|1|clk I/O /64 (From prescaler)|
|1|0|0|clk I/O /256 (From prescaler)|
|1|0|1|clk I/O /1024 (From prescaler)|
|1|1|0|External clock source on T0 pin. Clock on falling edge|
|1|1|1|External clock source on T0 pin. Clock on rising edge|


___
<br>
<br>
### TC0 Interrupt Flag Register

| Register | Offset | Bit7 | Bit6 | Bit5 | Bit4 | Bit3 | Bit2 | Bit1 | Bit0 |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
|TIFR0|0X35|Reserved|Reserved|Reserved|Reserved|Reserved|OCF0B|OCF0A|TOV0|

<br>
**Bit 2**: Output Compare Flag B<br>
Bit is set when a Compare Match occurs between the timer and the data in OCR0B.<br>
OCF0B is cleared by hardware when executing the corresponding interrupt handling vector. Alternatively, OCF0B is cleared by writing a logic one to the flag.

**Bit 1**: Output Compare Flag A<br>
Bit is set when a Compare Match occurs between the timer and the data in OCR0A.<br>
OCF0A is cleared by hardware when executing the corresponding interrupt handling vector. Alternatively, OCF0A is cleared by writing a logic one to the flag.

<br>
**Bit 0**: Timer Overflow<br>
Bit is set when an overflow (increment past 0xFF) occurs in the timer.<br>
TOV0 is cleared by hardware when executing the corresponding interrupt handling vector. Alternatively, TOV0 is cleared by writing a logic one to the flag.<br>
This flag is dependent on WGM mode.

___

[ADCSRA]:   atmega328-register-reference.html#adc-control-and-status-register-a "ADC Control and Status Register A"
[ADMUX]:    atmega328-register-reference.html#adc-multiplexer-selection-register "ADC Multiplexer Selection Register"
[DDRB]:     atmega328-register-reference.html#ddrx-portx-and-pinx "Data Direction Register B"
[PORTB]:    atmega328-register-reference.html#ddrx-portx-and-pinx "Port B Data Register"
[PINB]:     atmega328-register-reference.html#ddrx-portx-and-pinx "Input Pins Register B"
[DDRC]:     atmega328-register-reference.html#ddrx-portx-and-pinx "Data Direction Register C"
[PORTC]:    atmega328-register-reference.html#ddrx-portx-and-pinx "Port C Data Register"
[PINC]:     atmega328-register-reference.html#ddrx-portx-and-pinx "Input Pins Register C"
[DDRD]:     atmega328-register-reference.html#ddrx-portx-and-pinx "Data Direction Register D"
[PORTD]:    atmega328-register-reference.html#ddrx-portx-and-pinx "Port D Data Register"
[PIND]:     atmega328-register-reference.html#ddrx-portx-and-pinx "Input Pins Register D"
[DDRx]:     atmega328-register-reference.html#ddrx-portx-and-pinx "Data Direction Register"
[PORTx]:    atmega328-register-reference.html#ddrx-portx-and-pinx "Port Data Regsiter"
[PINx]:     atmega328-register-reference.html#ddrx-portx-and-pinx "Input Pin Regsiter"
[PRR]:      atmega328-register-reference.html#power-reduction-register "Power Reduction Register"
[TIFR0]:    atmega328-register-reference.html#tc0-interrupt-flag-register "Timer Interrupt Flag Register"
[TCCR0A]:    atmega328-register-reference.html#tc0-control-register-a "TC0 Control Register A"
[TCCR0B]:    atmega328-register-reference.html#tc0-control-register-b "TC0 Control Register B"
[TCNT0]:    atmega328-register-reference.html#tc0-counter-value-register
[OCR0A]:    atmega328-register-reference.html#tc0-output-compare-register-a
[OCR0B]:    atmega328-register-reference.html#tc0-output-compare-register-a
[TIMSK0]:    atmega328-register-reference.html#tc0-interrupt-mask-register
[GTCCR]:    atmega328-register-reference.html#general-tc-control-register
