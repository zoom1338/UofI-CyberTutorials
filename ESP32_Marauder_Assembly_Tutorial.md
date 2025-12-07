# ESP32 Marauder Assembly Guide

This tutorial provides a complete, step-by-step guide for assembling your own ESP32 Marauder, a powerful Wi-Fi and Bluetooth penetration testing tool. This guide covers the entire process from unboxing the components to the first successful boot of the Marauder firmware.

> **Disclaimer:** This device is intended for educational and research purposes only. Unauthorized scanning or interference with networks you do not own or have explicit permission to test is illegal. Always act responsibly and ethically.

---

## 1. Parts List

You will need the following components to build the ESP32 Marauder.

**Required Components:**
*   ESP32-WROOM-32 Development Board
*   2.8" ILI9341 TFT LCD Display with Touch and SD Card Slot
*   Female-to-Female Jumper Wires
*   2x Mini Breadboards
*   Male Header Pins (if not already soldered on your boards)
*   Micro USB to USB-A Cable

**Optional Components:**
*   Portable USB Power Bank (for mobile use)
*   3D Printed Case for the Marauder

---

## 2. Tools Needed

*   Soldering Iron & Solder
*   Solder Flux (pen or paste)
*   Needle-Nose Pliers
*   Multimeter (for troubleshooting)
*   Micro SD Card Reader

---

## 3. Hardware Preparation: Soldering

Proper soldering is crucial for a reliable connection between the ESP32 and the TFT display. If your boards did not come with header pins pre-soldered, follow these steps carefully.

1.  **Orient the Pins:** Insert the long side of the male header pins into a breadboard. This creates a stable jig to hold the pins straight.
2.  **Place the Board:** Place the ESP32 or TFT board over the short ends of the pins, ensuring the board is level.
3.  **Warm the Iron:** Set your soldering iron to a suitable temperature (around 320-360°C or 600-680°F). Clean the tip on a damp sponge and apply a tiny amount of solder to "tin" it.
4.  **Apply Flux:** Apply a small amount of flux to each pin and pad. This helps the solder flow smoothly.
5.  **Tack the Corners:** Solder three corner pins first. Heat the pin and the pad simultaneously for 2-3 seconds, then feed solder into the joint.
6.  **Check Alignment:** After tacking the corners, lift the board off the breadboard and check its alignment. If the pins are not perfectly straight, reheat the corner joints and adjust as needed.
7.  **Solder Remaining Pins:** Once aligned, solder the remaining pins using the same technique. Your finished joints should be shiny and cone-shaped.

![Soldering male header pins onto the TFT display board.](UofI-CyberTutorials/Deliverables/images/sauturing_missing_male_pins.jpg)
*Caption: Soldering the male header pins onto the TFT display.*

---

## 4. Driver & Firmware Flashing

It is highly recommended to flash the firmware onto the ESP32 *before* wiring it to the display. This allows you to confirm the ESP32 is working correctly on its own, which simplifies troubleshooting later.

### Driver Installation

Before flashing, your computer needs to recognize the ESP32's USB-to-serial chip.

*   **Windows:**
    1.  Connect the ESP32 to your PC.
    2.  Open **Device Manager**. Look under "Ports (COM & LPT)". If you see an unrecognized device, you need a driver.
    3.  Download and install the **CP210x Universal Windows Driver v11.4.0** from Silicon Labs for Windows 10/11.
    4.  After installation, the device should appear as "Silicon Labs CP210x USB to UART Bridge (COM#)". Note the COM port number.

*   **Linux:**
    1.  Connect the ESP32.
    2.  Open a terminal and run `ls /dev/tty*`.
    3.  You should see a new device, typically `/dev/ttyUSB0` or `/dev/ttyACM0`. Drivers are usually included in the kernel.

### Flashing Instructions

#### Method 1: Web Flasher (Easiest)

