# ESP32 Marauder — Functional Tests

**Author:** Darasimi Ogunbinu-Peters
**Date:** November 4, 2025

---

### Summary

This document outlines the functional tests I performed on the ESP32 Marauder to verify its core capabilities before moving on to packet capture. After resolving the initial hardware connection issues, I was able to establish a stable serial connection and confirm that the Wi-Fi module is fully operational. The following tests were conducted to ensure the device is ready for the next phase as soon as the microSD card issue is resolved.

### 1. Functional Tests

I ran a series of commands in the serial console to make sure all the key modules of the Marauder board were responding correctly.

| Command      | Purpose                                                    |
| :----------- | :--------------------------------------------------------- |
| `scanap`     | Scans for access points only.                              |
| `scansta`    | Scans for connected stations (clients).                    |
| `sigmon`     | Monitors signal strength and channel changes.              |
| `sniffprobe` | Listens for probe requests to verify packet sniffing.      |
| `list -a`    | Lists all captured APs so far.                             |
| `info -a`    | Shows detailed info about a selected AP.                   |
| `channel -s` | Sets the channel for packet capture.                       |
| `sniffbeacon`| Sniffs for beacon frames on the selected channel.          |

Here are some screenshots from the testing process:

*Successful AP Scan (`scanap`)*
![AP Scan](images/Functional%20Tests/Screenshot%202025-11-04%20115155.png)

*Selecting an AP and Channel (`select -a 8` and `channel -s 8`)*
![Selecting AP and Channel](images/Functional%20Tests/Screenshot%202025-11-04%20115551.png)

*Sniffing for Beacons (`sniffbeacon`)*
![Sniffing Beacons](images/Functional%20Tests/Screenshot%202025-11-04%20115625.png)

### 2. Familiarizing with Attack Modules

To prepare for the next steps, I also explored the syntax for some of the Marauder's attack modules. I did not run these on any live networks, but used the `help attack` command to understand the available options.

- `attack -t beacon`
- `attack -t deauth`
- `attack -t probe`

### 3. Documentation and Next Steps

I've documented the full troubleshooting process, including verifying the wiring, identifying the SD card type issue, and successfully testing the serial connectivity and scanning functions.

**Next step:** Acquire a proper microSDHC card (8–32 GB, FAT32 formatted) to enable capture logging and SD operations.
