# ESP32 Marauder: 7-Day Testing & Documentation Plan

This plan outlines the daily tasks for moving from hardware assembly to a documented proof-of-concept. Each day is designed to take less than one hour.

---

### **Day 1: Environment & Hardware Verification (≤ 30 mins)**

**Goal:** Confirm your Linux environment can communicate with the ESP32 Marauder.

1.  **Connect the Marauder:** Plug the ESP32 Marauder into your computer.
2.  **Identify the Serial Port:** Open your WSL/Linux terminal and run the following command to see how the device is recognized.

    ```bash
    dmesg | grep -i "tty"
    ```

    **Expected Output:** You should see a line indicating a new USB serial device, typically named `ttyUSB0` or `ttyACM0`. Note this device name.

3.  **Install a Serial Terminal (if needed):** The Marauder interface is accessed over serial. `tio` is a modern, easy-to-use tool.

    ```bash
    # For Debian/Ubuntu/Kali
    sudo apt-get update
    sudo apt-get install tio
    ```

4.  **Connect to the Marauder:** Use `tio` and the device name from step 2. The Marauder's default baud rate is 115200.

    ```bash
    # Replace /dev/ttyUSB0 with your device name
    tio /dev/ttyUSB0 -b 115200
    ```

    **Expected Output:** You should see the Marauder's welcome screen and command prompt. Type `help` to see a list of commands.

**Daily Deliverable:** Confirmation that you can connect to and interact with the Marauder.
**GitHub Action:** No commit necessary.

---

### **Day 2: Wi-Fi Sniffing & Passive Reconnaissance (≤ 45 mins)**

**Goal:** Use the Marauder to scan for local Wi-Fi networks and confirm its sniffing capabilities.

1.  **Connect to the Marauder:** Open a connection using `tio` as you did on Day 1.
2.  **Start a Wi-Fi Scan:** At the Marauder prompt, run the scan command.

    ```
    scan -c 1,6,11
    ```

    This command will scan for Wi-Fi access points on channels 1, 6, and 11, which are the most common non-overlapping channels.

3.  **Capture the Output:** Let the scan run for about a minute. Take a screenshot of the terminal showing the list of detected networks.
4.  **Save the Screenshot:** Save the image as `wifi_scan_output.png` in the `Deliverables/images/` directory.

**Daily Deliverable:** A screenshot showing the Marauder successfully identifying nearby Wi-Fi networks.
**GitHub Action:**
```bash
git add Deliverables/images/wifi_scan_output.png
git commit -m "feat: Capture initial Wi-Fi scan results with Marauder"
```

---

### **Day 3: WPA2 Handshake Capture (≤ 1 hour)**

**Goal:** Capture a 4-way handshake from a target network and save it to the SD card.

1.  **Prepare for Capture:** Ensure an SD card is inserted into your Marauder.
2.  **Select a Target:** From the scan list from Day 2, choose a network to target (preferably your own for testing). Note its SSID and channel.
3.  **Start the Sniffing Attack:** Use the `sniff` command to listen for handshakes on a specific channel. The `-s` flag saves the capture to the SD card.

    ```
    # Replace -c 6 with the channel of your target network
    sniff -c 6 -s
    ```

4.  **Trigger a Handshake:** For a handshake to occur, a device must connect to the network. Use your phone or another computer to disconnect and reconnect to the target Wi-Fi network. The Marauder's screen should indicate when a handshake has been captured.
5.  **Stop the Capture:** Press the Marauder's boot button to stop the sniffing process. The `.pcap` file will be saved on the SD card.

**Daily Deliverable:** A `.pcap` file containing a WPA2 handshake stored on the Marauder's SD card.
**GitHub Action:** Update your progress log.
```bash
# Edit marauder_progress_update.md to note the successful handshake capture.
git add Deliverables/marauder_progress_update.md
git commit -m "docs: Log successful WPA2 handshake capture"
```

---

### **Day 4: Preparing for the Crack (≤ 30 mins)**

**Goal:** Transfer the captured handshake and the sample `.pcap` file into your project directory.

