# Research Log - 2025-08-31

## Topic
A summary of WPA3's Simultaneous Authentication of Equals (SAE) handshake, its security advantages over WPA2, and the Dragonblood vulnerabilities.

## Sources
- Vanhoef, M. (2019). *Dragonblood: A Security Analysis of WPA3's SAE Handshake*. [https://wpa3.mathyvanhoef.com/](https://wpa3.mathyvanhoef.com/)

## TL;DR
WPA3 is significantly more secure than WPA2 because its SAE (Simultaneous Authentication of Equals) handshake protocol is resistant to the offline dictionary attacks that plague WPA2. By authenticating both the client and the access point simultaneously, it prevents attackers from capturing a handshake and cracking it offline.

## Key Takeaways
- **WPA2's Weakness**: WPA2 uses a 4-way handshake that can be captured by an attacker. If a weak password is in use, the attacker can use an offline dictionary or brute-force attack to discover the password from the captured handshake.
- **WPA3's Strength**: WPA3 replaces the 4-way handshake with SAE, also known as the Dragonfly handshake. This protocol does not expose password hashes in the same way, making it resilient to offline cracking attempts.
- **Forward Secrecy**: WPA3 also provides forward secrecy, meaning that even if an attacker discovers the password in the future, they cannot decrypt previously captured traffic.
- **Vulnerabilities Still Exist**: Despite its strengths, the initial WPA3 standard was found to have significant vulnerabilities, collectively known as "Dragonblood." These flaws could allow an attacker to leak information about the password, potentially leading to a full recovery.

## New Terms
- **SAE (Simultaneous Authentication of Equals)**: The authentication handshake used in WPA3. It is based on the Dragonfly key exchange and is designed to be secure against dictionary attacks.
- **Offline Dictionary Attack**: A password cracking technique where an attacker captures an authentication handshake and then uses a list of common passwords (a "dictionary") to try and find a match offline, without further interaction with the live network.
- **Dragonblood**: A collection of security vulnerabilities discovered in the WPA3 standard, including downgrade attacks and side-channel leaks that could allow an attacker to recover the Wi-Fi password.

## Open Questions
- What specific patches and protocol updates were implemented to mitigate the Dragonblood vulnerabilities?
- How does the WPA2/WPA3 "transition mode" potentially expose a network to legacy WPA2 attacks?

## Next Actions
- Review the Dragonblood paper in detail to understand the technical specifics of the downgrade and side-channel attacks.
- Investigate current penetration testing tools and their effectiveness against patched WPA3 implementations.
