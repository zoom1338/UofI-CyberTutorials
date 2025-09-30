# WiFi Cracking Lab Manual

This document provides concise guides for reproducing several WiFi security tutorials. It is intended for educational purposes and should only be used on networks you are authorized to test.

## 1. Building an ESP32 Marauder

A portable WiFi penetration testing tool for capturing handshakes and performing various network attacks.

- **Reference:** [Building ESP32 Marauder](https://www.youtube.com/watch?v=lcokJQMivwY)

### Hardware Needed
- ESP32 dev kit (ESP32 Wroom 32 recommended)
- 2.8-inch TFT touchscreen display with an integrated SD card reader
- Two miniature breadboards
- Female Dupont header pins (a row of 14 and a row of 4)
- Pre-cut jumper wires
- USB micro cable
- Power bank (optional, for portability)

### Setup and Flashing
The firmware must be flashed to the ESP32 *before* assembling the hardware.

1.  **Download Firmware:** Navigate to the ESP32 Marauder GitHub repository and find the latest release. You will need four files: the bootloader, partitions, boot app, and the `_oldhardware.bin` firmware file.
2.  **Use Web Flasher:** Use the `spaceon web updator` linked in the repository to flash the files.
3.  **Connect ESP32:** Connect the ESP32 to your computer. Select the correct serial port in the web flasher (e.g., `cp2102 USB to UART Bridge`). If it doesn't connect, you may need to install the appropriate drivers.
4.  **Upload Files:** Add each of the four downloaded files to the flasher at their specified memory addresses.
5.  **Program:** Click "Program" and wait for the process to complete. Once finished, you can disconnect the ESP32.

### Assembly
1.  **Consult Wiring Diagram:** Refer to the wiring table and pinout diagrams linked in the ESP32 Marauder GitHub repository's "old read me" file.
2.  **Mount Components:** Place the ESP32 and the female header pins for the display onto the breadboards.
3.  **Connect Wires:** Use jumper wires to connect the pins from the ESP32 to the corresponding pins for the display and SD card reader, following the wiring diagram precisely.
4.  **Attach Display:** Once all wires are connected, carefully plug the touchscreen display onto the header pins.
5.  **Power On:** Connect the ESP32 to a power source (USB cable or power bank) to boot the Marauder firmware.

### Key Steps & Expected Outputs
The device is operated via its touchscreen interface.
- **Scan for Networks:** Navigate to `Wi-Fi` > `Sniffers` > `Scan APs` to discover nearby networks.
- **Deauth Attack:** Kicks all devices off a target network.
- **Evil Portal Attack:** Creates a fake "Free WiFi" network. When a user connects and enters credentials into the captive portal, the credentials are saved to a log file on the SD card.

### Safety and Ethics
- **Authorized Use Only:** Deauthentication attacks are a form of denial-of-service and are illegal without explicit permission from the network owner.
- **Privacy:** Capturing credentials via an Evil Portal should only be done in a controlled lab environment for educational purposes.

### Reproduction Checklist
- [ ] Gather all required hardware components.
- [ ] Flash the ESP32 Marauder firmware using the web updater.
- [ ] Assemble the ESP32, screen, and breadboards according to the wiring diagram.
- [ ] Double-check all jumper wire connections for accuracy.
- [ ] Power on the device to confirm the Marauder firmware boots successfully.
- [ ] (Optional) Test functionality by scanning for networks.
