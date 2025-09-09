# Introduction to Wireshark: Lab Summary

## Goal of the Lab

The primary goal of this lab was to gain hands-on experience with Wireshark, a powerful network protocol analyzer. The exercises involved capturing, filtering, and inspecting network packets to understand the fundamentals of common internet protocols like TCP, HTTP, and DNS.

## Skills Learned

This lab covered the following essential Wireshark skills:

*   **Packet Capture:**
    *   Identifying and selecting the correct network interface for packet capture.
    *   Understanding link-layer header types, such as Ethernet II.
    *   Starting and stopping a live packet capture while generating traffic.
    *   _[Screenshot of interface selection]_

*   **IP Protocol Analysis:**
    *   Identifying the source (local machine) and destination (remote host) IP addresses in a conversation.
    *   Recognizing that web traffic primarily uses the HTTP protocol layered on top of TCP.
    *   _[Screenshot of IP packet details]_

*   **TCP Handshake Analysis:**
    *   Filtering for and identifying the three packets that form the TCP 3-way handshake (SYN, SYN-ACK, ACK).
    *   Inspecting TCP packet details to find key information like sequence numbers.
    *   _[Screenshot of TCP 3-way handshake]_

*   **HTTP GET Request Analysis:**
    *   Using display filters (`http.request.method == "GET"`) to isolate specific HTTP requests.
    *   Extracting key information from HTTP headers, including the requested `Host`, `path`, and `User-Agent` string.
    *   _[Screenshot of HTTP GET request]_

*   **HTTP Response Analysis:**
    *   Identifying HTTP status codes (e.g., `301 Moved Permanently`) to understand the server's response.
    *   Inspecting response headers like `Location` to follow redirects and `Content-Length` to determine if a payload is present.
    *   _[Screenshot of HTTP response]_

*   **DNS Query Analysis:**
    *   Using display filters (`dns`) to isolate the DNS query and response exchange.
    *   Understanding how a client requests the IP address for a domain name (A record) and how the DNS server responds with the answer.
    *   _[Screenshot of DNS query and response]_

## Relevance to WPA2/3 Project

The skills developed in this lab are directly transferable to analyzing WPA2/EAPOL handshakes. While the protocols are different, the methodology is the same:

1.  **Capture:** Just as we captured HTTP/TCP traffic, we will capture raw wireless frames containing the WPA2 handshake.
2.  **Filter:** Instead of filtering for `http` or `tcp`, we will use filters like `eapol` to isolate the 4-way handshake packets between the client and the access point.
3.  **Analyze:** We will inspect the individual EAPOL packets to verify the sequence, check message integrity, and understand the key exchange process.

Practicing with well-known protocols like HTTP, TCP, and DNS builds the foundational skills in packet analysis required to dissect more complex, security-focused protocols like WPA2. Understanding the request/response flow in this lab prepares us for analyzing the challenge/response nature of the WPA2 handshake.

---
*This summary is based on the "Assignment_1_Wire Shark .pdf" lab document.*
