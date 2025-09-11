# ESP32 Marauder Handshake Capture Plan

## Goal
The goal of this experiment is to capture WPA2 handshakes using an ESP32 Marauder device and crack them with hcxtools + hashcat. This serves as a lower-cost, portable alternative to using a full monitor-mode NIC.

## Parts List
- ESP32 board (preferably ESP32-WROOM or ESP32-S2)
- 2x Mini breadboards
- Jumper wires
- Touchscreen display (optional, improves usability)
- Female socket pins (optional, for soldering or stacking headers)

## References & Tutorials
- [ESP32 Marauder Build Tutorial (YouTube)](https://www.youtube.com/watch?v=lcokJQMivwY)
- [Capturing Handshakes & Cracking with Hashcat (YouTube)](https://www.youtube.com/watch?v=FVvhJxAC-Ic)
- [KRACK Attack MITM Walkthrough (YouTube)](https://www.youtube.com/watch?v=Oh4WURZoR98)
- [ESP32 Marauder GitHub Repository](https://github.com/justcallmekoko/ESP32Marauder)

## Risks & Ethics
- **Authorization:** All tests will be run on the Dana 117 lab AP or explicitly authorized test networks.
- **Impact:** Deauthentication attacks will be kept short to minimize client disruption.
- **Scope:** No scanning or attacks will be performed outside the lab environment or without prior notice.

## TODOs
- [ ] Pick up ESP32 + breadboards + jumper wires (IEEE room + EME 44).
- [ ] Flash latest Marauder firmware following build tutorial.
- [ ] Test basic functionality (scan networks, deauth single client).
- [ ] Capture a WPA2 handshake from the lab router.
- [ ] Convert capture using hcxpcapngtool, crack with hashcat wordlist.
- [ ] Document build process with step-by-step photos for final report.
