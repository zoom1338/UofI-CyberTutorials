# Research Log – 2025-09-01

## Topic(s) covered
Using Wireshark to view WPA2 handshakes (EAPOL frames) and refining research questions (wireless pentest workflow, wireless mapping, database mapping).

## Sources
- Wireshark Sample Captures – WPA handshakes: https://wiki.wireshark.org/SampleCaptures#wpa_handshakes
- Wireshark Display Filters (EAPOL): https://www.wireshark.org/docs/dfref/e/eapol.html
- Aircrack-ng WPA cracking overview (for context): https://www.aircrack-ng.org/doku.php?id=cracking_wpa

## TL;DR
Wireshark can clearly visualize WPA2’s 4-way handshake by filtering on `eapol`. The handshake consists of four EAPOL-Key frames that derive session keys (PTK) from the PMK. If an attacker captures this handshake and the PSK is weak, cracking is possible offline with wordlists. For this project, I will first document the Wireshark workflow on a sample PCAP, then move to live captures once I have lab hardware and authorization. My research questions remain: “how to pentest WPA2/3,” “how to map wireless networks,” and “how to map databases on authorized networks after access.”

## Key Takeaways
- **Where to look:** In Wireshark, apply the display filter `eapol` to isolate handshake frames.
- **What to expect:** For WPA2-PSK, the handshake typically shows **4 EAPOL-Key frames** between the AP (BSSID) and the client (STA). Timing often coincides with a client (re)connection or a forced deauth/reconnect event.
- **Fields of interest:** Replay Counter, Nonce (ANonce/SNonce), Key MIC, and “Install”/“Ack” flags help identify which handshake message you’re viewing.
- **Verification:** A complete set of 4 frames is ideal; tools like aircrack-ng can sometimes work with fewer if the MIC and nonces are present.
- **Screenshots to capture for the tutorial:**  
  1) Full packet list filtered by `eapol` showing 4 frames.  
  2) Packet details pane expanded on an EAPOL-Key message (showing key info fields).  
- **Limitations for now:** Without a monitor-mode NIC/AP, I’ll use sample PCAPs to document the UI/fields and the expected workflow, then replace screenshots with my own once hardware access is set.

## New Terms
- **EAPOL (Extensible Authentication Protocol over LAN):** The layer-2 protocol used to carry the WPA/WPA2 4-way handshake messages.
- **PMK (Pairwise Master Key):** Derived from the PSK (in WPA2-Personal); base key used to derive session keys.
- **PTK (Pairwise Transient Key):** Session key derived during the 4-way handshake from PMK, nonces, MACs.
- **MIC (Message Integrity Code):** Authenticator on EAPOL-Key frames verifying key possession.
- **BSSID / STA:** AP MAC address (BSSID) and client station MAC (STA) in the handshake exchange.

## Open Questions
1. What is the minimal set of handshake frames aircrack-ng or hashcat actually needs for a reliable offline crack?
2. For WPA3/SAE, are there useful visual indicators in Wireshark captures (commit/confirm messages) that can be explained in a teaching screenshot, even if offline cracking is not feasible?
3. What’s the cleanest way to annotate screenshots so beginners understand each handshake field?

## Next Actions
- [ ] Download or copy a **sample WPA2 handshake PCAP** into `Experiments/sample-pcaps/` and open it in Wireshark.
- [ ] Capture **two screenshots**: (1) `eapol` filtered packet list; (2) details of one EAPOL-Key frame with important fields highlighted.
- [ ] Write the “Wireshark view” subsection in `Drafts/wpa2_tutorial.md` and embed the screenshots (temporary placeholders until I have my own captures).
- [ ] Draft a short “How to verify you captured a handshake” checklist (e.g., see 4 EAPOL-Key frames; matching BSSID/STA; MIC present).
- [ ] Confirm lab hardware/access timeline for live captures (USB NIC + AP via Cybersecurity Club or RADICL).
