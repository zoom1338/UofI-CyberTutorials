# Using the ESP32 Marauder and Hashcat to Capture and Crack a WPA2 Handshake

**Author:** Darasimi Ogunbinu-Peters  
**Course:** CPTS 432 – Cybersecurity Capstone  
**Institution:** Washington State University (WSU)  
**Date:** November 2025

---

## 1. Introduction

The WPA2 protocol, while significantly more secure than older standards like WEP, is still vulnerable to offline dictionary attacks if users choose weak passwords. The protocol's 4-way handshake is the critical moment where an authenticating client and the access point exchange authentication frames—and capturing these frames allows an attacker to perform a brute-force attack offline without further network interaction.

In this lab, I captured the WPA2 4-way EAPOL handshake from a controlled, authorized test network using an ESP32 Marauder device, then used hashcat to perform an offline dictionary attack and successfully recover the access point's password. **This work was conducted entirely on a classroom router with explicit written permission from my instructor.** This lab demonstrates why strong, unique passwords are essential for Wi-Fi security and serves as an educational foundation for understanding real-world penetration testing practices. All activities were conducted ethically and legally within the scope of my coursework.

---

## 2. Lab Environment

**Hardware:**
- ESP32 Marauder board (custom-flashed firmware)
- 16GB microSD card (for PCAP capture)
- Windows laptop with Intel Iris Xe graphics
- Classroom router configured with SSID `Cybersecurity-Capstone_2.4GHz` and WPA2-Personal security
- USB-to-serial adapter for Marauder console access

**Software & Tools:**
- ESP32 Marauder firmware (latest version capable of PMKID and EAPOL capture)
- Wireshark (for PCAP verification and frame inspection)
- cap2hashcat (hashcat.net online converter)
- Hashcat 7.1.2 (GPU-accelerated password cracking)
- Simple text-based wordlist containing candidate passwords

---

## 3. Methodology

### 3.1 Configure the ESP32 Marauder

Before scanning and capturing traffic, I configured several key settings on the Marauder to ensure the handshake would be successfully saved:

```
#settings -s SavePCAP enable
#settings -s ForcePMKID enable
#settings -s ForceProbe enable
#settings -s EPDeauth enable
```

These settings ensured that:
- All captured frames were written to the SD card in PCAP format
- The Marauder attempted to extract PMKID hashes whenever possible
- Probe requests were forced to discover hidden or slow-responding networks
- Deauthentication packets could be sent to force clients to re-authenticate

I then scanned for available access points using:

```
#scanap
```

The output displayed all nearby networks, and I identified the target `Cybersecurity-Capstone_2.4GHz` at index 11. I selected it with:

```
#select -a 11
```

This locked the Marauder to the target AP's channel, ensuring all subsequent captures would occur on the correct frequency.

### 3.2 Capture the WPA2 Handshake

With the target selected, I initiated EAPOL handshake capture:

```
#sniffpmkid -c 8 -d
```

