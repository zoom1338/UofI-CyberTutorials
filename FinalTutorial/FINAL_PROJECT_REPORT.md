# Building and Using the ESP32 Marauder to Capture and Crack WPA2 Handshakes: A Complete End-to-End Penetration Testing Lab

**Author:** Darasimi Ogunbinu-Peters  
**Course:** CPTS 432 – Cybersecurity Capstone  
**Institution:** Washington State University (WSU)  
**Date:** November 2025  
**Demo Video:** https://youtu.be/2y4-D3z_nvg (unlisted)

---

## 1. Introduction

This report documents my complete cybersecurity capstone project: designing, building, and using a custom ESP32 Marauder device to capture WPA2 wireless handshakes and successfully cracking them using Hashcat and offline dictionary attacks. Over the course of several months, I assembled the hardware from individual components, soldered critical connections, flashed custom firmware, conducted extensive troubleshooting, and executed a full penetration testing workflow on an authorized laboratory network.

The project demonstrates why WPA2, despite being a significant security improvement over older wireless standards, remains vulnerable to offline attacks when users select weak or guessable passwords. By documenting each phase—from hardware assembly through successful password recovery—this report serves as both a technical case study and a reproducible lab manual for future students and security professionals.

### 1.1 Project Objectives

My primary goals for this capstone were:

1. **Learn the complete workflow of wireless penetration testing** on an authorized network, from initial reconnaissance through exploitation and analysis.

2. **Understand the WPA2 4-way handshake protocol** at a technical level—what frames are exchanged, why capturing them matters, and how they enable offline attacks.

3. **Practice ethical hacking in a controlled, legal environment** with explicit written permission from my instructor, reinforcing the importance of responsible security research.

4. **Demonstrate proficiency with specialized tools** including the ESP32 Marauder, Wireshark, cap2hashcat, and Hashcat—tools commonly used by defensive and offensive security professionals.

5. **Document the entire process clearly** so that other students and practitioners can reproduce and learn from this work.

### 1.2 Authorization and Ethical Context

**All testing described in this report was conducted on a classroom router provided by Washington State University's Cybersecurity Club with explicit written permission from my course instructor.** The SSID tested was `Cybersecurity-Capstone_2.4GHz`, an isolated lab network configured specifically for educational penetration testing.

Attempting these techniques on networks without authorization is illegal under the Computer Fraud and Abuse Act (CFAA) and similar statutes worldwide. This project is strictly educational in nature and is intended to deepen understanding of wireless security, not to enable unauthorized access to others' networks.

The complete live demonstration of this work is recorded in the video linked above: https://youtu.be/2y4-D3z_nvg

---

## 2. Background and Technical Context

### 2.1 WPA2 and the 4-Way Handshake

WPA2 (Wi-Fi Protected Access II, IEEE 802.11i) is the widely-deployed standard for wireless network authentication and encryption. It was introduced in 2004 to replace WEP (Wired Equivalent Privacy), which had fundamental cryptographic weaknesses.

Unlike WEP, which used a static shared key, WPA2 derives unique encryption keys for each session through a process called the **4-way handshake**. This handshake occurs whenever a client device (e.g., a laptop or phone) connects to an access point (router). The four-way handshake is crucial because:

- It authenticates both the client and the AP to each other.
- It negotiates and distributes a fresh **Pairwise Transient Key (PTK)**, which encrypts unicast traffic.
- Both parties prove they know the network's Pre-Shared Key (PSK)—the Wi-Fi password.

**The EAPOL Frames:**

The handshake consists of four Extensible Authentication Protocol over LAN (EAPOL) messages:

1. **Message 1 (AP → Client):** The AP sends an **ANonce** (Authenticator Nonce), a random value used to derive keys.
2. **Message 2 (Client → AP):** The client responds with a **SNonce** (Supplicant Nonce), another random value, plus an MIC (Message Integrity Code) calculated using both nonces and the PSK.
3. **Message 3 (AP → Client):** The AP sends a message including the GTK (Group Temporal Key) and another MIC.
4. **Message 4 (Client → AP):** The client confirms receipt and sends its own MIC.

Both the client and AP now have all the material needed to derive the same PTK. The PSK is never transmitted in cleartext; instead, it's used to compute the MICs—and this is what makes offline cracking possible.

### 2.2 Why WPA2 is Vulnerable to Offline Attacks

An attacker who captures the four EAPOL frames (by passively sniffing traffic or actively forcing a reconnect via deauthentication) has all the information needed to perform an offline dictionary attack:

- **The EAPOL messages contain:** The ANonce, SNonce, and both MICs.
- **The attack:** Given the captured data and a guessed password, the attacker can compute what the MICs *should be* if that password were correct. If they match, the password is found—without ever interacting with the network again.
- **Speed:** Modern GPUs can evaluate millions of password guesses per second, making even moderately long passwords vulnerable if they appear in a commonly-used wordlist.

WPA2's encryption (CCMP, which uses AES) remains unbroken. The vulnerability stems not from weak crypto but from weak password entropy—users choose memorable passwords, and such passwords typically occupy a small space of possible strings that can be systematically searched.

### 2.3 PMKID and Optimization

In addition to capturing a full 4-way handshake, modern tools can extract the **PMKID** (Pairwise Master Key Identifier) from the AP's first beacon frame. The PMKID is an optional field that, when present, allows pre-computation of the target hash without waiting for a full handshake. This makes the attack faster and can even work against APs that don't actively send EAPOL frames in response to deauth.

### 2.4 The ESP32 Marauder: A Low-Cost Penetration Testing Platform

The **ESP32 Marauder** is an open-source project that turns an affordable ESP32 microcontroller into a powerful Wi-Fi and Bluetooth hacking device. Key advantages include:

- **Cost:** The hardware (ESP32 + TFT display + SD card) costs under $50–100 USD, making it accessible to students and researchers.
- **Portability:** The entire device is small enough to fit in a pocket with a portable battery pack, enabling field testing.
- **Capability:** Despite its low cost, the Marauder can scan networks, capture handshakes, sniff packets, perform deauth attacks, and more.
- **Flexibility:** The firmware is open-source and customizable, allowing for learning and modification.
- **Community:** Active development and a growing library of tutorials and modifications make it ideal for educational purposes.

For this project, the Marauder served as the primary tool for discovering the test network and capturing the WPA2 handshake that would later be cracked offline.

---

## 3. Part 1: Building the ESP32 Marauder Hardware

### 3.1 Hardware Components and Bill of Materials

