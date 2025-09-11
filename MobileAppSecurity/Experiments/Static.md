# Tutorial steps:
 * Steps performed using an ubuntu 24 linux VM
# Setting up Lab envirmoment
## Download MobSF
* Ubuntu default python3 isn’t compatible to clone the MobSF repo, as it requires Python3.12 or newer, using a Docker is highly recommended to save the trouble. Python3.12 isn’t backwards compatible and will break your VM kernel.
### Downloading docker
	User docker commands suitable to your Ubuntu version
	My commands used
	Sudo apt install docker.io
	Sudo usermod -aG docker #username
	Newgrp docker
	Docker ps 
	
### Running MobSF 
docker pull opensecurity/mobile-security-framework-mobsf:latest
docker run -it --rm -p 8000:8000 opensecurity/mobile-security-framework-mobsf:latest
once downloaded and running open a browser
https://128.0.0.1:8000

* default login is mobsf/mobsf

**I downloaded the test apk and ipa files fom mobsf github repo and uploaded to browser for static analysis
    Run MobSF
	Use test files pulled from git included in the cloned repo to perform analysis
	Downloaded the reports for the APK and IPA test file
