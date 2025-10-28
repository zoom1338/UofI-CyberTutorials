# Day 1–2: Marauder Troubleshooting and Serial Connection Progress

I spent the last two days troubleshooting the ESP32 Marauder board to get reliable serial communication via PuTTY. My initial challenge was simply getting a live connection — I tested multiple COM ports, tried several baud rates and different cable positions before the board finally responded at 115200 baud on COM3. When the board did boot it printed several hardware/firmware errors that guided my troubleshooting, including:

• “Failed to mount SD Card / SD Card NOT Supported” (see Deliverables/images/day1-2_troubleshot)

• “PSRAM ID read error: 0xffffffff”

• “GPS Not Found”

Those messages forced me to check both hardware and software: I verified the Marauder firmware version (v1.8.6) was a valid build, confirmed stable power and connector seating, and rechecked that the micro-USB cable supported data transfer (not all charge-only cables will work).

Once I had a working serial link, I exercised the CLI via PuTTY to confirm the radio and command interface were functional. I ran commands such as:

help
scan -c 1,6,11
scanall
scanap
info -a
packetcount

The radio scanned and returned multiple SSIDs (examples observed: “Aspen Heights”, “MooMooMagoo”, “Verizon_CX9H3C-IoT”, and “Cybersecurity-Capstone_2.4GHz”), which I used to validate that the scanning pipeline and radio stack are operating correctly. I captured screenshots of the terminal outputs and saved them in `Deliverables/images/day1-2_troubleshot` as evidence of successful troubleshooting and command verification.

While the radio and CLI are confirmed working, the primary blocker remaining is that the SD card is not mounting, which prevents saving `.pcap` captures required for Day 3. Next steps are straightforward:

- Acquire a compatible FAT32 micro-SD card and try again.
- Re-test mounting with `ls /sdcard` to confirm it appears and is writable.
- Proceed to Day 3: run `sniffpmkid` or `sniffraw` to capture a WPA2 handshake and save the resulting `.pcap` for analysis.

This log is intentionally brief and technical — recorded as a lab log of what I tested, the errors I saw, the verification commands I ran, and the concrete next actions to unblock Day 3.
