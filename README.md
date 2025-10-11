# ESP32 Marauder – Wireless Network Security Toolkit

This repository subdirectory documents the ESP32 Marauder, a portable Wi-Fi and Bluetooth auditing device, built during Sprint 2 of a cybersecurity capstone project. The purpose of the Marauder is to serve as an educational tool for network security testing in controlled environments. This work builds upon the WPA2/WPA3 handshake capture component of the larger project.

This sprint’s goal was to assemble, solder, wire, and flash the device to achieve a successful first boot. This effort contributes to the overall project objective of creating a modular network security training toolkit.

## Sprint 2 Highlights
*   Completed full hardware assembly and soldering of header pins.
*   Wired the TFT screen and ESP32 board according to a verified pin map.
*   Installed the CP210x driver and successfully flashed the Marauder firmware.
*   Booted the device and verified touchscreen response.
*   Created a detailed step-by-step assembly tutorial with photos.

## Quick Start (for replication)
To reproduce this setup, follow these steps:
1.  Navigate to the `ESP32_Marauder` directory or download this folder’s contents directly as a ZIP.
2.  Follow the assembly tutorial to build the hardware.
3.  Connect the ESP32 board to your computer via USB.
4.  Flash the board with the Marauder firmware using `esptool`.
5.  Test the device by powering it on and interacting with the interface.

## Deliverables
*   [Assembly Tutorial](Drafts/ESP32_Marauder_Assembly_Tutorial.md)
*   [Progress Update for AJ](deliverables/marauder_progress_update_for_AJ.md)
*   [Wiring Reference](deliverables/images/wiring_cheat_sheet.png)

## Next Steps (Sprint 3 Plan)
*   Integrate a portable power supply (battery).
*   Enable SD card logging and data storage.
*   Test EAPOL capture and handshake replay functionality.

***

*Disclaimer: This tool is intended for educational purposes in controlled lab environments. Unauthorized scanning or interference with wireless networks is illegal and unethical. Use responsibly.*
