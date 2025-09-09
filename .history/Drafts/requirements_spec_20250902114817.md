# Requirements Specification

## A) Stakeholders
- **Client (CERES):** Needs reproducible tutorials that can be shared in workshops and reused by future students.  
- **Mentor (Prof. Jillepalli):** Needs the project to demonstrate academic rigor with proper citations, technical accuracy, and reproducibility.  
- **Students (Dara & Isabella):** Need clear task division and accessible tools to build tutorials without advanced hardware at the start.  
- **CERES Community:** Needs entry-level, hands-on cybersecurity materials that lower the barrier to exploring WPA2/WPA3 security.

## B) Use Cases
- **WPA2 Tutorial:** Students follow the tutorial to capture and analyze a sample WPA2 handshake, then crack it with a wordlist.  
- **Wireless Mapping:** Use tools such as `airodump-ng` or `nmcli` to identify nearby networks, clients, and traffic patterns.  
- **Database Fingerprinting:** Use `sqlmap` against test databases on authorized networks to demonstrate post-access enumeration.

## C) Functional Requirements
- **Reproducible Tutorial:** Steps must produce consistent results across Kali VMs using sample `.cap` files.  
- **Step-by-step Commands:** All necessary CLI commands should be listed in sequence with no gaps.  
- **Screenshots:** Annotated screenshots should guide the user through key steps (e.g., Wireshark handshake view).  
- **GitHub Hosting:** Tutorials, notes, and sample files will be organized and hosted in the project repository.  
- **Ethics Notes:** Each tutorial must include a scope/ethics section clarifying authorized use only.

## D) Non-Functional Requirements
- **Usability:** Instructions should be understandable by students with basic Linux knowledge.  
- **Reproducibility:** Tutorials should run cleanly on a fresh Kali Linux 2025.2 VM.  
- **Portability (lab/Kali):** Tutorials must function in both RADICL labs and personal Kali VMs.  
- **Maintainability:** Repo should remain structured (Notes, Drafts, Experiments, FinalTutorial) for easy updates.  
- **Ethics/Security:** Tutorials must emphasize responsible use and best practices to avoid misuse.
