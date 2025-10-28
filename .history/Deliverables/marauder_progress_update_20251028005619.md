# ESP32 Marauder Progress Update

## Overview
- Successfully wired and flashed the ESP32 Marauder on a breadboard setup.
- Initial display issues were resolved after confirming proper SPI wiring and installing the correct CP210x USB-to-UART driver.
- All male header pins were soldered to ensure solid connectivity between the TFT and ESP32.

## Images & Progress

![First successful Marauder boot screen confirming firmware functionality.](images/first_boot_up.JPG)
*Caption: First successful Marauder boot screen confirming firmware functionality.*

![Soldering process using magnification setup for precision.](images/sauturing_missing_male_pins.jpg)
*Caption: Soldering process using magnification setup for precision.*

![Current breadboard wiring layout of the ESP32 and TFT screen.](images/wired_maurader.jpg)
*Caption: Current breadboard wiring layout of the ESP32 and TFT screen.*

![Wiring reference used for SPI, TFT, and SD card connections.](images/wiring_cheat_sheet.png)
*Caption: Wiring reference used for SPI, TFT, and SD card connections.*

## Current Status
- ESP32 Marauder boots and menu navigation works as expected.
- TFT display is functional and receiving power from the ESP32.
- Preparing to integrate a **portable power solution** (rechargeable lithium battery pack) to make the unit self-contained for field use.

## Next Steps
- Add portable USB/LiPo battery to test standalone operation.
- Validate SD card detection and logging functions.
- Clean up wiring layout for consistency and minimize interference.
- Run functional tests for Wi-Fi and Bluetooth scanning features.

## Future Plans
- Finalize stable wiring diagram for replication and documentation.
- Transition setup from breadboard to soldered perfboard or PCB for reliability.
- Test and log performance metrics (boot time, scan accuracy, and SD write validation).
- Prepare short demonstration and technical summary for next review session.
- Make a tutorial on how to get to where im at with building the murader!!!

## Next Meeting Goal
Ready for discussion with AJ at noon.
