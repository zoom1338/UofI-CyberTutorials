  
# apk app is from
https://github.com/payatu/diva-android.git

* Will update as folder into Repo, as dependacies are outdated or obsolete

# install Frida
Frida requires python 3 and Node.js 
link for node.js install with which is also used in the static tutorial:
https://nodejs.org/en/download


commands for frida:

pip install frida-tools # CLI tools
pip install frida       # Python bindings
npm install frida       # Node.js bindings


check version of you have installed and download the apprioriate frida server binary
this will be pushed the andriod device in android studio.
link for server binary: https://github.com/frida/frida/releases
used in tutorial:frida-server-17.3.0-android-x86_64 

# Install Andriod studio and make device
link: https://developer.android.com/studio

Follow the link and dowload Andriod studio this runs the device we will be emulating

Start Andriod studio and navigate tot he device manager and create a new android device.
For this tutorial I made a Pixel 5 and used the default settings and truned the device on
the device needs to be running to install the server binary.

Open a terminal go to folder your the server binary is installed in and push the ile to the emulated device.
cmd used: 
&"C:\Users\isund\AppData\Local\Android\Sdk\platform-tools\ab.exe" push .\frida-server-17.3.0-android-x86_64 /data/local/tmp/frida-server
#verify file is installed
& "C:\Users\isund\AppData\Local\Android\Sdk\platform-tools\adb.exe" shell
ls -l /data/local/tmp/

#output should indicate read/write persmissions

run server executables 
cmd used: 
chmod 755 /data/local/tmp/frida-server
ls -l /data/local/tmp/frida-server

* If a frida server is already running on device you need to kill the process
ps -A | grep frida
kill <PID>

run the server
cmd used: 
/data/local/tmp/frida-server &

# running APP on emulated device


# verfify Connection to PC
In new terminal window on PC
frida-ps -U
* will list the processes running on the andriod device

# Frida command exploration
frida-trace