1.  **Transfer the Captured File:** Remove the SD card from the Marauder, insert it into your computer, and copy the newly created `.pcap` file into `Experiments/sample-pcaps/`. Rename it `marauder_capture.pcap`.
2.  **Locate the Tutorial Handshake:** In your `wpa2_tutorial.md`, you mention a sample `.pcap` file. Ensure this file is also located in `Experiments/sample-pcaps/`. Let's assume it's named `wpa2_sample.pcap`.
3.  **Install Aircrack-ng:** This is the tool you'll use to crack the handshake.

    ```bash
    sudo apt-get install aircrack-ng
    ```

**Daily Deliverable:** The necessary `.pcap` files are in your project, and `aircrack-ng` is installed.
**GitHub Action:**
```bash
git add Experiments/sample-pcaps/marauder_capture.pcap
git commit -m "feat: Add captured WPA2 handshake pcap for testing"
```

---

### **Day 5: Cracking the Sample Handshake (≤ 45 mins)**

**Goal:** Verify your cracking process using the known sample file from `wpa2_tutorial.md`.

1.  **Run Aircrack-ng:** Use `aircrack-ng` with a wordlist to crack the sample file. Kali Linux has many built-in wordlists. `rockyou.txt` is a common starting point.

    ```bash
    # The path to rockyou.txt may vary. Use `locate rockyou.txt` to find it.
    aircrack-ng Experiments/sample-pcaps/wpa2_sample.pcap -w /usr/share/wordlists/rockyou.txt.gz
    ```

2.  **Analyze the Output:** The process will run, and if the password is in the wordlist, `aircrack-ng` will display "KEY FOUND!".
3.  **Capture Proof:** Take a screenshot of the successful terminal output, showing the command and the found key. Save it as `wpa2_crack_success.png` in `Deliverables/images/`.

**Daily Deliverable:** A screenshot confirming a successful crack of the sample WPA2 handshake.
**GitHub Action:**
```bash
git add Deliverables/images/wpa2_crack_success.png
git commit -m "feat: Demonstrate successful WPA2 crack with aircrack-ng"
```

---

### **Day 6: Documentation Update (≤ 1 hour)**

**Goal:** Integrate this week's progress into your tutorial documents.

1.  **Update the Lab Manual:** Open `Drafts/wifi_cracking_lab_manual.md`.
2.  **Add New Sections:** Create new sections detailing the process:
    *   "Step 1: Sniffing Networks with the ESP32 Marauder" (add `wifi_scan_output.png`).
    *   "Step 2: Capturing a WPA2 Handshake".
    *   "Step 3: Cracking the Handshake with Aircrack-ng" (add `wpa2_crack_success.png`).
3.  **Write the Content:** Briefly explain each step and include the exact commands you used. This makes the tutorial reproducible.

**Daily Deliverable:** An updated, more comprehensive lab manual.
**GitHub Action:**
```bash
git add Drafts/wifi_cracking_lab_manual.md
git commit -m "docs: Update Wi-Fi cracking manual with Marauder steps"
```

---

### **Day 7: Final Review & Prep for AJ (≤ 30 mins)**

**Goal:** Summarize your work and prepare for your check-in.

1.  **Create a Weekly Summary:** Open `Deliverables/marauder_progress_update.md`. Add a new heading: `## Week of [Start Date] - Testing & POC`.
2.  **Write a Brief:** In a few bullet points, summarize what you accomplished:
    *   Verified Marauder connectivity and sniffing capabilities.
    *   Successfully captured a WPA2 handshake.
    *   Demonstrated a proof-of-concept crack using `aircrack-ng` on a sample file.
    *   Updated the `wifi_cracking_lab_manual.md` with new findings.
3.  **Push to GitHub:** Ensure all your commits from the week are pushed to your branch.

    ```bash
    git push origin WPA_2/3-v2
    ```

**Daily Deliverable:** A clean, updated progress file and a GitHub branch reflecting a week of consistent, verifiable work.
**GitHub Action:**
```bash
git add Deliverables/marauder_progress_update.md
git commit -m "docs: Add weekly summary for testing and POC milestone"
git push origin WPA_2/3-v2
