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

## 2. Handshake Capture and Cracking with Hashcat

This tutorial demonstrates how to capture a WPA2 four-way handshake using the ESP32 Marauder and crack it offline with Hashcat to recover the WiFi password.

- **Reference:** [Using ESP32 Marauder to capture handshakes](https://www.youtube.com/watch?v=FVvhJxAC-Ic)

### Hardware Needed
- A fully assembled and functional ESP32 Marauder
- A computer with Hashcat installed

### Setup
1.  **Enable Deauthentication:** On the ESP32 Marauder, navigate to `Settings` and enable the `Force PMKID` option. This allows the Marauder to actively deauthenticate devices to force a reconnect, which is necessary to capture the handshake.
2.  **Prepare Wordlist:** On your computer, create a wordlist file (e.g., `wordlist.txt`). This file should contain potential passwords. For better results, use a targeted wordlist based on any known information about the password.

### Key Steps and Commands
1.  **Scan for Target Network:**
    - On the Marauder, go to `Wi-Fi` > `Sniffers` > `Scan APs` to identify the target network and ensure it's in range.
2.  **Capture the Handshake:**
    - Go to `Wi-Fi` > `EAP/PMKID Scan`.
    - The Marauder will begin sending deauthentication packets and wait for a device to reconnect.
    - A blue line on the screen indicates EAPOL (Extensible Authentication Protocol over LAN) packets. A spike in this graph signifies a successful handshake capture.
3.  **Retrieve the Capture File:**
    - Power off the Marauder and remove the SD card.
    - Insert the SD card into your computer and locate the `EAP_0.pcap` file. This file contains the captured handshake.
4.  **Convert PCAP for Hashcat:**
    - Use an online tool like `cap2hashcat` (available at hashcat.net) to convert the `.pcap` file.
    - Upload `EAP_0.pcap`, click "Convert," and download the resulting `.hc22000` file.
5.  **Run Hashcat:**
    - Open a terminal and navigate to your Hashcat directory.
    - Use the following command to start the cracking process:
      ```
      hashcat.exe -m 22000 <hash_file.hc22000> <wordlist.txt> -r <rule_file.rule>
      ```
    - **`-m 22000`**: Specifies the hash type for WPA-PBKDF2-PMKID+EAPOL (WPA2).
    - **`<hash_file.hc22000>`**: The converted handshake file.
    - **`<wordlist.txt>`**: Your list of potential passwords.
    - **`-r <rule_file.rule>`**: (Optional) Apply rules to your wordlist to generate more combinations (e.g., `OneRuleToRuleThemAll.rule`).

### Expected Outputs
- The Marauder's screen will confirm when the handshake has been captured.
- Hashcat will display the cracked password in the terminal if it is found in the wordlist (or generated by the rules).

### Safety and Ethics
- **Permission is Required:** Deauthenticating devices from a network is illegal and disruptive. Only perform this attack on networks for which you have explicit, written permission.
- **Legal Constraints:** Be aware of local and national laws regarding network security testing. Unauthorized access or disruption of networks can have severe legal consequences.

### Reproduction Checklist
- [ ] Configure the ESP32 Marauder by enabling `Force PMKID`.
- [ ] Use the Marauder to scan for and target an authorized WiFi network.
- [ ] Run the `EAP/PMKID Scan` to capture the four-way handshake.
- [ ] Transfer the `.pcap` file from the SD card to your computer.
- [ ] Convert the `.pcap` file to the `.hc22000` format.
- [ ] Create a targeted wordlist for the cracking attempt.
- [ ] Run Hashcat with the correct mode and files.
- [ ] Verify if the password was successfully recovered.
