# Wi-Fi Cracking Experiments Plan

This document outlines the plan for three Wi-Fi security experiments based on the tutorials from AJ's email.

---

## [ ] Tutorial 1: ESP32 Marauder

### Summary
*(Awaiting summary of the ESP32 Marauder tutorial from AJ's email)*

### Materials Needed
- ESP32 board (compatible with Marauder firmware)
- USB cable
- Computer with necessary drivers and software (e.g., Arduino IDE or PlatformIO)

### Commands/Tools Expected
- `marauder` command-line interface
- Firmware flashing tools

### Risks & Ethics
- **Legal:** Using Wi-Fi deauthentication and other offensive tools is illegal if performed on networks you do not own or have explicit permission to test.
- **Ethical:** Causing denial of service to a network can disrupt services for legitimate users. All tests must be conducted in a controlled lab environment on your own equipment.

---

## [ ] Tutorial 2: WPA2 Handshake Cracking with Wordlists

### Summary
*(Awaiting summary of the WPA2 handshake cracking tutorial from AJ's email)*

### Materials Needed
- Computer with a wireless network card capable of monitor mode
- A target WPA2 network that you own and have permission to test

### Commands/Tools Expected
- `hcxtools`: For capturing and processing handshakes.
- `hashcat`: For GPU-based password cracking.
- Wordlists (e.g., RockYou, custom lists).

### Risks & Ethics
- **Legal:** Capturing network traffic and attempting to crack passwords for networks you do not own is illegal.
- **Privacy:** You may inadvertently capture sensitive data from other users on the network. Ensure your test environment is isolated.
- **Ethical:** This technique should only be used to audit the security of your own network and to understand the importance of strong, unique passwords.

---

## [ ] Tutorial 3: KRACK (Key Reinstallation Attack)

### Summary
*(Awaiting summary of the KRACK attack tutorial from AJ's email)*

### Materials Needed
- A known vulnerable client device for testing
- A computer to run the attack script
- A compatible wireless adapter for creating a malicious access point

### Commands/Tools Expected
- `krack-scripts`: Python scripts to execute the attack.
- `hostapd`: To create a rogue or malicious access point.
- `Wireshark`: For analyzing network traffic to confirm the attack's success.

### Risks & Ethics
- **Legal:** Performing a man-in-the-middle (MITM) attack on any network without explicit permission is illegal.
- **Privacy:** This attack can intercept and decrypt traffic, exposing sensitive user data.
- **Ethical:** This attack should only be performed in a controlled lab environment on devices you own to understand the vulnerability and the critical importance of software patches.
