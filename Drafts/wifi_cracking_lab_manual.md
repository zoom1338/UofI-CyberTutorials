# Wi-Fi Cracking Lab Manual

**Disclaimer:** This manual is for educational purposes only and should be used exclusively in authorized lab environments on networks you own or have explicit permission to test. Unauthorized access to computer networks is illegal.

---

## Introduction

This lab manual provides a step-by-step guide for three Wi-Fi security exercises: building a portable Wi-Fi pen-testing tool, capturing and cracking WPA2 handshakes, and demonstrating the KRACK (Key Reinstallation Attack). These exercises are based on video tutorials and are designed to provide hands-on experience with common Wi-Fi vulnerabilities and attack vectors.

---

## 1. Building the ESP32 Marauder

This section covers the construction of a solder-free ESP32 Marauder, a powerful and portable tool for Wi-Fi penetration testing.

### Hardware List

*   ESP32 Dev Kit (specifically, the ESP32 Wroom 32 model)
*   2.8-inch TFT Touchscreen Display with an integrated SD card reader
*   Two miniature breadboards
*   Female Dupont header pins (one row of 14, one row of 4)
*   Pre-cut jumper wires
*   USB Micro cable (for programming and power)
*   Optional: A power bank for portability

### Firmware Flashing Instructions

1.  **Navigate to the ESP32 Marauder GitHub repository** to find the firmware and documentation.
2.  **Use the Spacehuhn Web Updater** for the easiest flashing experience.
3.  **Connect the ESP32** to your computer. If it's not detected, you may need to install the appropriate drivers for the serial-to-USB adapter (e.g., CP2102, FTDI, CH340).
4.  **Download the required firmware files**:
    *   `bootloader.bin`
    *   `partitions.bin`
    *   `boot_app.bin`
    *   `marauder_vX_X_X_oldhardware.bin` (ensure you get the `oldhardware` version for this build)
5.  **Upload the files** using the web updater, making sure the memory addresses in the updater match the instructions in the repository.
6.  **Reset the device** after flashing is complete by unplugging and replugging it.

### Breadboard Wiring Overview

The wiring process connects the ESP32 to the touchscreen and SD card reader. A pinout diagram for your specific ESP32 board is essential for this step.

1.  Place the two mini breadboards side-by-side.
2.  Insert the ESP32 into the inner rows of the breadboards.
3.  Place the female headers for the display onto the outer rows.
4.  Using the wiring table from the Marauder repository's "old readme" and your ESP32's pinout diagram, connect the corresponding pins between the ESP32 and the display headers using jumper wires.
5.  Double-check all connections for accuracy before proceeding.

### Expected Outputs

Once wired correctly and powered on, the ESP32 Marauder should boot up and display the Marauder firmware interface on the touchscreen. If using a power bank, the device will be fully portable.

### Reproduction Checklist

- [ ] Procure all required hardware components.
- [ ] Flash the ESP32 with the correct Marauder firmware.
- [ ] Assemble the components on the breadboard according to the wiring diagram.
- [ ] Double-check all wiring connections.
- [ ] Power on the device to confirm it boots successfully.
- [ ] Attach the device to a power bank for portability.

### Safety and Ethics

*   This device is a powerful tool for network analysis. Use it responsibly.
*   Do not perform any testing on networks without explicit, written permission from the network owner.
*   Be aware of your local laws regarding Wi-Fi scanning and penetration testing.

### Reference Video

