# web client to interface with beer dispenser

This is an attempt at making a webinterface to interact with GPIO pins on an ASUS tinkerboard to control the GPIO pins with a nifty webapp.

# GPIO

- [ ] Find suitable TS lib for gpio
- [ ] Dedicated libs for HX711 and DS21B (aka weight and temp)?
- [ ] Scrap the temp/weight entirely for the time being to get it working?

# Arduino or NodeMCU
Originally planned to do this directly via a fetch request with a NodeMCU but the latency was horrendous