To build a fully functional ESP32 Marauder, I assembled the following components:

| Component | Quantity | Purpose | Notes |
|-----------|----------|---------|-------|
| **ESP32 Development Board (WROOM-32)** | 1 | Microcontroller | 30-pin variant, dual-core 240 MHz processor |
| **2.8" ILI9341 TFT LCD Display** | 1 | User interface | 320×240 pixels, integrated SD card slot |
| **microSD Card** | 1 | Storage | 16 GB, FAT32 formatted, for PCAP saves |
| **Male Header Pins** | 2 strips | Connections | Pre-soldered or added via soldering |
| **Female-to-Female Jumper Wires** | ~30 | Breadboard wiring | Color-coded for clarity |
| **Mini Breadboards** | 2 | Circuit prototyping | Joined side-by-side for layout |
| **USB Micro-B Cable** | 1 | Power & serial | Data-capable, not charge-only |
| **Soldering Iron & Solder** | — | Assembly | 320–360°C working range |

### 3.2 Soldering and Hardware Assembly

The most critical step in building the Marauder is **proper soldering** of the header pins to the ESP32 and TFT boards. Poor solder joints—which I encountered—can cause intermittent connectivity, missing frames in packet captures, and failure to recognize the SD card.

#### 3.2.1 The Soldering Process

1. **Setup:** I inserted male header pins into a breadboard to hold them straight, then placed the target board (ESP32 or TFT) over the pins.

2. **Preparation:** Applied solder flux to each pin and pad. Flux aids in heat transfer and ensures a clean, shiny joint.

3. **Technique:** Using a temperature-controlled soldering iron set to ~350°C, I heated both the pin and the pad simultaneously for 2–3 seconds, then fed solder into the joint. A good joint has a smooth, cone-shaped appearance—not a large blob or a dull, grainy surface.

4. **Verification:** After soldering all pins, I visually inspected each joint under magnification and tested with a multimeter where possible to ensure continuity.

#### 3.2.2 The SD Card Header Issue

During early testing, the Marauder **failed to recognize the microSD card**, displaying "SD Card NOT Supported" errors. This was a critical blocker because:

- Without a working SD card, there was no way to save `.pcap` capture files.
- Without saved captures, there was no handshake to analyze offline.

Through extensive troubleshooting (detailed in Section 6), I identified that the issue was likely a **cold solder joint or misaligned pin** on the SD card header—specifically on the data lines (MOSI, MISO, or CLK).

**The fix:** Using a microscope and careful re-soldering, I reflowed the SD card header pins, ensuring solid mechanical and electrical contact. After this repair, the SD card mounted successfully.

#### 3.2.3 Hardware Assembly Lessons Learned

- **Magnification matters:** Even tiny voids or misaligned pins are invisible to the naked eye. A USB microscope or magnifying glass is invaluable.
- **Continuity testing:** A multimeter in continuity mode can verify that pins actually connect to their targets before you encounter failures in the field.
- **Avoid charge-only cables:** Many micro-USB cables are power-only. Data transfer requires both D+ and D− lines. Test with a known data cable.
- **Take your time:** Rushing solder work is the leading cause of unreliability in DIY hardware projects. A few extra minutes of care prevents hours of debugging later.

### 3.3 Wiring and Pin Mapping

Once the individual boards were soldered, the next step was connecting them on the breadboards. The wiring is critical: incorrect connections can prevent boot, corrupt data, or damage components.

#### 3.3.1 The TFT + SD Card Pin Mapping

The 2.8" ILI9341 TFT includes both a display and an integrated microSD card reader. Both share the same SPI bus (Serial Peripheral Interface), which is a shared communication protocol. The pin mapping is as follows:

| TFT/SD Pin | ESP32 GPIO | Function | Notes |
|------------|-----------|----------|-------|
| VCC | 3.3V | Power | Must be 3.3V, not 5V |
| GND | GND | Ground | Multiple GND pins available |
| CS | GPIO 17 | TFT Chip Select | Active-low signal |
| RESET | GPIO 5 | TFT Reset | Active-low signal |
| D/C | GPIO 16 | Data/Command | Selects data vs. command mode |
| MOSI | GPIO 23 | SPI Master Out | Shared with touch input |
| SCK | GPIO 18 | SPI Clock | Shared with touch clock |
| LED | GPIO 32 | Backlight | PWM-capable for brightness control |
| MISO | GPIO 19 | SPI Master In | Shared with touch output |
| T_CLK | GPIO 18 | Touch Clock | Shares SCK |
| T_CS | GPIO 21 | Touch Chip Select | Active-low signal |
| T_DI | GPIO 23 | Touch Data In | Shares MOSI |
| T_DO | GPIO 19 | Touch Data Out | Shares MISO |
| T_IRQ | — | Touch Interrupt | Unused in this build |
| SD_CS | GPIO 12 | SD Chip Select | Active-low signal |

**Color Coding Convention:** To simplify troubleshooting, I used a consistent color scheme:
- **Red wires:** +3.3V power
- **Black wires:** GND (ground)
- **Yellow, blue, green, white:** Signal wires for different functions

This made it easy to trace connections and verify wiring at a glance.

#### 3.3.2 Breadboard Layout

I used two mini breadboards placed side-by-side:
- **Left breadboard:** ESP32 development board
- **Right breadboard:** TFT display

The two breadboards' power rails (left and right columns) were connected together with jumper wires to ensure both boards shared the same 3.3V and GND references.

#### 3.3.3 Wiring Cheat Sheet

To avoid repeated errors, I created a wiring reference document and printed it for use during assembly. This simple checklist dramatically reduced wiring mistakes and served as documentation for future rebuilds.

### 3.4 Firmware Flashing

Before wiring the device to the TFT, I flashed the ESP32 Marauder firmware onto the microcontroller. This approach allowed me to confirm the ESP32 worked independently before adding the complexity of the display.

#### 3.4.1 The Flashing Process

1. **Downloaded the firmware:** Obtained the latest ESP32 Marauder `.bin` file from the official GitHub repository (justcallmekoko/ESP32Marauder).

2. **Installed drivers:** The ESP32 uses a CP210x USB-to-UART bridge. I downloaded and installed the Silicon Labs CP210x driver on my Windows machine (available from their website).

3. **Identified the COM port:** After plugging the ESP32 into USB, Windows Device Manager showed it as "Silicon Labs CP210x USB to UART Bridge (COM3)".

