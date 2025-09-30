# WPA2 Cracking Wordlist Plan

## Necessity of a Wordlist

WPA2-PSK (Pre-Shared Key) security relies on a secret passphrase. When a client device connects to a WPA2-protected network, a 4-way handshake occurs. This handshake can be captured and used in an offline cracking attempt to discover the passphrase.

The cracking process involves hashing candidate passphrases from a wordlist using the same algorithm as the router and comparing the result to the captured handshake data. A match reveals the network passphrase. The effectiveness of this attack is therefore entirely dependent on the quality and completeness of the wordlist used. A weak or common passphrase will be found quickly if it is present in the wordlist.

## Candidate Wordlist Sources

Here are some potential sources for wordlists to be used in the tutorial:

1.  **rockyou.txt**: A classic, well-known wordlist containing over 14 million passwords leaked from a 2009 data breach. It is a good starting point and effective against common passwords.
2.  **SecLists**: A comprehensive collection of multiple types of lists used during security assessments, including a large variety of password lists. This provides more extensive and targeted options.
3.  **Custom Small Test Lists**: For demonstration purposes, a small, custom-built wordlist can be created. This allows the tutorial to guarantee a quick success and demonstrate the cracking process without the time and computational overhead of a large list.

## Approval Checklist

Before proceeding with the use of any specific wordlists in the tutorial, approval is required.

- [ ] Mentor/Client approval for `rockyou.txt`.
- [ ] Mentor/Client approval for using a list from `SecLists`.
- [ ] Mentor/Client approval for the creation and use of a custom test list.
