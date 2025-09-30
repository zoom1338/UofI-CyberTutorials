# ESP32 Marauder – Progress Update

## Images
![First Issue with Marauder](images/1st_issue_with_marauder.jpg)
![Marauder Parts](images/maurader_parts.jpg)
![ESP32 Completed Flash](images/ESP32_completed_flash.png)
![ESP32 Pin Map](images/esp32_pin_map.png)

## Current Progress
- All required parts received and inventoried.
- ESP32 successfully flashed using ESP Web Tool (`ESP32_completed_flash.png` proves this).
- Breadboards and jumpers laid out.
- Blocker identified: TFT display missing soldered male headers on one side (see `1st_issue_with_marauder.jpg`). Assembly halted to prevent miswiring.

## Risks & Constraints
- Time loss last week due to exams, cheer, and work.
- Hardware delay: Soldering required before wiring can be completed.
- Cannot test TFT and SD card functionality until header fix.

## Next Steps
- Solder male headers to TFT module.
- Complete wiring between ESP32 and TFT display.
- Verify Marauder boots into UI.
- Test packet sniff + handshake capture in lab environment.
- Document each step with photos.

## Wiring Plan

### Required Hardware
- ESP32 Development Board (ESP-WROOM-32)
- 2.8" TFT Touch Screen with ILI9341 driver
- Breadboard(s)
- Jumper wires
- Female/male headers (soldering needed)

### Pin Mapping

| TFT / SD Pin | ESP32 GPIO Pin | Notes |
|--------------|----------------|-------|
| **VCC**      | 3.3V (VIN)     | Power supply for display |
| **GND**      | GND            | Common ground |
| **CS**       | GPIO17         | Chip select for TFT |
| **RESET**    | GPIO5          | Hardware reset |
| **D/C**      | GPIO16         | Data/Command |
| **SD_MOSI**  | GPIO23         | Master Out Slave In (SPI) |
| **SD_SCK**   | GPIO18         | SPI clock |
| **LED**      | GPIO32         | Backlight (can tie to 3.3V if always on) |
| **SD_MISO**  | GPIO19         | Master In Slave Out (SPI) |
| **T_CLK**    | GPIO18         | Touch clock (shares with SCK) |
| **T_CS**     | GPIO21         | Touch chip select |
| **T_DI**     | GPIO23         | Touch data in (shares MOSI) |
| **T_DO**     | GPIO19         | Touch data out (shares MISO) |
| **T_IRQ**    | Not Connected  | Optional (for touch interrupts) |
| **SD_CS**    | GPIO12         | SD card chip select |

### Diagram Reference
See `esp32_pin_map.png` in the Images section.

---