1.  Navigate to the **[Spacehuhn Web Flasher](https://esp.huhn.me/d-duino-32-marauder)**.
2.  Select the latest firmware version.
3.  Click "Connect", choose the correct COM port from the pop-up, and click "Connect" again.
4.  Click "Install" and hold down the **BOOT** button on your ESP32. While holding it, press and release the **RST** (or EN) button. You can then release the BOOT button.
5.  The flasher will erase, prepare, and write the firmware. Do not disconnect the device.
6.  Once complete, you can disconnect and reconnect the device.

#### Method 2: `esptool.py` (Advanced)

1.  Install Python and `esptool` by running: `pip install esptool`.
2.  Download the latest ESP32 Marauder firmware `.bin` file from the [official repository](https://github.com/justcallmekoko/ESP32Marauder/releases). Make sure you download the build for the standard **ESP32**, not the ESP32-S2 or other variants.
3.  Run the following command, replacing `COM3` with your port and `marauder.bin` with your firmware filename:
    ```bash
    esptool.py --chip esp32 --port COM3 --baud 921600 --before default_reset --after hard_reset write_flash -z --flash_mode dio --flash_freq 80m --flash_size detect 0x10000 marauder-v0.x.x-esp32.bin
    ```
    *   `--chip esp32`: Specifies the target chip.
    *   `--port COM3`: Sets the serial port.
    *   `--baud 921600`: Sets a high flashing speed.
    *   `write_flash`: The operation to perform.
    *   `0x10000`: The memory address to start writing the firmware.

---

## 5. Wiring Guide

This is the most critical step. Incorrect wiring can prevent the device from booting or cause damage. We will use two mini breadboards side-by-side to create a clean layout.

### Breadboard Setup

A breadboard's internal connections make wiring simple. The two outer columns (power rails) are connected vertically. The inner rows are connected horizontally in two separate blocks.

1.  **Join Breadboards:** Connect the two mini breadboards side-by-side.
2.  **Visualize Layout:** Place the ESP32 on one breadboard and the TFT display on the other. This helps visualize the connections before plugging in wires. The goal is to map the pins from the TFT to the correct GPIO pins on the ESP32.
3.  **Color Convention:** Use a consistent color code for your jumper wires to make troubleshooting easier:
    *   **Red:** 3.3V Power (VCC)
    *   **Black:** Ground (GND)
    *   **Other Colors (Yellow, Blue, Green):** Signal wires

### Pin Mapping

Use the following table to connect the TFT display and its integrated SD card reader to the ESP32.

| TFT/SD Pin | ESP32 GPIO | Description                  |
| :--------- | :--------- | :--------------------------- |
| VCC        | 3.3V       | Power                        |
| GND        | GND        | Ground                       |
| CS         | GPIO 17    | TFT Chip Select              |
| RESET      | GPIO 5     | TFT Reset                    |
| D/C        | GPIO 16    | TFT Data/Command             |
| MOSI       | GPIO 23    | SPI Master Out, Slave In     |
| SCK        | GPIO 18    | SPI Clock                    |
| LED        | GPIO 32    | Backlight Control            |
| MISO       | GPIO 19    | SPI Master In, Slave Out     |
| T_CLK      | GPIO 18    | Touch Clock (Shared w/ SCK)  |
| T_CS       | GPIO 21    | Touch Chip Select            |
| T_DI       | GPIO 23    | Touch Data In (Shared w/ MOSI)|
| T_DO       | GPIO 19    | Touch Data Out (Shared w/ MISO)|
| T_IRQ      | (Unused)   | Touch Interrupt              |
| SD_CS      | GPIO 12    | SD Card Chip Select          |

![Fully wired ESP32 Marauder on breadboards.](UofI-CyberTutorials/Deliverables/images/wired_maurader.jpg)
*Caption: The completed wiring between the ESP32 and the TFT display.*

### Common Troubleshooting Checks
*   **Loose Pins:** Ensure every jumper wire is firmly seated in the breadboard and connected to the correct pin.
*   **Wrong GPIO:** Double-check each connection against the pin mapping table and the ESP32 pinout diagram.
*   **Power Rails:** Make sure the 3.3V and GND from the ESP32 are connected to the correct power rails on the breadboard.

---

## 6. First Boot Checklist

After wiring and flashing, it's time to verify everything works.

1.  **Power On:** Connect the ESP32 to a power source (USB port or power bank).
2.  **Screen Check:** The screen should light up and display the "ESP32 Marauder" main menu.
3.  **Touch Response:** Tap different menu items. The screen should respond to your touch.
4.  **SD Card:** Insert a formatted (FAT32) Micro SD card. Navigate to the `Sniff` menu, select `Beacon Sniff`, and let it run for a few seconds. Stop the scan.
5.  **Verify Capture:** Remove the SD card and check its contents on a computer. You should see a new file named `EAP_0.pcap` or similar. This confirms the SD card slot is working correctly.

![First successful boot showing the ESP32 Marauder menu.](UofI-CyberTutorials/Deliverables/images/first_boot_up.JPG)
*Caption: The first successful boot, displaying the main menu.*

---

## 7. Safety and Ethical Considerations

The ESP32 Marauder is a powerful tool for network analysis.
- **Ownership:** Only use this device on networks and devices that you personally own.
- **Permission:** Obtain explicit, written permission before testing any network that is not yours.
- **Legality:** Understand and comply with your local laws regarding wireless network testing and cybersecurity research. Misuse of this tool can have serious legal consequences.

---

## 8. Reproduction Checklist

Use this checklist to track your progress.

- [ ] All parts and tools acquired.
- [ ] Header pins soldered to ESP32 and TFT board.
- [ ] CP210x driver installed and COM port identified.
- [ ] ESP32 Marauder firmware successfully flashed.
- [ ] Wiring completed according to the pinout table.
- [ ] Device boots to the main menu.
- [ ] Touch screen is responsive.
- [ ] SD card read/write is functional (PCAP file saved).

---

## 9. References

*   **Official GitHub Repository:** [justcallmekoko/ESP32Marauder](https://github.com/justcallmekoko/ESP32Marauder)
*   **Official Wiki:** [ESP32 Marauder Wiki](https://github.com/justcallmekoko/ESP32Marauder/wiki)
*   **Video Tutorial by Hak5:** [WiFi Hacking with the ESP32 Marauder](https://www.youtube.com/watch?v=Isua3o_2f7g)
*   **Video Tutorial by Seytonic:** [How to build an ESP32 Marauder](https://www.youtube.com/watch?v=H-95n_y-T-E)
*   **Video Tutorial by JustCallMeKoko:** [ESP32 Marauder v0.1.0](https://www.youtube.com/watch?v=n_s-8m_m2-Y)
