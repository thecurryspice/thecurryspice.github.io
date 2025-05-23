---
layout: post
title: "Hidden Temperature Sensor"
date: 2017-07-22
author: Akhil Raj Baranwal
category: tutorial
img: assets/img/tutorials/tempGraphC.jpeg
---
<sub>*Last Updated : July 22, 2017*</sub>

*Well, it's not exactly a clickbait. Because there is indeed an internal temperature sensor in ATmega328(P). But I can't say it's hidden because it's mentioned in the datasheet.*<br>

___
<br>
<br>
## How I Played Sherlock

While reading the [ATmega328 datasheet](http://www.atmel.com/Images/Atmel-42735-8-bit-AVR-Microcontroller-ATmega328-328P_Datasheet.pdf "Sometimes, reading an epic is boring") for preparing a concise [register-reference](https://arbaranwal.github.io/tutorial/2017/06/23/atmega328-register-reference.html "A reference for common ATmega registers"), I came across the [ADMUX register](https://arbaranwal.github.io/tutorial/2017/06/23/atmega328-register-reference.html#adc-multiplexer-selection-register), which listed a temperature sensor's analog channel included in the MUX[3:0] bit-description table.<br>

Wait what? Inbuilt Temperature Sensing?

Ctrl+F took me to Page 316, titled **Temperature Measurement**, which had the following information written in abstruse technical words:<br>

* The temperature measurement is based on an on-chip temperature sensor that is coupled to a single ended temperature sensor channel.
* The sensor is activated by writing ADMUX[3:0] as 1000.
* The internal 1.1V voltage reference must also be selected for the ADC voltage reference source to give better results.

Furthermore, the sensor's output voltage finds an approximate linear relation with the temperature:

|Temperature|-45°C|+25°C|+85°C|
|---|---|---|---|
|Voltage|242mV|314mV|380mV|

<sub>*Typical Cases*</sub>

___
<br>
<br>
## Try It!

No external connections are required, the Arduino board is enough.

```c
#include <avr/io.h>

void readTemp()
{
  //setup Analog Channel Input to
  //Internal Temperature Sensor
  ADMUX |= _BV(MUX3);

  //give some time to set it up.
  delay(5);

  //Start Conversion
  ADCSRA |= _BV(ADSC);
  while (bit_is_set(ADCSRA,ADSC));

  //read analog data from both registers
  uint8_t low  = ADCL;  
  uint8_t high = ADCH;

  //merge data
  int reading = ((high << 8) | low);

  //calculate corresponding temperature
  float result = (((reading) - 314)*0.942 + 25);

  Serial.print(reading);
  Serial.print("\t");
  Serial.println(result);
}

void setup()
{
  //setup internal 1.1V reference
  ADMUX = _BV(REFS1) | _BV(REFS0);

  Serial.begin(115200);
}

void loop()
{
  //calling analogRead somwhere else in the code
  //can possibly disturb our configuration
  //of ADC settings.
  readTemp();

  delay(1000);
}
```

___
<br>
<br>
## Testing

The results from the [LM35] look so promising because they are precision integrated-circuit temperature devices with an output voltage linearly proportional to the Centigrade temperature. It is pre-programmed to output only $$T\pm 0.5$$ <sup>o</sup>C.<br>

The output voltage for the ATmega's temperature sensor generally varies from one chip to another.<br>
What's also important is to notice that the output is measured against the internal 1.1V reference, which changes terribly, given it's a reference.<br>
Without calibration, I received horrendous results like these:<br>

|Actual Temperature<sub>Precision Thermometer</sub>|[LM35] Output|Inbuilt Temp Sensor|
|:---:|:---:|:---:|
|30.0|30.5|53.26|
|25.0|25.0|47.60|
|20.0|19.5|42.89|
|15.0|16.0|40.07|
|10.0|10.0|35.36|

<sub>*All measurements in degrees Centigrade*</sub>

To take readings, I assumed a linear plot which gave this equation<br>
<div id="equation">$$ y - 314 = \frac{138}{130}(x - 25) $$</div>
<br>
where $$y$$ is analog reading in mV and $$x$$ is <sup>o</sup>C.

{% include figure.liquid loading="eager" path="assets/img/tutorials/tempGraphNC.jpeg" title="Uncalibrated Tempertaure Graph" class="img-fluid rounded z-depth-1" %}

<div class="caption">
    Courtesy: Desmos Calculator
</div>

The above graph shows typical values in green and orange (well okay, turquoise and sienna), and measured-values in blue.<br>
The white line is x = 25<sup>o</sup>C.<br>
Note that I've assumed a direct linear interpolation between the minimum and maximum values for my readings (blue), which gives an effective slope of **1.0615** (or $$\frac{138}{130}$$).

Yes, I sat in an air-conditioned room to allow the temperature to drop from 30<sup>o</sup>C to 20<sup>o</sup>C, and then put everything in a refrigerator to get to 10<sup>o</sup>C.<br>
And I wonder where my free time goes.<br>

Let's not consider readings below 20<sup>o</sup>C, because I feel that the encapsulating epoxy layer of the ATmega chip would have acted as an insulator for the temperature sensor inside, thereby creating a decent temperature gradient. And the time for which the ATmega was in the refrigerator wouldn't have been enough to bring down the chip's temperature.

But that does not explain the effing 23<sup>o</sup>C gap at room temperature, does it?

I was pretty sure that the reference I was using (the inbuilt 1.1V voltage reference) wasn't actually giving out 1.1V.<br>
Blind shot, but worth it.<br>

The AREF pin outputs the current voltage reference being used. Measuring it resulted in, well, 1.02 V.<br>
Doing some reverse math, it can be seen that<br>
<div>$$(58.48 - 30)(1.0615) + 314 = 344$$</div>
which is the reading that I would have received from the analog reading.<br>
Adjusting this reading for a reference of 1.02V gives<br>
<div>$$344(\frac{1.02}{1.1}) = 319$$</div>
and 319 when put in the [original equation] gives 29.69, uncannily close to 30.<br>


|Actual Temperature<sub>Precision Thermometer</sub>|[LM35] Output|Inbuilt Temp Sensor|Adjusted Readings|
|:---:|:---:|:---:|:---:|
|30.0|30.5|53.26|29.69|
|25.0|25.0|47.61|24.99|
|20.0|19.5|42.89|20.29|
|15.0|16.0|40.07|17.46|
|10.0|10.0|35.36|13.10|

<sub>*All measurements in degrees Centigrade*</sub>

<br>
The new correction gave a plot that snapped right onto the given typical graph. Well, almost.
![Calibrated Temperature Graph](/assets/tempGraphC.jpeg "Courtesy: Desmos Calculator")

<br>
The complete graph can be viewed [here](https://www.desmos.com/calculator/0pedycxs39).<br>

___
<br>
<br>
## Calibration Specifics

I have a feeling that I haven't been able to clearly explain my calibration procedure. The following formula neatly compiles everything.<br>

<div>$$T = \frac{[(ADCH << 8) | ADCL] - 314 - E_{OS}}{k} + 25$$</div>

or, in proper English,

<div>$$Calibrated Value = \frac{(AnalogReading) - 314 - (ErrorOffset)}{V_{REF}CorrectionFactor} + 25$$</div>

To calculate the the V<sub>REF</sub> Correction Factor,

<div>$$k = \frac{138}{130}\times\frac{V_{AREF}}{1.1}$$</div>

* The Error-Offset is just present to fine tune the calibration and varies for individual practicals.
* It is recommended to [use the EEPROM](https://arbaranwal.github.io/tutorial/2017/08/05/eeprom.html) to store the values of variables.
* The process is a one-time calibration if the supply voltage doesn't change much.
* Please note that the above formulas are applicable for any voltage-reference used.

___
<br>
<br>

*I feel it's quite a previlege for millenials to witness such grand tech while using elementary mathematics and basic computers. I mean, it doesn't really require **actually** knowing about thermocouples to use the temperature sensor. It's just there, and anyone with enough brains to read the datasheet can use it easily. It's obvious that all this grand tech is not the brainchild of just one person, but a collective effort of thousands of people. What is also obvious is that we have reached a stage where a human cannot be expected to store all the open-source data in the world.*<br>
*Therefore, as true **millenials**, it is nothing but our ethical duty to choose specific areas that interest us, so that we can collectively contribute and make things worth being proud of.*<br>
*Otherwise millenials will be easily tagged as comparitively the most educated people with the lowest contributions in all of human history.*

[original equation]: temperature-sensor.html#testing
[LM35]: http://www.ti.com/lit/ds/symlink/lm35.pdf "LM35's datasheet from Texas Instruments"
