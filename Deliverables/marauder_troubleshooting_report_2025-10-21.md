# ESP32 Marauder Troubleshooting Report
**Date:** 2025-10-21

**Author:** Darasimi Ogunbinu-Peters
**Project:** CERES Cybersecurity Education - WPA2/3 Tutorial Section

---

### 1. Summary

The ESP32 Marauder device successfully powers on and boots to the main user interface, as shown in the main menu and Wi-Fi sniffer options screenshots. The hardware build was verified last week prior to travel and was previously detected by the host computer via USB.

After returning from travel (for Darasimi's birthday week, which limited lab work), the device is no longer recognized by the computer when connected. Although it powers on normally, this failure prevents serial communication, which is necessary for verifying capture files and interacting with the device via WSL or the Marauder flasher tool.

### 2. Troubleshooting Attempts

The following steps were taken to diagnose the connectivity issue:

- **Confirmed Power Delivery:** The device powers on via USB, and the screen is responsive enough to navigate menus.
  - *Evidence:* `../images/10_21_25_update/marauder_main_menu.jpg`

- **Verified Wi-Fi Scanning:** Navigated to `Wi-Fi → Sniffers → Scan APs`. The device successfully discovered and listed nearby access points.
  - *Evidence:* `../images/10_21_25_update/ap_scan_results.jpg`

- **Attempted Packet Capture:**
  - An EAPOL/PMKID scan was initiated but failed to detect any EAPOL frames.
    - *Evidence:* `../images/10_21_25_update/eapol_scan_attempt.jpg`
  - A raw capture attempt also showed no incoming packets.
    - *Evidence:* `../images/10_21_25_update/raw_capture_stats.jpg`

- **Checked Computer Connectivity (WSL/Ubuntu):**
  - Ran `dmesg | grep tty` and `ls /dev/ttyUSB* /dev/ttyACM*`. No new serial devices were detected when plugging in the Marauder.
  - Verified in Windows Device Manager; no new COM port appeared.

- **Tested Physical Connections:**
  - Multiple USB cables and ports were tested to rule out a faulty cable or port. The issue persisted, suggesting a data-line problem.
  - Screen responsiveness is partially degraded. Touch input only works in specific regions, which may indicate a loose connection or calibration drift.

### 3. Possible Causes

Based on the troubleshooting steps, the likely causes are:

- **USB Data Connection Failure:** The USB cable may be power-only, or the data pins on the ESP32's USB header may be damaged or disconnected.
- **Soldering Issues:** A cold solder joint or misalignment on the TX/RX pins or touchscreen controller pins could be causing intermittent data transfer.
- **Firmware Corruption:** The firmware flash may be incomplete or corrupted, preventing the USB serial interface from initializing correctly.
- **SD Card Interface Fault:** A faulty SD card or corrupted interface could potentially interfere with the USB recognition process.

### 4. Next Planned Actions

The following steps are planned to resolve the issue:

1.  **Re-flash Firmware:** Use ESPHome-Flasher or the official Marauder Flasher to upload the latest firmware, ruling out software corruption.
2.  **Test Pin Continuity:** Use a multimeter to test the continuity on the USB header pins (D+, D-, GND, 5V) to verify data line integrity.
3.  **Replace USB Cable & Verify Drivers:** Use a new, known-good data cable and ensure the correct CH340 or CP210x drivers are installed on the host machine.
4.  **Resume WPA2 Workflow:** Once the serial interface is restored, re-run the handshake capture workflow as outlined in Day 3 of the 7-Day Plan.
5.  **Update Progress Log:** Document any successful connection results in `marauder_progress_update.md`.

### 5. Notes & Context

- Minimal work was performed last week as Darasimi was traveling for his birthday with limited access to lab hardware.
- The primary goal for this week is to restore USB connectivity to resume WPA2 handshake testing in preparation for the next mentor check-in.
- All screenshots from the `10/21/25` folder confirm the Marauder is functional as a standalone device; the issue is isolated to the computer communication link.

---

### Conclusion

The Marauder is fully functional as a wireless scanning tool but currently fails to register with the host computer. This suggests a physical or firmware-level communication issue rather than a hardware power problem. Further testing will focus on verifying solder continuity, USB drivers, and reflashing the firmware.
