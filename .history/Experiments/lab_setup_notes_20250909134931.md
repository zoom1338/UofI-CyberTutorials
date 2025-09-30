# Wi-Fi Lab Setup Notes

## Network Configuration

Based on Sean's email, here are the details for the lab Wi-Fi network:

- **SSID:** `UofI_Cyber_Lab`
- **Password:** `gocyber!`
- **Router IP:** `192.168.1.1`
- **Caution:** Ensure the lab network is on its own VLAN and properly firewalled from the main university network.

## Kali Linux Software Checklist

The following software should be installed and verified on the Kali Linux instances:

- [ ] `aircrack-ng`
- [ ] `wireshark`
- [ ] `tshark`
- [ ] `hcxtools`
- [ ] `hashcat`

## Physical Setup Tasks

- **To Do:**
    - [ ] Position the access point in a central location.
    - [ ] Connect the access point to the designated VLAN port.
    - [ ] Power on the access point and verify the SSID is broadcasting.
    - [ ] Prepare two client devices with compatible wireless adapters.
- **Done:**
    - [x] Procure a dedicated Wi-Fi router/access point.
    - [x] Flash the router with DD-WRT/OpenWrt.