*   **Building ESP32 Marauder:** [https://www.youtube.com/watch?v=lcokJQMivwY](https://www.youtube.com/watch?v=lcokJQMivwY)

---

## 2. Handshake Capture & Cracking

This section details how to capture a WPA2 4-way handshake and crack it offline to recover the network password.

### Enabling Force PMKID

To actively capture a handshake, you can force a device to re-authenticate.

1.  On the ESP32 Marauder, navigate to **Settings**.
2.  Enable the **Force PMKID** option. This setting will send de-authentication packets to connected devices during a scan, compelling them to reconnect and initiate a new handshake.

### Capturing the .pcap File

1.  From the main menu, go to **Wi-Fi** -> **Sniffers** -> **Scan APs** to identify your target network.
2.  Go back and select **EAP/PMKID Scan**.
3.  The Marauder will begin listening for handshakes. When a device (re)connects to the target network, the handshake will be captured.
4.  The captured data is automatically saved to a `.pcap` file (e.g., `EAP_0.pcap`) on the SD card.

### Converting with cap2hashcat

Hashcat requires the handshake to be in a specific format.

1.  Power off the Marauder and transfer the `.pcap` file from the SD card to your computer.
2.  Use the online **cap2hashcat** tool to convert the `.pcap` file.
3.  Upload your file, click **Convert**, and download the resulting `.hc22000` file.

### Running Hashcat

With the converted hash and a wordlist, you can now attempt to crack the password.

**Example Command:**
```bash
hashcat.exe -m 22000 your_capture.hc22000 wordlist.txt -r rules/one-rule-to-rule-them-all.txt
```

**Flag Explanations:**
*   `-m 22000`: Specifies the hash mode for WPA-PBKDF2-PMKID+EAPOL (WPA/WPA2).
*   `your_capture.hc22000`: The path to your converted handshake file.
*   `wordlist.txt`: The path to your password dictionary/wordlist.
*   `-r [rule_file]`: (Optional) Applies mutation rules to your wordlist to generate more password candidates (e.g., adding numbers, symbols, or changing capitalization).

### Reproduction Checklist

- [ ] Enable "Force PMKID" in the Marauder settings.
- [ ] Scan for and identify the target access point.
- [ ] Run an EAP/PMKID scan to capture the handshake.
- [ ] Transfer the resulting `.pcap` file to a computer.
- [ ] Convert the `.pcap` file to `.hc22000` format.
- [ ] Prepare a wordlist for the cracking attempt.
- [ ] Run Hashcat with the correct mode and files.

### Safety and Ethics

*   De-authenticating devices from a network is a disruptive action. Only perform this on a network you own.
*   Cracking passwords, even for networks you have access to, may be against the terms of service or acceptable use policy. Always ensure you have permission.

### Reference Video

*   **Using ESP32 Marauder to capture handshakes:** [https://www.youtube.com/watch?v=FVvhJxAC-Ic](https://www.youtube.com/watch?v=FVvhJxAC-Ic)

---

## 3. KRACK Attack Demonstration

This section provides a summary of the Key Reinstallation Attack (KRACK), which exploits a vulnerability in WPA2 to decrypt traffic.

### Setup Summary

The attack requires a man-in-the-middle (MITM) position to intercept and manipulate handshake messages.

1.  **Run the Attack Script:** Start a script that targets a specific protected Wi-Fi network and a victim device.
2.  **Clone the Network:** The script will find the target network and create a malicious clone of it on a different channel.
3.  **Enable Internet Access:** Configure the malicious network to provide internet access to the victim.
4.  **Run `sslstrip`:** Use a tool like `sslstrip` to attempt to downgrade HTTPS connections to HTTP, removing a layer of encryption.
5.  **Start Wireshark:** Use a packet sniffer like Wireshark to capture all traffic from the victim device.

### MITM Cloning Process

The core of the attack is tricking the victim into connecting to the attacker's machine instead of the legitimate access point.

1.  The script sends specially crafted Wi-Fi frames that command the victim device to switch to the channel where the malicious clone is operating.
2.  The victim's device connects to the clone, establishing the attacker in a man-in-the-middle position.

### Key Reinstallation

With the MITM position established, the attacker can execute the key reinstallation attack.

1.  The attacker manipulates the 4-way handshake messages between the victim and the real access point.
2.  This manipulation forces the victim device to reinstall an already-in-use key.
3.  On vulnerable Android and Linux implementations, this causes the device to install an **all-zero encryption key**, rendering WPA2 encryption useless.

### Using Wireshark/sslstrip to Decrypt Traffic

Once the all-zero key is installed, all of the victim's traffic is sent unencrypted.

*   **Wireshark:** The attacker can view all of the victim's data in plaintext, completely bypassing WPA2.
*   **sslstrip:** If a website is improperly configured, `sslstrip` can prevent the browser from using HTTPS. The user may not notice the absence of the HTTPS lock, and any credentials they enter will be sent in plaintext and captured by the attacker.

### Reproduction Checklist

- [ ] Set up a test Wi-Fi network and a vulnerable client device (e.g., an older Android or Linux machine).
- [ ] Configure an attack machine with the necessary scripts and tools (e.g., `sslstrip`, Wireshark).
- [ ] Run the script to create a malicious clone of the test network.
- [ ] Trick the client device into connecting to the cloned network.
- [ ] Execute the key reinstallation attack.
- [ ] Monitor Wireshark to confirm that traffic is being decrypted.
- [ ] Attempt to capture credentials from an insecure (HTTP) login page.

### Safety and Ethics

*   The KRACK attack is a serious vulnerability. Ensure your own devices are patched and up-to-date to protect against it.
*   Performing a man-in-the-middle attack on any device or network without authorization is illegal and unethical. This demonstration must only be performed in a controlled lab environment.

### Reference Video

*   **Using KRACK attacks to run Man-in-the-Middle attacks:** [https://www.youtube.com/watch?v=Oh4WURZoR98](https://www.youtube.com/watch?v=Oh4WURZoR98)
