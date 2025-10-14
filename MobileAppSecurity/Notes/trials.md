# Notes and methods

# 8/27/25
* Downloaded Docker on windows desktop for testing MobSF features and tools
* Searching for App files with android and iOs  for tutorial to use on MobSF

# 9/1/25
* downloaded MobSF on Kali linux VM the MobSF github includes app files for APK and IPA for testing
* started learning MOBSF and features for static analysis 
* VM crashed after downloading MobSF making a new one
* started drafting tutorial steps for static only

# 9/2/25
* got vm to work, 
* used test files on MobSF able, documented steps taken to trouble shoot issues for tutorial draft
* need to find more test files for tutorial challenges or use jsut APK and make challenges using IPA

# 9/9/25
* Used MobSF on APK and IPA test files proved from MobSF
* tried installing andriod emulator from Genymotion, doesn't work on VMs
* installed Frida on VM, need to find emulator for Frida
* Need to parse the IPA and APK reports from MobSF static analysis for tutorial

# 9/11/25
* tested andrid vm none seem to be even booting genymotion wont boot and account set up was a hassle
* getting andriond studio

# 9/13/25
* Still need to understand reports, since IPA doesnt have vulnerabilites use it for tutotrial and the APK for challenges
* Reimaged old laptop to Kali Linux with everything meta package, but hardware doesn't seem beefy enough

# 9/14/25
* Need to find alternatives for dynamic testing

# 9/16/25
* downloading Andriod studio on main laptop
* getting burp suite community edition
* need to look into frida for windows installation
* If issues still persist for Dynamic analysis on  my computer need to use CSG lab.
* perfomred static on windows with docker

# 9/17/25
* Blues stack doesn't work and is only for playing games on an andriod OS
* Frida was installed on windows
* trying to set up communication between adnriod studio and Burp suite for traffic monitoring

# 9/19/25
* Burp suite set up is IP contingent so set up and experiment completion need to be a single process
* Burp suite is becoming too mucha  hassle transtioned ot frida
* Got frida server running on emulated device
* debuging https://github.com/payatu/diva-android.git to work with andriod studio, outdated dependacies in code

# 9/23/25
* finished updateding files for gradle, pushing to emulated device
* need to do: upload update zip file of application to repo and open issue for the app's origin with the updated code.
* need to do: clean start to finish of dynamic analysis of emulator setup, frida installation and app installation and analysis.

# 9/29/25
* cleaning up steps taken to setting up lab environment for dynamic testing
* uploaded file for application

# 9/30/25
* Created issue with Android app repo for updating the code dependancies
    https://github.com/payatu/diva-android/issues/17
* need to do: clean up troubleshooting steps for dynamic analysis and create code injection files for tutorial
* need to do: draft static and dynamic tutorials, tool backgrounds, installation guides, troubleshooting appendix, 

# 10/13/25
* diva-andriod app wont stay open on emulated devicee long enough to produce a PID, need to find new app that can be used
* API-Demos is just a basic application with no features and barley even created long stays open and frida can be used for firda-discover and frida-trace commands. https://github.com/appium/android-apidemos/releases
* researching other apps, most apps created as vulnerable and open-source are extremly outdated or require access to the servers that arne't managed anymore.
* Allsecure is still managed but is an application of tutorials: https://github.com/t0thkr1s/allsafe-android, but cant get basic frida server connection established, can get the pids but cant trace functions

