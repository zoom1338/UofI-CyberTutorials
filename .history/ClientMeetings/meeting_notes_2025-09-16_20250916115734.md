# Agenda
- Review progress since last meeting (2025-09-09)
- Identify current blockers and needs
- Define next steps for the upcoming week

# Progress Since Last Meeting
- **Repository Work:** Added WPA2 tutorial scaffold, Wireshark intro markdown with screenshots, requirements spec, meeting one-pager, and WiFi lab setup file. Pushed all changes to `WPA_2/3-v2` branch.
- **Lab Prep:** Confirmed Dana 117 router setup for penetration testing, documented hardware and command plan in `wifi_lab_setup.md`. Coordinated with IEEE and Mike Herrboldt to pick up ESP32 Marauder parts.
- **Tutorial Research:** Downloaded and summarized three YouTube tutorials (ESP32 Marauder build, handshake capture + hashcat, KRACK attack). Produced a structured WiFi Cracking Lab Manual with hardware lists, step-by-step commands, ethics notes, and reproduction checklists.
- **Team Coordination:** Communicated with Isabella to confirm sprint deliverables. Both agreed to focus on sprint report for Saturday.

# Blockers/Needs
- Still waiting on ESP32 parts pickup tomorrow (9/17).
- Will need wordlist approval before live cracking attempts.
- KRACK attack reproduction may require compatible victim device (Android/Linux).

# Next Steps
- Assemble ESP32 Marauder hardware and document build.
- Capture first handshake from lab router and verify with Wireshark.
- Convert capture and perform first Hashcat crack test with approved wordlist.
- Draft Sprint 1 report and push to repo before 9/13 deadline.