This command:
- Started a PMKID/EAPOL sniffer on channel 8 (the target's channel)
- Enabled deauthentication (`-d` flag) to force connected clients to re-authenticate
- Wrote captured frames to `eapol_0.pcap` on the SD card

I ran this capture for approximately 30–45 seconds to ensure at least one complete 4-way handshake was captured. Once finished, I removed the SD card and transferred the `eapol_0.pcap` file to my Windows laptop for verification.

**Verification with Wireshark:**

![Step 1 – EAPOL Handshake in Wireshark](images/Completed_Lab/step1_eapol_handshake.png)

*The above screenshot shows the four EAPOL message exchanges (EAP over LAN) captured in Wireshark, confirming the 4-way handshake was successfully recorded.*

![Step 2 – EAPOL Frame Details](images/Completed_Lab/step2_eapol_details.png)

*This screenshot displays the detailed contents of an EAPOL frame, including the authenticator and supplicant nonces, confirming data integrity.*

### 3.3 Convert Capture for Hashcat

The PCAP file format is not directly compatible with hashcat. I uploaded `eapol_0.pcap` to the online cap2hashcat converter at [hashcat.net/cap2hashcat](https://hashcat.net/cap2hashcat) to extract the handshake into WPA2 hash format.

The converter processed the PCAP and returned a `.hc22000` file (hashcat's native WPA2 format), which I downloaded and saved locally as `capstone.hc22000`.

![Step 3 – Handshake Extraction Successful](images/Completed_Lab/step3_cap2hashcat_success.png)

*This screenshot shows the successful conversion message confirming that the handshake was extracted and is ready for cracking.*

### 3.4 Build the Wordlist

I created a simple wordlist file (`wordlist.txt`) containing candidate passwords:

```
password123
Admin@123
Cybersecurity2025
12345678
qwerty
letmein
3k0xmzxpmi
```

In a real penetration test, I would use industry-standard wordlists like `rockyou.txt` (14 million entries) or apply rule-based mutations to expand the search space. For this controlled lab, I included the actual class password to demonstrate a successful crack. The wordlist approach is called a "dictionary attack" and is far more efficient than brute-forcing all possible character combinations.

### 3.5 Run Hashcat

With the hash file and wordlist ready, I executed hashcat on my Windows machine:

```
hashcat.exe -m 22000 -a 0 capstone.hc22000 wordlist.txt
```

Where:
- `-m 22000`: Attack mode for WPA2-PSK (PBKDF2-SHA1)
- `-a 0`: Dictionary attack (straight wordlist matching)
- `capstone.hc22000`: The extracted handshake hash file
- `wordlist.txt`: The list of passwords to try

Hashcat processed the wordlist and successfully found a match:

```
Cybersecurity-Capstone -> 3k0xmzxpmi
Status: Cracked
Hash.Target: [hash_redacted]
Recovery Time: ~2.3 seconds
Hash Rate: 1.2M hashes/sec
```

![Step 4 – Hashcat Cracked Password](images/Completed_Lab/step4_hashcat_cracked.png)

*This screenshot shows the hashcat output indicating a successful crack, with the recovered password displayed.*

---

## 4. Results

The lab was successful on all fronts:

1. **Handshake Capture:** Using the ESP32 Marauder, I successfully captured a valid WPA2 4-way EAPOL handshake and wrote it to a PCAP file.

2. **Handshake Conversion:** The PCAP file was correctly converted to hashcat format (WPA2 PBKDF2-SHA1 hash mode 22000) using the cap2hashcat online tool.

3. **Password Recovery:** Hashcat recovered the correct access point password, `3k0xmzxpmi`, in approximately 2.3 seconds with a hash rate of 1.2M hashes/sec on Intel Iris Xe graphics.

The successful recovery demonstrates that even protocols like WPA2, which add significant security improvements over WEP and WPA, remain vulnerable to offline dictionary attacks when users select weak or commonly-guessed passwords.

---

## 5. Discussion & Troubleshooting

During this project, I encountered and resolved several challenges:

**Issue: Marauder not saving PCAP files to SD card**
- *Root cause:* The `SavePCAP` setting was not enabled in firmware configuration.
- *Solution:* Updated firmware settings with `#settings -s SavePCAP enable` and verified the SD card was properly inserted and formatted.

**Issue: Incorrect channel selected during capture**
- *Root cause:* The target AP's actual channel was 8, but I initially selected the wrong index.
- *Solution:* Re-ran `#scanap`, verified the correct channel, and used the proper index with `#select -a 11`.

**Issue: cap2hashcat reported "No handshake found"**
- *Root cause:* The PCAP file was incomplete—the capture duration was too short and only captured 3 of the 4 EAPOL messages.
- *Solution:* Re-captured the handshake with a longer runtime (45+ seconds) to guarantee a complete 4-way exchange.

**Issue: Hashcat rejected the wordlist due to encoding**
- *Root cause:* The wordlist file was saved in UTF-16 instead of UTF-8.
- *Solution:* Recreated the wordlist as plain UTF-8 text.

**Lessons for future students:**
- Always verify that clients are actually connected to the target AP before starting the deauth/capture.
- Double-check the correct AP channel in the scan output before selecting.
- If cap2hashcat reports failure, try capturing again with a longer time window.
- Ensure PCAP files are non-empty before uploading to conversion tools: `ls -lah eapol_0.pcap`.

---

## 6. Ethical Considerations

**This lab should only be performed on networks you own or have explicit written permission to test.** In this case, I conducted all work on a classroom router provided and authorized by my instructor. Unauthorized access to computer systems, including Wi-Fi networks, is illegal under the Computer Fraud and Abuse Act (CFAA) and similar laws worldwide. The techniques demonstrated here—handshake capture and offline cracking—are powerful offensive tools and must be used responsibly and legally. As cybersecurity professionals, we have an ethical obligation to use our knowledge to improve security, not to harm or exploit others.

---

## 7. Conclusion

This lab successfully demonstrated the complete workflow for capturing and cracking a WPA2 wireless handshake using readily available tools and affordable hardware. The process reinforced several critical lessons: password strength is crucial (the 8-character string was cracked in seconds), offline attacks are extremely fast and require no further network access once the handshake is captured, and proper network segmentation and authentication protocols are only as strong as their weakest implementations.

For anyone defending their own networks, the takeaway is clear: use unique, long, random passwords (14+ characters), consider upgrading to WPA3 where possible, and disable Wi-Fi Protected Setup (WPS). For security professionals and penetration testers, this exercise demonstrates why client-side security awareness and employee training are critical—even strong encryption is vulnerable if users choose weak credentials.

---

---

# Tutorial: From Building to Using the ESP32 Marauder for WPA2 Testing

## Part A: Building the ESP32 Marauder

### Overview

The ESP32 Marauder is a powerful, open-source Wi-Fi hacking tool built on the affordable ESP32 microcontroller. This section walks you through assembling and configuring your own Marauder from scratch.

**⚠️ IMPORTANT:** Only use the ESP32 Marauder on networks you own or have explicit written permission to test. Unauthorized access to Wi-Fi networks is illegal. Always obtain permission in writing from a network owner or authorized representative before performing any security testing.

### Hardware Requirements

- **ESP32 development board** (any variant; I used a standard 30-pin board)
- **microSD card** (16GB recommended; Class 10 for fast write speeds)
- **microSD card reader/adapter**
- **USB micro-B cable** (for power and serial communication)
- **Computer** (Windows, macOS, or Linux)
- *Optional:* Small breadboard, push buttons, and jumper wires (for enhanced UI)

### Step 1: Flash the Marauder Firmware

1. Download the latest ESP32 Marauder firmware from the official GitHub repository: [justcallmekoko/ESP32Marauder](https://github.com/justcallmekoko/ESP32Marauder/releases)

2. Download and install **ESP32 Flash Tool** (or use esptool.py if you're comfortable with Python):
   ```
   pip install esptool
   ```

3. Connect your ESP32 board to your computer via USB micro-B cable.

4. Identify the COM port:
   - **Windows:** Open Device Manager and look for "COM#" under Ports.
   - **Linux/macOS:** Run `ls /dev/tty*` and look for `/dev/ttyUSB*` or `/dev/ttyACM*`.

5. Erase the existing firmware:
   ```
   esptool.py --port COM3 erase_flash
   ```
   (Replace `COM3` with your actual COM port.)

6. Flash the Marauder firmware:
   ```
   esptool.py --port COM3 --baud 460800 write_flash -z 0x1000 marauder.bin
   ```

7. Wait for the flash to complete (1–2 minutes). The board will reboot automatically.

### Step 2: Prepare the SD Card

The Marauder stores all PCAP captures on an SD card. Before your first use:

1. Format the microSD card as **FAT32** (most operating systems support this by default).

2. *Optional:* Create a `/pcaps/` folder on the root of the card. The Marauder will auto-create this, but pre-creating it ensures proper organization.

3. Insert the formatted microSD card into the SD card slot on your ESP32 board (usually on the back or side).

### Step 3: Connect via Serial Console

To interact with the Marauder, you'll need a serial terminal connection:

1. Download and install **PuTTY** (Windows) or use a terminal emulator:
   - **Windows:** [PuTTY](https://www.putty.org/)
   - **macOS/Linux:** Use built-in tools like `screen` or `minicom`

2. Open your serial terminal with these settings:
   - **Baud Rate:** 115200
   - **Data Bits:** 8
   - **Stop Bits:** 1
   - **Parity:** None
   - **Flow Control:** None

3. Press the Reset button on your ESP32 or cycle power. You should see the Marauder boot sequence and a command prompt (`>`).

### Step 4: Configure Initial Settings

Upon first boot, configure these essential settings:

```
#settings -s SavePCAP enable
#settings -s ForcePMKID enable
#settings -s ForceProbe enable
#settings -s EPDeauth enable
```

Verify your settings:
```
#settings -l
```

### Step 5: Your Marauder is Ready

Congratulations! Your ESP32 Marauder is now ready for Wi-Fi penetration testing. Proceed to **Part B** to learn how to capture and crack a real WPA2 handshake.

---

## Part B: Using the Marauder to Capture and Crack a WPA2 Handshake

### Overview

Now that you have a working Marauder, this section walks through the complete offensive workflow: finding a target network, capturing its handshake, converting the capture to a crackable hash format, and using hashcat to recover the password.

**Important:** This process should only be performed on networks you own or have explicit written permission to audit. Ensure you have authorization before proceeding.

### Step 1: Scan for Target Networks

Connect to your Marauder's serial console and initiate an access point scan:

```
#scanap
```

The output will display all nearby Wi-Fi networks:

```
BSSID              SSID                       Channel  RSSI  Security
------------------+--+-----+---------
AA:BB:CC:DD:EE:00  Cybersecurity-Capstone_...  8       -45   WPA2/WPA3
AA:BB:CC:DD:EE:01  HomeNetwork                 11      -60   WPA2
AA:BB:CC:DD:EE:02  Coffee Shop Guest           1       -75   Open
```

Look for the network you have permission to test. Note its **index number** (left-most column), **SSID**, and **channel**.

**Pro Tip:** Networks with RSSI closer to 0 (like -45) are stronger and easier to capture from. Avoid testing networks too far away (-80 or lower) as you may miss the handshake.

### Step 2: Select Your Target

Once you identify your target, select it using its index. For example, if Cybersecurity-Capstone is at index 1:

```
#select -a 1
```

The Marauder will lock to that network's channel and BSSID. Verify the selection:

```
#list -b
```

You should see the selected AP highlighted or confirmed in the output.

### Step 3: Initiate PMKID and EAPOL Capture

Start the PMKID/EAPOL sniffer with deauthentication enabled:

```
#sniffpmkid -c 8 -d
```

Where:
- `-c 8`: Manually specify the channel (optional; Marauder already knows it from your selection).
- `-d`: Enable deauthentication to force clients to re-authenticate.

**What's happening:** The Marauder will send deauthentication packets to connected clients, forcing them to disconnect and immediately re-authenticate. During this re-authentication, the 4-way handshake occurs—and the Marauder captures all four EAPOL frames and writes them to `eapol_0.pcap`.

Let the capture run for **30–60 seconds**. You should see log messages indicating captured frames. Once satisfied, press `CTRL+C` to stop.

**Pro Tip:** If no clients are connected to the target AP, the deauth won't work. Wait for someone to connect first, or come back at a busier time when the network has active users.

### Step 4: Retrieve and Verify the PCAP File

Power off the Marauder and remove the microSD card. Insert it into your laptop's SD card reader.

Navigate to the PCAP storage location (usually `/pcaps/` on the SD card) and locate `eapol_0.pcap`. Copy it to your work directory.

**Verify the capture with Wireshark:**

1. Open Wireshark and load the `eapol_0.pcap` file.

2. In the filter bar, type:
   ```
   eapol
   ```

3. You should see 4–6 EAPOL frames displayed. Look for:
   - **Message 1 of 4:** Authenticator → Supplicant (contains AN once, SNonce blank)
   - **Message 2 of 4:** Supplicant → Authenticator (contains SNonce, no MIC)
   - **Message 3 of 4:** Authenticator → Supplicant (contains both nonces and is MIC-protected)
   - **Message 4 of 4:** Supplicant → Authenticator (MIC-protected acknowledgment)

If you see all four messages, your handshake is complete and valid for cracking.

**Pro Tip:** If Wireshark shows only 1–3 EAPOL frames, go back and re-capture with a longer runtime. Cap2hashcat will reject incomplete handshakes.

### Step 5: Convert PCAP to Hashcat Format

Hashcat doesn't read PCAP files directly; it needs the handshake in its own binary format (`.hc22000` for WPA2). Use the free online converter:

1. Navigate to [hashcat.net/cap2hashcat](https://hashcat.net/cap2hashcat).

2. Upload your `eapol_0.pcap` file.

3. Wait for the conversion (usually 10–30 seconds).

4. Download the resulting `.hc22000` file.

If the converter reports "No valid handshake found," your PCAP is incomplete. Go back to **Step 3** and re-capture.

**Pro Tip:** Save the `.hc22000` file in a dedicated folder, like `C:\hashcat\hashes\`, to keep your workspace organized.

### Step 6: Create a Wordlist

Hashcat uses wordlists to guess passwords. Create a simple text file (`wordlist.txt`) with candidate passwords:

```
password123
Admin@123
letmein
12345678
qwerty
MyPassword!
Capstone2025
```

Save this file in your hashcat working directory.

In real penetration tests, you'd use industry wordlists:
- **rockyou.txt** (14+ million passwords)
- **SecLists** from GitHub
- Rule-based mutations to expand the search space

**Pro Tip:** Start with a small wordlist to ensure your setup works, then expand to larger lists if the password isn't found quickly.

### Step 7: Run Hashcat

On your Windows machine, open a Command Prompt (or PowerShell) in your hashcat directory and run:

```
hashcat.exe -m 22000 -a 0 capstone.hc22000 wordlist.txt
```

Hashcat will:
1. Load the hash file
2. Read the wordlist
3. Generate candidates and test them against the hash
4. Display progress in real time

Example output:

```
hashcat (v7.1.2) starting...

Status: Cracked
Hash.Target: [hash_string]
Hash.Type: WPA-PSK PBKDF2-SHA1 (Iterations: 4096)
Candidate: MyPassword!
Recovered Time: 00:00:03
Hash Rate: 1.2M hashes/sec
Progress: 128/1000 passwords tested (12%)
```

Once hashcat displays `Status: Cracked`, the password has been recovered.

**Pro Tip:** If hashcat reports `Status: Exhausted` without cracking, the password isn't in your wordlist. Add more candidates, try rule-based mutations (flag `-r`), or use a larger dictionary.

### Step 8: Verify the Result

The cracked password is displayed in the output. Cross-reference it with the actual network to confirm you've recovered the correct credential.

**Congratulations!** You've successfully captured and cracked a WPA2 handshake—the complete offensive cycle that demonstrates why strong, unique passwords are critical for Wi-Fi security.

---

---

# Slide Deck Outline for Demo Video

## Slide 1: Title Slide
**Title:** Using the ESP32 Marauder and Hashcat to Capture and Crack a WPA2 Handshake

**Content:**
- Presenter: Darasimi Ogunbinu-Peters
- Course: CPTS 432 – Cybersecurity Capstone
- Institution: Washington State University (WSU)
- Date: November 2025

**Visual:** A professional title slide with a background showing a laptop and Wi-Fi symbol.

**Speaker Notes:** 
"Good morning. Today I'm presenting my capstone project on Wi-Fi security penetration testing. I'll walk you through capturing a real WPA2 handshake and cracking the password offline—a process that showcases both the power of modern security tools and the critical importance of strong passwords."

---

## Slide 2: What is WPA2 and Why We Care
**Content:**
- Wi-Fi Protected Access 2 (WPA2) is the current standard for wireless network security
- Uses CCMP encryption (AES) and 4-way EAPOL handshake for authentication
- More secure than WEP and WPA1, but still vulnerable to offline attacks if passwords are weak
- Understanding WPA2 vulnerabilities helps us defend our own networks

**Visual:** Diagram showing the WPA2 security stack.

**Speaker Notes:** 
"WPA2 has been the gold standard for Wi-Fi security for years. But security is only as strong as its weakest link—in this case, the user's password. If someone chooses a weak password, an attacker can capture the handshake and crack it offline in minutes or seconds."

---

## Slide 3: Ethical and Legal Boundaries
**Content:**
- ⚠️ **ONLY test networks you own or have written permission to audit**
- Unauthorized access is illegal under the Computer Fraud and Abuse Act (CFAA)
- This lab was conducted on a classroom router with explicit instructor permission
- Ethical hacking requires responsibility, transparency, and legal compliance

**Visual:** A "Caution" or "Legal" icon with red/yellow warning colors.

**Speaker Notes:** 
"Before we dive into the technical details, I want to emphasize something crucial: everything you see today is legal and ethical only because I had explicit written permission from my instructor. The same techniques, used without permission, would be criminal. As cybersecurity professionals, we have a duty to use our knowledge responsibly."

---

## Slide 4: Building the ESP32 Marauder – Hardware
**Content:**
- **What:** The ESP32 Marauder is an open-source Wi-Fi penetration testing device
- **Hardware components:**
  - ESP32 microcontroller board
  - microSD card (16GB, Class 10)
  - USB micro-B cable for power and serial communication
  - Laptop with flashing tools
- **Cost:** ~$20–$40 for a fully functional device

**Visual:** A photo of an ESP32 Marauder board with labels on key components.

**Speaker Notes:** 
"The beauty of the Marauder is that it's extremely affordable and powerful. For less than the cost of a pizza, you can build a device capable of advanced wireless penetration testing. It's designed to be accessible to students and security enthusiasts."

---

## Slide 5: Building the Marauder – Firmware Flashing
**Content:**
- Download latest firmware from GitHub (justcallmekoko/ESP32Marauder)
- Use esptool.py to erase and flash the board:
  ```
  esptool.py --port COM3 erase_flash
  esptool.py --port COM3 write_flash -z 0x1000 marauder.bin
  ```
- Board auto-reboots once flashing completes
- Connect via serial terminal (115200 baud) to access the command interface

**Visual:** Screenshot of esptool.py output showing successful firmware flash.

**Speaker Notes:** 
"Flashing the Marauder is straightforward. The esptool erases any existing firmware and loads the Marauder binary. Once done, you connect via a serial terminal and you're ready to start scanning for networks."

---

## Slide 6: Building the Marauder – Initial Setup
**Content:**
- Insert formatted microSD card into the board
- Configure critical settings:
  ```
  #settings -s SavePCAP enable
  #settings -s ForcePMKID enable
  #settings -s EPDeauth enable
  ```
- These ensure PCAP captures are saved, PMKID hashes are extracted, and deauth works properly
- Verify settings with `#settings -l`

**Visual:** Screenshot of Marauder terminal showing settings output.

**Speaker Notes:** 
"These three settings are essential. SavePCAP tells the Marauder to write captured frames to the SD card. ForcePMKID and EPDeauth enable the offensive capabilities we'll use to force client re-authentication."

---

## Slide 7: Finding the Target Network
**Content:**
- Execute `#scanap` to discover nearby access points
- Output shows SSID, BSSID, channel, signal strength (RSSI), and security type
- I identified the target: `Cybersecurity-Capstone_2.4GHz` on channel 8 with -45 RSSI
- Select the target using `#select -a 1` (where 1 is the index)

**Visual:** Screenshot of `#scanap` output showing multiple networks with the target highlighted.

**Speaker Notes:** 
"The scan shows all nearby networks. I'm looking for my target, which is clearly labeled and authorized. The RSSI of -45 tells me the signal is strong, which is good—a weak signal might mean I miss the handshake."

---

## Slide 8: Capturing the Handshake – The Attack Begins
**Content:**
- Run `#sniffpmkid -c 8 -d` to begin EAPOL capture with deauthentication
- The `-d` flag sends deauth packets to connected clients, forcing re-authentication
- During re-auth, the 4-way EAPOL handshake occurs
- Marauder captures all frames and writes them to `eapol_0.pcap` on the SD card
- Duration: 30–60 seconds per attempt

**Visual:** Diagram of the 4-way EAPOL handshake showing all four message exchanges.

**Speaker Notes:** 
"This is where the attack happens. The deauth forces clients to disconnect and immediately reconnect. When they reconnect, the access point and client exchange four EAPOL frames—and we capture all of them. These frames are the cryptographic proof needed to crack the password offline."

---

## Slide 9: Verifying the Capture in Wireshark
**Content:**
- Remove the SD card and copy `eapol_0.pcap` to your laptop
- Open the file in Wireshark and filter for EAPOL frames
- **Verify you see all 4 messages:**
  - Message 1: Authenticator → Supplicant
  - Message 2: Supplicant → Authenticator
  - Message 3: Authenticator → Supplicant
  - Message 4: Supplicant → Authenticator

**Visual:** ![Step 1 – EAPOL Handshake in Wireshark](images/Completed_Lab/step1_eapol_handshake.png)

**Speaker Notes:** 
"Once I transfer the PCAP file to my laptop, I verify it in Wireshark. If all four EAPOL messages are present, I have a complete handshake. If I'm missing any, I go back and re-capture."

---

## Slide 10: Converting PCAP to Hashcat Format
**Content:**
- PCAP files aren't directly readable by hashcat; they need conversion
- Use free online converter: hashcat.net/cap2hashcat
- Upload `eapol_0.pcap` and download the resulting `.hc22000` file
- The `.hc22000` format contains the PBKDF2 hash that hashcat can attack
- Conversion confirms handshake is valid and complete

**Visual:** ![Step 3 – Handshake Extraction Successful](images/Completed_Lab/step3_cap2hashcat_success.png)

**Speaker Notes:** 
"The cap2hashcat tool extracts the relevant cryptographic material from the PCAP and formats it for hashcat. If the conversion fails, it means the handshake was incomplete and I'd need to re-capture. Fortunately, my capture converted successfully."

---

## Slide 11: Building the Wordlist
**Content:**
- Create a simple text file with candidate passwords:
  ```
  password123
  Admin@123
  letmein
  MyPassword!
  3k0xmzxpmi
  ```
- In real engagements, use industry wordlists (rockyou.txt = 14M+ passwords)
- This lab uses a small wordlist for demonstration purposes
- Larger wordlists increase crack time but improve success rate

**Visual:** A simple text file shown in Notepad with several passwords listed.

**Speaker Notes:** 
"For this lab, I created a small wordlist containing likely candidates. In a real penetration test, I'd use much larger, well-curated wordlists or apply rule-based mutations to expand my search space. The bigger the wordlist, the more likely you'll find the password—but the longer it takes."

---

## Slide 12: Running Hashcat – The Offline Attack
**Content:**
- Execute hashcat on the extracted hash file:
  ```
  hashcat.exe -m 22000 -a 0 capstone.hc22000 wordlist.txt
  ```
- `-m 22000`: WPA2-PSK PBKDF2-SHA1 hash mode
- `-a 0`: Dictionary attack (compare wordlist entries to hash)
- Hashcat uses GPU acceleration for extreme speed
- Hash rate: 1.2M hashes/second on Intel Iris Xe

**Visual:** Screenshot of hashcat command execution in Command Prompt.

**Speaker Notes:** 
"Hashcat is running a dictionary attack. It takes each password from my wordlist, hashes it using the same algorithm the access point used, and compares it to the captured hash. The GPU acceleration means it can test over a million passwords per second."

---

## Slide 13: Success – Password Cracked
**Content:**
- Hashcat output:
  ```
  Status: Cracked
  Candidate: 3k0xmzxpmi
  Recovery Time: 2.3 seconds
  Hash Rate: 1.2M hashes/sec
  ```
- The correct password was found on the 7th attempt from the wordlist
- This demonstrates both the power of dictionary attacks and the danger of weak passwords

**Visual:** ![Step 4 – Hashcat Cracked Password](images/Completed_Lab/step4_hashcat_cracked.png)

**Speaker Notes:** 
"Hashcat found the password in just 2.3 seconds. Even though the password looks somewhat complex, it was cracked almost instantly. This is why password strength and uniqueness are critical—if my wordlist contained rockyou.txt with 14 million entries, it still would've been found very quickly."

---

## Slide 14: What We Learned – Key Takeaways
**Content:**
- **Technical takeaways:**
  - WPA2 is vulnerable to offline dictionary attacks once the handshake is captured
  - The 4-way EAPOL handshake is the critical moment in authentication
  - Modern GPU-accelerated tools make cracking fast and affordable
  
- **Security implications:**
  - Password strength is absolutely critical
  - A weak password can be recovered in seconds, even with modern encryption
  - This is why multi-factor authentication and strong password policies matter

**Visual:** A comparative graphic showing password strength vs. crack time.

**Speaker Notes:** 
"This lab reinforced several critical lessons. First, encryption is only as strong as the password protecting it. Second, attackers don't need to eavesdrop in real-time—they can capture the handshake once and attack it offline, forever. Finally, even a somewhat complex-looking password like mine was cracked instantly, showing why we need even stronger password strategies."

---

## Slide 15: Hardening Your Own Wi-Fi Network
**Content:**
- **Defend your network:**
  - Use a long, random, unique password (14+ characters, no dictionary words)
  - Consider upgrading to WPA3 (newer standard, more resistant to offline attacks)
  - Disable WPS (Wi-Fi Protected Setup—it's a backdoor)
  - Change default router admin credentials
  - Enable logging and monitor for unexpected device connections
  
- **For larger organizations:**
  - Implement 802.1X with certificate-based authentication
  - Use network segmentation (guest networks separate from trusted devices)
  - Regular security audits with authorized penetration testers

**Visual:** A checklist or best-practices infographic.

**Speaker Notes:** 
"Now that we've seen how vulnerable Wi-Fi can be, let's talk about defense. The most important step is using a strong password—16+ characters, mixing upper/lowercase, numbers, and symbols, with no dictionary words. If you're managing a network, WPA3 is the future and offers much better protection against these attacks. For enterprise environments, certificate-based authentication eliminates the password attack vector entirely."

---

## Slide 16: Questions and Discussion
**Content:**
- Open floor for audience questions
- Possible discussion points:
  - Have you been a victim of Wi-Fi hacking?
  - How would you test security on a network you manage?
  - What are the barriers to stronger password policies in practice?

**Visual:** Your contact information or a QR code linking to your GitHub repository.

**Speaker Notes:** 
"That concludes my presentation. I'd be happy to answer any questions about the technical process, the tools, or the ethical implications of these techniques. I'm also happy to discuss how to implement stronger security on your own networks or in an organizational context."

---

**End of Presentation**
    -   Document the command used and the successful recovery of the password.
-   **[ ] Phase 9 – Verify Access with Recovered Password:**
    -   Use the cracked password to connect a device to the `Cybersecurity-Capstone_2.4GHz` network.
    -   Confirm successful authentication and network access to validate the entire process.

---

## 4. Project Timeline & Deliverables

The project is proceeding on a strict timeline to meet final submission deadlines.

-   **Key Deadline 1:** Poster Submission (December 1st)
-   **Key Deadline 2:** Final Presentation (December 4th)

To meet these deadlines, the goal is to have all technical phases and initial tutorial drafts completed by the end of November.

---

## 5. Tutorial Development Plan

In parallel with the final technical phases, work will proceed on the tutorial deliverables. The planned structure for the video tutorial is as follows:

1.  **Introduction:** Project overview, goals, and a discussion of challenges encountered (e.g., hardware assembly, troubleshooting).
2.  **Part 1: Building the ESP32 Marauder:** A comprehensive guide covering hardware assembly, soldering, flashing the firmware, and installing necessary software like Putty.
3.  **Part 2: Penetration Testing in Action:** A step-by-step walkthrough of the entire Wi-Fi cracking process, from scanning to the final password recovery (Phases 1-9).
4.  **Conclusion:** A summary of the results and a discussion of potential future work or improvements.
