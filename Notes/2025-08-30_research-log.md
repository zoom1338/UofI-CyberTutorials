# Research Log - 2025-08-30

## Topic
WPA2/3 Penetration Testing. This research covers the fundamentals of WPA2 and WPA3 Wi-Fi security protocols, the goal of penetration testing against them, and the common steps and tools involved.

## Sources
- [Aircrack-ng Documentation](https://www.aircrack-ng.org/doku.php?id=cracking_wpa)
- [Wireshark WPA Handshake Analysis](https://wiki.wireshark.org/SampleCaptures#wpa_handshakes)
- [Dragonblood: WPA3 Vulnerabilities Research Paper](https://wpa3.mathyvanhoef.com/)

## TL;DR
WPA2 is a common Wi-Fi security standard vulnerable to password cracking by capturing its 4-way handshake. WPA3 is a newer, more secure standard using the SAE handshake to resist such attacks. Penetration testing for these protocols involves capturing authentication handshakes and attempting to crack them to find weak passwords or misconfigurations.

## Key Takeaways
- **WPA2 Security:** Uses a 4-way handshake and AES (CCMP) encryption. It is still widely used but susceptible to offline dictionary attacks if the handshake is captured.
- **WPA3 Security:** Employs the Simultaneous Authentication of Equals (SAE) handshake (also known as Dragonfly), which provides stronger protection against offline dictionary attacks.
- **Pen Testing Process:** The typical workflow includes reconnaissance (finding networks), capturing the handshake (forcing a client to reconnect), and cracking the captured password hash with a wordlist.
- **Essential Tools:** The Aircrack-ng suite is standard for Wi-Fi testing. Wireshark is used for packet analysis, and Hashcat can be used for more powerful, GPU-based password cracking.
- **WPA3 Challenges:** While harder to attack, WPA3 can still be vulnerable due to implementation flaws or misconfigurations, such as running in a WPA2/WPA3 transition mode.

## New Terms
- **WPA2 (Wi-Fi Protected Access 2):** A security protocol and certification program for wireless networks.
- **WPA3 (Wi-Fi Protected Access 3):** The successor to WPA2, with improved security features.
- **4-way handshake:** The process used by WPA2 to authenticate a client and generate encryption keys.
- **SAE (Simultaneous Authentication of Equals):** The more secure handshake mechanism used by WPA3.
- **Aircrack-ng:** A suite of tools for auditing and cracking Wi-Fi network security.
- **Wireshark:** A widely-used network protocol analyzer for inspecting traffic.
- **Hashcat:** An advanced password recovery and cracking utility.

## Open Questions
1. What are the detailed steps to pentest a WPA2/3 wireless network?
2. How can I effectively map surrounding wireless networks for reconnaissance?
3. What methods exist for mapping databases operating on wireless networks?

## Next Actions
- [ ] Learn the basics of Wireshark, Nmap, and SQLMap.
- [ ] Deeply analyze the content from the listed sources.
- [ ] Develop a mini-tutorial for WEP and WPA2 cracking.
- [ ] Investigate the possibility of creating a WPA2-Enterprise tutorial.
- [ ] Obtain the wireless AP adapter from the university's Cybersecurity club for hands-on testing.