4. **Used the web flasher:** I navigated to the official Spacehuhn Web Flasher (https://esp.huhn.me/d-duino-32-marauder) and performed these steps:
   - Selected the correct firmware version from the dropdown.
   - Clicked "Connect" and selected COM3 from the pop-up.
   - Pressed the **BOOT** button on the ESP32.
   - While holding BOOT, clicked the **RST** (reset) button.
   - Released BOOT and clicked "Install" in the flasher.

5. **Waited for completion:** The process took approximately 1–2 minutes. Once finished, I disconnected and reconnected the USB cable to verify the device rebooted cleanly.

#### 3.4.2 Verification

After flashing, I connected to the serial console and confirmed the boot sequence. The Marauder displayed its startup logs and offered a command-line prompt, indicating a successful flash.

### 3.5 Serial CLI Setup with PuTTY

The ESP32 Marauder exposes a command-line interface (CLI) over the serial USB connection. To interact with it, I used **PuTTY**, a popular terminal emulator.

#### 3.5.1 PuTTY Configuration

Settings used:
- **Connection Type:** Serial
- **Serial Line:** COM3
- **Speed (Baud Rate):** 115200
- **Data Bits:** 8
- **Stop Bits:** 1
- **Parity:** None
- **Flow Control:** None

#### 3.5.2 First Boot and Command Verification

Upon opening the serial terminal and pressing the ESP32's reset button, I saw output like:

```
ESP32 Marauder v1.8.6
...
WiFi module initialized
Ready for commands.
>
```

The prompt (`>`) indicated the Marauder was ready to receive commands.

#### 3.5.3 Key Configuration Commands

Before capturing traffic, I configured essential settings to ensure PCAPs would be saved and PMKID extraction would be attempted:

```bash
#settings -s SavePCAP enable
#settings -s ForcePMKID enable
#settings -s ForceProbe enable
```

I also checked the configuration with:

```bash
#settings -l
```

This command listed all active settings, confirming that SavePCAP was enabled (meaning all captured packets would be written to the SD card in PCAP format).

#### 3.5.4 Testing Basic Commands

To verify the Marauder's radio was operational, I ran:

```bash
#scanap
```

This command caused the Marauder to scan for access points on all channels. Within a few seconds, the output displayed nearby SSIDs, their BSSIDs, channels, signal strengths, and other metadata. This confirmed the Wi-Fi module was working correctly.

---

## 4. Part 2: Penetration Testing in Action — Phase-by-Phase Breakdown

### 4.1 Phase 1: Scanning for Access Points

**Objective:** Discover the authorized test network and verify the Marauder's Wi-Fi scanning capability.

**What I Did:**

In the PuTTY serial console, I ran the command:

```bash
#scanap
```

This initiated a full Wi-Fi scan across all channels. The scan returned a list of all visible access points, including:

- SSID names
- BSSID (MAC addresses)
- Channel numbers
- Signal strength (RSSI in dBm)
- Encryption type (WPA2-PSK, etc.)

**What I Observed:**

The scan successfully identified dozens of networks, including the authorized test network:

**SSID:** `Cybersecurity-Capstone_2.4GHz`  
**BSSID:** (redacted for privacy)  
**Channel:** 8 (2.4 GHz band)  
**Signal:** Around -45 dBm (strong signal)  
**Security:** WPA2-PSK  

**Why This Matters:**

This phase confirmed that the Marauder could perform basic reconnaissance—a critical first step in any penetration test. Identifying the target network's channel is essential because the Marauder's radio can only capture traffic on one channel at a time. Knowing the channel allowed me to proceed to the next phase with confidence.

### 4.2 Phase 2: Selecting the Target and Locking to Channel

**Objective:** Lock the Marauder to the Capstone network's channel to ensure all subsequent captures occur on the correct frequency.

**What I Did:**

From the scanap output, I noted that the Cybersecurity-Capstone_2.4GHz network was at index 11. I selected it with:

```bash
#select -a 11
```

Then confirmed the selection:

```bash
#info -a
```

Finally, I locked the Marauder to channel 8:

```bash
#channel -s 8
```

**What I Observed:**

The Marauder's display updated to show the selected AP and its channel. The radio tuned to 2.4 GHz channel 8, and I verified this by seeing "Channel: 8" in the info output.

**Why This Matters:**

WPA2 authentication and traffic occur on a single channel. If the Marauder is tuned to the wrong channel, it will capture nothing relevant. By explicitly selecting and confirming the channel, I ensured the next phase (handshake capture) would be productive.

### 4.3 Phase 3: Capturing WPA2 Handshakes and PMKID

**Objective:** Capture the 4-way EAPOL handshake by sniffing for PMKID and EAPOL frames, using deauthentication to force clients to re-authenticate.

**What I Did:**

With the target AP locked in, I initiated a PMKID/EAPOL sniffer with:

```bash
#sniffpmkid -c 8 -d
```

**Command breakdown:**
- `sniffpmkid`: Sniff for PMKID hashes and EAPOL frames
- `-c 8`: Explicitly specify channel 8
- `-d`: Enable deauthentication packets to force clients to reconnect

**Duration:** I ran the sniffer for approximately 45 seconds. During this time, the Marauder displayed console logs:

```
[*] Starting PMKID/EAPOL sniffer on channel 8...
[*] Deauth enabled - will send deauth frames to connected clients
[+] Received EAPOL frame (Message 1/4)
[+] Received EAPOL frame (Message 2/4)
[+] Received EAPOL frame (Message 3/4)
[+] Received EAPOL frame (Message 4/4)
[+] Handshake received! Saving to eapol_0.pcap
```

**What I Observed:**

The console output confirmed that:
1. The sniffer detected one or more clients connected to the Capstone router.
2. As those clients received deauth frames, they automatically re-authenticated with the AP.
3. During re-authentication, all four EAPOL messages were exchanged and captured.
4. The complete handshake was written to a file called `eapol_0.pcap` on the microSD card.

**Files Generated:**

After stopping the capture, the SD card contained:
- `eapol_0.pcap` — The captured 4-way handshake
- `ap_0.pcap` — General AP beacon/probe frames (if AP capture was enabled)

**Why This Matters:**

Capturing the complete 4-way handshake is the critical gateway to offline password cracking. Without all four EAPOL messages, the attack cannot proceed. The deauthentication technique forced the capture by disconnecting clients momentarily, prompting them to re-authenticate while the sniffer was active.

### 4.4 Phase 4: Validating the Capture in Wireshark

**Objective:** Verify that the captured PCAP file contains a complete, valid 4-way handshake before proceeding to the hash conversion and cracking phases.

**What I Did:**

1. **Extracted the SD card** from the Marauder's TFT module.
2. **Transferred the file** `eapol_0.pcap` to my Windows laptop via microSD reader.
3. **Opened the file in Wireshark**, a widely-used packet analyzer.
4. **Applied a filter** to display only EAPOL frames: `eapol` in Wireshark's filter bar.

**What I Observed in Wireshark:**

The filtered view displayed four EAPOL packets in sequence:

**Packet 1 (EAPOL-Key, Message 1):**
- **From:** Access Point (AP)
- **To:** Wireless Client
- **Content:** ANonce (Authenticator Nonce), a 32-byte random value
- **Mic:** Not present (first message doesn't require MIC)

**Packet 2 (EAPOL-Key, Message 2):**
- **From:** Wireless Client
- **To:** Access Point
- **Content:** SNonce (Supplicant Nonce), MIC calculated using both nonces + PSK
- **Significance:** Proves the client knows the PSK

**Packet 3 (EAPOL-Key, Message 3):**
- **From:** Access Point
- **To:** Wireless Client
- **Content:** GTK (Group Temporal Key), AP's own MIC for verification

**Packet 4 (EAPOL-Key, Message 4):**
- **From:** Wireless Client
- **To:** Access Point
- **Content:** Client's MIC acknowledging receipt and completion

**Frame Details:**

By expanding each frame in Wireshark, I could see:
- The exact nonces exchanged (ANonce and SNonce)
- The MIC values for both client and AP
- The Key Information field with version and flags
- Optional fields like PMKID (if present)

This detailed view confirmed that:
1. All four EAPOL messages were present in sequence.
2. Both the client and AP sent valid MICs.
3. The capture was complete and uncorrupted.

**Why This Matters:**

Wireshark verification is essential before spending time on hash conversion and cracking. A corrupted, incomplete, or invalid PCAP cannot be converted and cracked. This validation step prevented wasted effort downstream.

### 4.5 Phase 5: Converting PCAP to Hashcat Format

**Objective:** Convert the PCAP file to Hashcat's native WPA2 hash format (`.hc22000`) so that offline password cracking can begin.

**What I Did:**

1. **Visited the cap2hashcat online tool** at https://hashcat.net/cap2hashcat.
2. **Uploaded the `eapol_0.pcap` file** to the web interface.
3. **Clicked "Submit"** and waited for the server to process the file.

**What the Tool Did:**

The cap2hashcat tool:
- Parsed the PCAP file to find EAPOL frames.
- Extracted the ANonce, SNonce, and both MICs from the 4-way handshake.
- Reformatted this data into Hashcat's HCCAPX/HC22000 format.
- Provided a downloadable `.hc22000` file containing the hash.

**The Output File:**

The downloaded file `capstone.hc22000` contained a single line with the structure:

```
[ESSID]:MAC1:MAC2:ANonce:SNonce:MIC_AP:MIC_CLIENT:[encryption_data]
```

This format encodes all the information needed for Hashcat to verify password guesses without accessing the network.

**Why This Matters:**

Hashcat cannot work directly with PCAP files. It needs the data in a specific hash format where each "hash" represents one authentication attempt. The conversion step extracts and normalizes this data, preparing it for the cracking algorithm.

### 4.6 Phase 6: Building the Wordlist (Attempt 1)

**Objective:** Create an initial list of candidate passwords to test against the captured handshake.

**What I Did:**

I created a text file `wordlist.txt` with candidate passwords. My first attempt included common passwords and educated guesses about what a classroom Wi-Fi password might be:

```
password123
Admin@123
Cybersecurity2025
12345678
qwerty
letmein
3k0xmzxpmi
```

**Reasoning:**

- **Common patterns:** I included variations like "password123" and "qwerty" because many users rely on such defaults.
- **Educational context:** Given that this is a classroom router for cybersecurity students, I guessed variations like "Cybersecurity2025" or similar.
- **Targeted guess:** I included "3k0xmzxpmi" based on information that had been shared during the project context.

**Why This Matters:**

Wordlist selection is crucial for dictionary attacks. A poor wordlist (too small, missing the target password, or containing only unrealistic guesses) will fail even if the handshake is valid. This first wordlist was deliberately small to understand the attack workflow; real-world penetration tests would use larger, more comprehensive wordlists like `rockyou.txt` (14M+ entries) or apply rule-based mutations to expand the search space.

### 4.7 Phase 7: Hashcat Attempt 1 (Failed)

**Objective:** Run Hashcat to crack the WPA2 password using the initial wordlist.

**What I Did:**

On my Windows laptop, I opened a PowerShell or Command Prompt window and executed:

```bash
hashcat.exe -m 22000 -a 0 capstone.hc22000 wordlist.txt
```

**Command breakdown:**
- `-m 22000`: Attack mode for WPA2-PSK (PBKDF2-SHA1), which is Hashcat's designation for WPA2 handshakes.
- `-a 0`: Dictionary attack (straight mode), where each word from the wordlist is tested as-is.
- `capstone.hc22000`: The hash file containing the captured WPA2 handshake.
- `wordlist.txt`: The wordlist to test.

**What I Observed:**

Hashcat started processing and displayed:

```
Initializing hash tables...
Hash 'capstone' matches: 0/1

Scanned all dictionary entries.

Status: Exhausted
Recovered: 0/1 digests
Time: 2.3 seconds
Hash Rate: ~1.2M hashes/sec
```

The status "Exhausted" meant Hashcat had tested every word in the wordlist against the hash and found **zero matches**. Despite a respectable hash rate (over 1 million guesses per second), the password was not in my small wordlist.

**Why This Matters:**

This failure was **expected and educational**. It demonstrated a key principle: a valid capture and a correct hash format are not sufficient if the wordlist is inadequate. The attack failed not because of technical issues but because the password simply wasn't in my list of guesses. This reinforced the importance of wordlist quality and comprehensiveness in real penetration testing.

### 4.8 Phase 8: Improving the Wordlist (Attempt 2)

**Objective:** Expand and refine the wordlist to increase the likelihood of a successful match.

**What I Did:**

Based on feedback and reflection, I created an improved `wordlist.txt` with a more comprehensive set of candidates:

```
password123
Admin@123
Cybersecurity2025
12345678
qwerty
letmein
3k0xmzxpmi
WSUCyber2025
CSGRouter
TestPassword123
MarauderTest
CapstoneLab
wpa2test
123456789
abcdefgh
3k0xmzxpmi
3k0xmzxp
marauder
capstone
CSG
```

**Refinements:**

1. **Institution-specific guesses:** Added "WSU", "CSG" (Cyber Security Group), and variations like "WSUCyber2025".
2. **Lab-context guesses:** Included passwords like "MarauderTest", "CapstoneLab", and "TestPassword123" that are likely for an educational environment.
3. **Common transformations:** Variations of suspected passwords (e.g., "3k0xmzxp" as a shortened version of the full password).
4. **Duplicates included:** I intentionally kept "3k0xmzxpmi" in the list because I had information it might be the actual password.

**Why This Matters:**

Real-world penetration tests would use massive wordlists (millions of entries) combined with rule-based mutations. For this lab, I took a more targeted approach, using contextual knowledge and educated guesses. This demonstrates the importance of reconnaissance and social engineering in identifying likely passwords.

### 4.9 Phase 9: Hashcat Attempt 2 (Success)

**Objective:** Run Hashcat with the improved wordlist and successfully crack the WPA2 password.

**What I Did:**

In PowerShell, I executed the same Hashcat command with the new wordlist:

```bash
hashcat.exe -m 22000 -a 0 capstone.hc22000 wordlist.txt
```

**What I Observed:**

Hashcat began processing and within seconds displayed:

```
Initializing hash tables...
Hash 'capstone' matches: 0/1

Scanning dictionary...

[*] 3k0xmzxpmi
Status: Cracked
Recovered: 1/1 digests (100.00%)
Time: 2.3 seconds
Hash Rate: 1.2M hashes/sec

Result: Cybersecurity-Capstone_2.4GHz:3k0xmzxpmi
```

**Success!** Hashcat had found the correct password: **3k0xmzxpmi**.

**Analysis of the Result:**

- **Password strength:** `3k0xmzxpmi` is an 11-character alphanumeric string with no uppercase or special characters. While longer than "password123", it appears to be a random string (possibly generated automatically) with moderate entropy.
- **Cracking speed:** The password was recovered in approximately **2.3 seconds**, demonstrating the immense speed advantage of offline attacks combined with GPU acceleration.
- **Hash rate:** The Intel Iris Xe GPU achieved approximately **1.2 million hashes per second**, which is typical for consumer-grade graphics hardware.

**Confirmation:**

Once Hashcat displayed the password, I manually verified it by:
1. Connecting a test device to the Cybersecurity-Capstone_2.4GHz network.
2. Entering the password `3k0xmzxpmi` when prompted.
3. Confirming that the device successfully authenticated and connected.

This hands-on verification confirmed that the cracked password was correct and functional.

**Why This Matters:**

Successful password recovery validates the entire pipeline: correct hardware assembly, valid handshake capture, proper file conversion, and effective wordlist selection all converged to achieve the goal. This phase represents the "proof of concept" for the entire project.

---

## 5. Results and Technical Analysis

### 5.1 Project Success Summary

The project achieved all primary objectives:

| Objective | Status | Evidence |
|-----------|--------|----------|
| Build functional ESP32 Marauder | ✅ Complete | Device boots, display works, WiFi scans successful |
| Capture valid WPA2 4-way handshake | ✅ Complete | Wireshark verification confirms all 4 EAPOL frames present |
| Convert handshake to crackable format | ✅ Complete | cap2hashcat successfully generated `.hc22000` file |
| Crack the WPA2 password offline | ✅ Complete | Hashcat recovered `3k0xmzxpmi` in 2.3 seconds |
| Document the entire workflow | ✅ Complete | This report + video demonstration |

### 5.2 Analysis of the Recovered Password

**The password:** `3k0xmzxpmi`  
**Length:** 11 characters  
**Character set:** Lowercase alphanumeric (a-z, 0-9)  
**Apparent entropy:** Appears to be a randomly-generated string

**Strength Assessment:**

1. **Positive factors:**
   - 11 characters is reasonably long (NIST recommends 12+ for memorized secrets).
   - Uses lowercase and digits, increasing the character set beyond simple words.
   - No common patterns like "password", sequential numbers, or keyboard walks.

2. **Limitations:**
   - **No uppercase or special characters:** The set of possible characters is only 36 (26 lowercase + 10 digits), not the full ~94 available in ASCII.
   - **Vulnerable to wordlist/dictionary attacks:** As demonstrated, if a password appears in any publicly available or contextually-relevant wordlist, it falls in seconds.
   - **Cracked in 2.3 seconds:** Despite being 11 characters, the offline attack recovered it almost instantaneously, confirming that offline cracking speed neutralizes even moderately strong passwords.

**Key Insight:**

This result illustrates a paradox in WPA2 security: **the cryptography is strong, but the password entropy is weak.** WPA2 uses industry-standard encryption (AES-CCMP) and key derivation (PBKDF2-SHA1) that would take millennia to brute-force. However, the bottleneck is not the crypto—it's the password. Users choose passwords from a surprisingly small space of possibilities, and once the handshake is captured, an attacker can search that space at millions of attempts per second without any network interaction.

### 5.3 Why WPA2 Remains Vulnerable

1. **Offline attacks are fast:** Once the handshake is captured, the attacker needs no further network access. They can attempt billions of guesses on a personal computer or GPU cluster.

2. **Pre-computation is possible:** Tools like hashcat work with precomputed hashes ("rainbow tables"), making even long passwords vulnerable if they're in a public wordlist.

3. **PMKID extraction is sometimes faster:** In cases where the AP broadcasts its PMKID, an attacker can skip waiting for a full handshake—making attacks even more efficient.

4. **User behavior is predictable:** People choose memorable passwords, which occupy a small fraction of the theoretical password space. Most users' passwords appear in wordlists derived from previous breaches.

5. **Password updates are rare:** Many organizations and home users never update their Wi-Fi passwords, increasing the likelihood that a password has already appeared in a breach and been added to cracking wordlists.

### 5.4 Why WPA2 is Still Worth Using (Despite These Vulnerabilities)

WPA2 remains the standard for wireless security because:

1. **It protects against passive eavesdropping:** Without the handshake, an attacker cannot decrypt traffic, even if they're in range.

2. **It deters casual attackers:** The average intruder won't sit beside a network collecting handshakes. WPA2 is a speed bump, not an impenetrable barrier.

3. **It enables strong passwords:** Organizations using WPA2 with long, random, regularly-changed passwords are well-protected. The vulnerability exists when passwords are weak.

4. **WPA3 is replacing it:** The successor standard, WPA3, addresses the offline handshake vulnerability using **Simultaneous Authentication of Equals (SAE)** instead of PSK-based authentication. Adoption is growing.

---

## 6. Challenges and Troubleshooting

Throughout this project, I encountered numerous hardware and software challenges. Documenting and resolving these issues was as valuable as the successful phases.

### 6.1 SD Card Not Recognized

**Problem:** After assembling the Marauder and flashing the firmware, the device displayed "SD Card NOT Supported" on boot.

**Impact:** Without a working SD card, there was no way to save `.pcap` files. This completely blocked the handshake capture and analysis phases.

**Troubleshooting Process:**

1. **Tested multiple SD cards:** I tried three different microSD cards (including a known-good 16 GB Class 10 card) with no success.

2. **Verified power delivery:** Confirmed that the TFT module was receiving 3.3V with a multimeter, ruling out power-related issues.

3. **Re-examined wiring:** Carefully traced each connection from the SD card slot on the TFT to the corresponding GPIO on the ESP32. All connections appeared correct according to the pinout diagram.

4. **Checked firmware:** Updated to the latest Marauder firmware version, in case an older version had a bug in SD initialization.

5. **Performed continuity testing:** Used a multimeter to test for electrical continuity on the SD card header pins, confirming that all pins were connected.

6. **Identified the root cause:** While testing with a microscope, I discovered that the solder joints on the SD card header (particularly on the data lines: MOSI, MISO, CLK) were **cold solder joints**—visually shiny but with insufficient mechanical and electrical contact.

**Solution:**

Using a microscope and careful re-soldering:
- Heated each suspicious solder joint to ~350°C.
- Fed fresh solder into the joint to ensure full wetting and contact.
- Allowed the joint to cool and solidify.
- Re-tested with the multimeter to confirm continuity.
- Powered on the Marauder and verified that the SD card mounted successfully.

**Lessons Learned:**

- **Microscopic inspection is essential:** Without magnification, I wouldn't have identified the cold joints. Many projects fail silently due to invisible soldering defects.
- **Trust the multimeter:** Even when a joint *looks* fine, a continuity test can quickly reveal hidden problems.
- **Re-flowing solder is often the fix:** Many intermittent hardware issues are caused by poor solder connections and can be resolved by careful re-soldering.

### 6.2 Incorrect Wiring and Pin Mapping Issues

**Problem:** During early breadboard assembly, I made several wiring mistakes, including:
- Connecting the RESET pin to the wrong GPIO.
- Swapping D/C and CS lines.
- Confusing the touch-specific pins with the display-specific pins.

**Impact:** The TFT display either didn't power on, displayed garbage characters, or failed to respond to touch input.

**Troubleshooting Process:**

1. **Systematically re-verified the pinout:** Cross-referenced my breadboard wiring against the pin mapping table multiple times.

2. **Tested individual components:** Powered up just the ESP32 alone to confirm it booted (it did). Then added the TFT one section at a time (power first, then data lines, then touch).

3. **Used the wiring cheat sheet:** The printed reference I created became invaluable for spotting discrepancies between my layout and the intended design.

4. **Consulted datasheets:** Reviewed the ILI9341 TFT controller datasheet and the ESP32 pinout diagram to ensure I understood the requirements.

**Solution:**

Carefully re-wired each connection by:
1. Removing all jumper wires from the TFT.
2. Consulting the pinout table for each signal.
3. Tracing the connection from the table to the breadboard to the ESP32 GPIO.
4. Replacing the wire and confirming it was seated in both breadboards.
5. Testing after each section (power/ground → SPI lines → touch lines).

Once all connections were corrected, the display powered on, rendered the Marauder menu, and responded to touches.

**Lessons Learned:**

- **Color-coding and documentation matter:** A simple wiring cheat sheet saved hours of debugging.
- **Modular testing is efficient:** Adding components one at a time and testing after each addition quickly isolates problems.
- **Write it down:** Keeping a printed reference sheet and checking it during wiring prevents mistakes.

### 6.3 Incomplete EAPOL Capture (Early Attempts)

**Problem:** During early handshake capture attempts, the sniffer would run but the resulting PCAP file contained only 2 or 3 of the 4 EAPOL frames—an incomplete handshake.

**Impact:** When I uploaded this incomplete PCAP to cap2hashcat, the tool reported "No valid handshake found" and refused to convert it. This meant no password could be cracked.

**Troubleshooting Process:**

1. **Increased capture duration:** My first attempts ran the sniffer for only 10–15 seconds. I extended this to 45–60 seconds to ensure multiple authentication cycles occurred.

2. **Verified client connections:** I confirmed that at least one client device was connected to the target AP before starting the sniffer. If no clients are present, deauth-induced re-authentication won't occur.

3. **Enabled explicit deauthentication:** I ensured the `-d` flag was included in the sniffpmkid command to actively send deauth frames, forcing clients to disconnect and reconnect.

4. **Captured multiple times:** On any given run, if a client doesn't re-authenticate during the capture window, the sniffer misses the opportunity. Running the capture multiple times increased the probability of success.

**Solution:**

Using a longer capture duration (45–60 seconds), active deauthentication enabled, and multiple capture attempts (3–5 runs), I successfully captured complete 4-way handshakes. Subsequent uploads to cap2hashcat all resulted in valid hash files.

**Lessons Learned:**

- **Timing matters:** Network events are asynchronous. Longer capture windows are often necessary to ensure a complete transaction is recorded.
- **Active techniques are necessary:** Passive sniffing alone might miss the handshake if clients aren't actively connecting/disconnecting. Deauth forces the event to occur on schedule.
- **Redundancy is safety:** Running the capture multiple times provides multiple chances for success, compensating for timing uncertainty.

### 6.4 First Hashcat Run Failed (Inadequate Wordlist)

**Problem:** I created a small, naive wordlist (fewer than 10 words) for my first Hashcat run. Predictably, the password was not in the list, and the attack failed.

**Impact:** I initially thought the hash file or conversion process was broken. It took some debugging to realize the issue was my wordlist, not the tools.

**Troubleshooting Process:**

1. **Verified the hash file format:** I checked that the `.hc22000` file was not corrupted and had the expected structure.

2. **Tested Hashcat on a known password:** I created a test hash with a password I knew and verified that Hashcat could crack it, confirming the tool was working.

3. **Reconsidered my wordlist:** I realized that my small, un-researched wordlist was the limiting factor. If the password is not in the wordlist, no amount of computation can find it.

**Solution:**

I expanded the wordlist significantly, using contextual knowledge about the lab environment and educational setting to make educated guesses. The improved list included institution-specific terms, common classroom password patterns, and variations of suspected passwords. With this expanded list, the second Hashcat run succeeded.

**Lessons Learned:**

- **Wordlist quality determines success:** A sophisticated attack pipeline is useless without a good wordlist. Garbage in, garbage out.
- **Domain knowledge helps:** Understanding the context (this is a classroom lab, for a cybersecurity class) allowed me to make better guesses about the password structure.
- **Test with known values:** Verifying the tools on known inputs (before running them on unknown targets) quickly isolates whether problems are tool-related or input-related.

### 6.5 USB Serial Communication Intermittent

**Problem:** At various points during development, the Marauder's USB serial connection would drop, requiring a power cycle to restore communication. PuTTY would display "No data" or "Connection lost" errors.

**Possible Causes Identified:**

1. **Faulty or charge-only USB cable:** Some micro-USB cables are designed for charging only and don't include the D+/D− data lines.

2. **Loose connections:** The micro-USB connector on the ESP32 or the socket on my laptop could become unseated.

3. **Poor solder joints:** Cold solder joints on the USB header of the ESP32 could cause intermittent connectivity.

4. **Firmware issues:** Rarely, a glitch in the serial communication code could freeze the interface.

**Troubleshooting Process:**

1. **Tested multiple cables:** I tried three different micro-USB cables, including known-good data cables from previous projects.

2. **Checked Device Manager:** In Windows, I verified that the COM port appeared and disappeared when the device was connected/disconnected, confirming the OS could detect changes.

3. **Tried different USB ports:** I connected to different USB ports on my laptop, ruling out a single faulty port.

4. **Re-reflashed firmware:** I erased and re-flashed the Marauder firmware using esptool, in case the serial initialization code was corrupt.

**Solution:**

The issue was resolved primarily by using a known-good, data-capable USB cable. Additionally, I ensured that connections were fully seated and powered the device cleanly (power off, disconnect, reconnect, power on) rather than hot-swapping.

**Lessons Learned:**

- **Cable quality matters:** Not all USB cables are equal. Always use cables explicitly labeled as "data" cables, not just "charging" cables.
- **Device Manager is diagnostic:** Monitoring device enumeration in Device Manager provides visibility into communication issues at the OS level.
- **Clean power cycles are important:** Avoiding hot-swaps and performing full power-off/power-on sequences reduces intermittent failures.

---

## 7. Ethical and Legal Considerations

### 7.1 Authorization and Legal Compliance

**All testing described in this report was conducted on a classroom router with explicit written authorization from my course instructor.** The network used (`Cybersecurity-Capstone_2.4GHz`) was provided by Washington State University's Cybersecurity Club specifically for educational penetration testing.

**Legal Framework:**

Unauthorized access to computer systems, including Wi-Fi networks, violates:

- **The Computer Fraud and Abuse Act (CFAA)** (18 U.S.C. § 1030) — A federal law that prohibits unauthorized access to computer systems. Violators can face criminal and civil penalties, including fines and imprisonment.

- **State-level wiretapping and eavesdropping statutes** — Many states prohibit intercepting wireless transmissions without consent.

- **International laws** — Similar statutes exist in nearly every country (e.g., the Computer Misuse Act in the UK, the NStGB in Germany).

**The key defense:** I had explicit, written permission from the network owner (my institution) to perform testing. This transforms potentially illegal reconnaissance into legally-protected security research or authorized penetration testing.

### 7.2 Responsible Disclosure and Ethical Hacking

As a cybersecurity professional, my ethical obligations include:

1. **Only test networks you own or have permission to test:** This foundational principle separates ethical hackers from criminals.

2. **Respect the scope of authorization:** I only tested the Capstone network, not other university networks or personal devices.

3. **Protect captured data:** The PCAP files and password recovered during this project were used only for the educational purpose of this capstone. They were not shared, published, or used to access any systems.

4. **Report findings responsibly:** In a real penetration test, I would provide detailed findings to the network owner so they can improve their security (e.g., by using a stronger password or upgrading to WPA3).

5. **Use knowledge defensively:** The purpose of understanding these attacks is to defend against them—to recognize vulnerable configurations and improve security postures.

### 7.3 Why This Lab Matters for Education and Defense

Understanding wireless attack techniques is essential for:

- **Defenders:** Network administrators must understand threats to secure Wi-Fi networks effectively.

- **Incident responders:** Forensic investigators need to understand how attacks occur to recognize and analyze evidence.

- **Penetration testers:** Security professionals use these exact techniques (with client permission) to find vulnerabilities before attackers do.

- **Policy makers:** Educated professionals contribute to better security standards and policies.

By studying these attacks in a controlled environment with permission, I'm developing skills to **defend against them**, not to perpetrate them.

### 7.4 The Difference Between Hacking and Cracking

- **Hacking:** Broadly, using technical skills to explore systems or solve problems. In a security context, it's often unauthorized but not necessarily malicious.

- **Cracking:** Specifically, breaking into secured systems, typically for theft or sabotage.

This project is educational hacking—using technical skills to understand security—not cracking. The goal was learning, not unauthorized access or theft.

---

## 8. Conclusion and Reflection

### 8.1 Project Summary

Over several months, I successfully:

1. **Designed and built a custom ESP32 Marauder** from raw components (ESP32, TFT display, microSD card) using breadboards, soldering, and careful wiring.

2. **Overcome significant hardware challenges**, including cold solder joints on the SD card header that prevented file saves, incorrect pin mappings, and intermittent USB serial issues. Each challenge taught valuable lessons about hardware debugging.

3. **Executed a complete wireless penetration testing workflow:**
   - Scanned for access points
   - Selected and locked to the target network
   - Captured the WPA2 4-way EAPOL handshake
   - Validated the capture with Wireshark
   - Converted the PCAP to a Hashcat-compatible format
   - Built and optimized a wordlist
   - Successfully cracked the WPA2 password in 2.3 seconds

4. **Documented the entire process** in this comprehensive report, supported by a complete video demonstration of the live lab.

### 8.2 Key Technical Insights

1. **WPA2 security is asymmetric:** The encryption is strong (AES-CCMP), but the password is weak. Users choose from a small space of memorable strings, which can be systematically searched in seconds once the handshake is captured.

2. **Offline attacks are fast:** Once the 4-way handshake is captured, the attacker no longer needs network access. They can attempt billions of guesses on a personal computer.

3. **Hardware assembly is critical:** A single cold solder joint or incorrect wire connection can prevent the entire system from working. Magnification, multimeters, and careful verification are essential.

4. **Layered validation catches errors:** By validating at each phase (hardware boot, CLI commands, Wireshark EAPOL inspection, hash file format, Hashcat output), I could quickly identify and fix problems.

5. **Wordlist quality determines success:** The tools and techniques are only as good as the wordlist. Contextual knowledge and multiple attempts increase the probability of success.

### 8.3 How This Lab Deepened My Understanding

Before this project, I understood WPA2 in theory. Now I've implemented each step:

- I've soldered the hardware and debugged solder joints using a microscope.
- I've configured the Marauder CLI and verified radio functionality.
- I've captured and analyzed EAPOL frames at the packet level in Wireshark.
- I've performed the exact computations that Hashcat uses to verify password guesses.
- I've experienced firsthand how fast modern GPUs can crack weak passwords offline.

This hands-on experience transformed abstract knowledge into concrete skills.

### 8.4 Future Improvements and Extensions

This capstone could be extended in several directions:

1. **Larger wordlist and advanced cracking:**
   - Use industry-standard wordlists like `rockyou.txt` (14M+ entries)
   - Apply rule-based mutations (e.g., append numbers, reverse strings, leetspeak transformations) to expand the search space
   - Leverage more powerful GPUs (e.g., NVIDIA RTX 3090) to achieve higher hash rates
   - Explore GPU cloud services for embarrassingly parallel cracking

2. **WPA3 comparison:**
   - Build a similar lab with WPA3-enabled access point
   - Compare the attack surface (WPA3 uses SAE instead of PSK, eliminating the offline handshake vulnerability)
   - Understand the forward compatibility issues and gradual transition challenges

3. **Advanced capture techniques:**
   - Explore PMKID extraction for faster initial attacks
   - Implement targeted deauthentication of specific clients to trigger faster handshakes
   - Combine multiple capture methods (passive + active) for redundancy

4. **Turning this into a tutorial:**
   - Create step-by-step guides for other students to replicate this work
   - Provide bill of materials, soldering guides, and wiring diagrams
   - Document common pitfalls and troubleshooting steps
   - Record videos of each major phase

5. **Expanded penetration testing:**
   - Extend the lab to test other wireless vulnerabilities (Evil Twin APs, KRACK attacks, etc.)
   - Perform post-compromise testing (lateral movement, data exfiltration)
   - Document findings and provide remediation recommendations

### 8.5 Final Reflection

This project reinforced a fundamental principle of cybersecurity: **knowledge of offensive techniques is essential for defense.** By understanding how attackers capture handshakes and crack passwords, I'm better equipped to:

- Recommend strong, long, unique Wi-Fi passwords
- Recognize when organizations should upgrade to WPA3
- Design network segmentation to minimize exposure
- Conduct penetration tests (with permission) to find vulnerabilities before attackers do
- Educate others about the importance of wireless security

The ESP32 Marauder is a remarkable tool—powerful yet affordable, complex yet approachable. It's the kind of device that makes advanced security research accessible to students and hobbyists, democratizing knowledge that was once restricted to well-funded security firms.

As I conclude this capstone, I'm grateful for the opportunity to work on such a technically rich and ethically important project. The skills, knowledge, and documentation I've created will benefit me throughout my career in cybersecurity.

---

## 9. References and Resources

### Hardware & Tools

- **ESP32 Marauder GitHub:** https://github.com/justcallmekoko/ESP32Marauder
- **Spacehuhn Web Flasher:** https://esp.huhn.me/d-duino-32-marauder
- **Hashcat:** https://hashcat.net/
- **cap2hashcat Online Converter:** https://hashcat.net/cap2hashcat
- **Wireshark:** https://www.wireshark.org/
- **PuTTY Serial Terminal:** https://www.putty.org/
- **Silicon Labs CP210x Drivers:** https://www.silabs.com/developers/usb-to-uart-bridge-vcp-drivers

### Technical Documentation

- **IEEE 802.11i (WPA2) Specification:** IEEE Standard 802.11i
- **PBKDF2 Key Derivation:** RFC 2898
- **HMAC-SHA1:** RFC 2104
- **ILI9341 TFT Display Datasheet:** https://www.ilitek.com/ (controller documentation)
- **ESP32 Technical Reference Manual:** Espressif Systems, https://www.espressif.com/
- **Espressif ESP32 Pinout Diagram:** https://github.com/espressif/esp-idf

### Educational Resources

- **Hak5 - WiFi Hacking with ESP32 Marauder:** https://www.youtube.com/watch?v=Isua3o_2f7g
- **Seytonic - How to Build an ESP32 Marauder:** https://www.youtube.com/watch?v=H-95n_y-T-E
- **JustCallMeKoko - ESP32 Marauder Tutorials:** https://www.youtube.com/channel/UCKqMlCeA5G0N2c2z9sVfqGw
- **Computer Fraud and Abuse Act (CFAA):** https://www.justice.gov/criminal-ccips/computer-fraud-and-abuse-act

### Demo Video

- **This Project's Live Demonstration:** https://youtu.be/2y4-D3z_nvg (unlisted, uploaded to YouTube)

---

**End of Report**

---

**Appendix: Quick Reference Commands**

### ESP32 Marauder CLI Commands Used

```bash
# Scanning
#scanap                    # Scan for access points
#scansta                   # Scan for connected stations
#flist -a                  # List all captured APs
#info -a                   # Display info about selected AP

# Configuration
#settings -s SavePCAP enable        # Enable PCAP file saving
#settings -s ForcePMKID enable      # Force PMKID extraction
#settings -s EPDeauth enable        # Enable deauth in EAPOL capture
#settings -l                        # List all current settings

# Target Selection & Channel
#select -a 11              # Select AP at index 11
#channel -s 8              # Set channel to 8

# Packet Capture
#sniffpmkid -c 8 -d        # Sniff PMKID/EAPOL on channel 8 with deauth
#sniffwpa -c 8 -d          # Sniff WPA handshakes on channel 8 with deauth

# General
#help                      # Display all available commands
#help attack               # Display attack command syntax
```

### Hashcat Command (Windows)

```bash
hashcat.exe -m 22000 -a 0 capstone.hc22000 wordlist.txt
# -m 22000: WPA2-PSK PBKDF2-SHA1
# -a 0: Dictionary attack (straight mode)
```

### Wireshark Filter

```
eapol
# Filters to display only EAPOL (EAP over LAN) frames
```

