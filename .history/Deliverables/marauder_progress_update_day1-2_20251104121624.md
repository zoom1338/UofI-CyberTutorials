# ESP32 Marauder — Functional Tests

**Author:** Darasimi Ogunbinu-Peters
**Date:** November 4, 2025

### Summary

My main goal for the past two days was to get the ESP32 Marauder fully operational and ready for the next phase of our project. This involved verifying the hardware, establishing a stable serial connection from my WSL environment, and running initial Wi-Fi scans to confirm everything was working as expected before moving on to handshake captures.

**Status:** The device boots and scans correctly, and I've resolved the host serial connection issues by swapping to a good USB cable. The only remaining blocker is the SD card, which is preventing Day 3 progress.

---

### What I Did: Step-by-Step

Initially, I couldn't get my computer to recognize the ESP32. After some troubleshooting, I suspected the micro-USB cable was faulty. I reached out to Michael through the Cybersecurity Club and on Teams, and he provided me with a replacement. Once I swapped the cable, Windows Device Manager immediately recognized the board as **Silicon Labs CP210x USB to UART Bridge (COM3)**, which confirmed the hardware was now properly connected.

With the hardware sorted, I moved on to getting a serial connection working in my WSL/Ubuntu environment. I ran the following commands to update my system, install the necessary tools (`tio` and `python3-serial`), and grant my user the correct permissions to access the serial port:

```bash
sudo apt-get update
sudo apt-get install -y tio python3-serial
ls -l /dev/ttyS*
sudo usermod -a -G dialout $USER
newgrp dialout
tio /dev/ttyS3 -b 115200
```

The `tio` command successfully connected to the Marauder, giving me a live serial console. From there, I was able to run AP and client scans directly on the device, confirming that the core functions are working perfectly.
