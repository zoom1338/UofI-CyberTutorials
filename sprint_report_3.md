# Sprint 3 Report (10/12/25 - 11/04/2025)

## What's New (User Facing)
 * Final Mobile App Security tutorial part 1
 * Feature 2 or Bug Fix 2
 * Feature n or Bug Fix n

## Work Summary (Developer Facing)
Provide a one paragraph synposis of what your team accomplished this sprint. Don't repeat the "What's New" list of features. Instead, help the instructor understand how you went about the work described there, any barriers you overcame, and any significant learnings for your team.

A Mobile Security Tutorial is completed using MobSf and Frida, utilizing the  OWASP Uncrackable_1 Apk, and being tested for reproducability and demo videos for each portion of the tutorial. Scope has grown to include Java decompilation and native code decompilation of andriod applications including tutorial on JADX and Radare2 to be using on OWASP Uncrackable_3. 

## Unfinished Work
If applicable, explain the work you did not finish in this sprint. For issues/user stories in the current sprint that have not been closed, (a) any progress toward completion of the issues has been clearly tracked (by checking the checkboxes of  acceptance criteria), (b) a comment has been added to the issue to explain why the issue could not be completed (e.g., "we ran out of time" or "we did not anticipate it would be so much work"), and (c) the issue is added to a subsequent sprint, so that it can be addressed later.

Draft for tutorial on JADX and Radar2 using Owasp Uncrackable 2 is not complete, still owrking out some bugs and find work arounds for the tutorial to be easily reproducable. Issues related to this turoial are still open.

## Completed Issues/User Stories
Here are links to the issues that we completed in this sprint:

 * https://github.com/zoom1338/UofI-CyberTutorials/issues/28
 * https://github.com/zoom1338/UofI-CyberTutorials/issues/27
 * URL of issue n

 Reminders (Remove this section when you save the file):
  * Each issue should be assigned to a milestone
  * Each completed issue should be assigned to a pull request
  * Each completed pull request should include a link to a "Before and After" video
  * All team members who contributed to the issue should be assigned to it on GitHub
  * Each issue should be assigned story points using a label
  * Story points contribution of each team member should be indicated in a comment
 
 ## Incomplete Issues/User Stories
 Here are links to issues we worked on but did not complete in this sprint:
 
 * (https://github.com/zoom1338/UofI-CyberTutorials/issues/29) - need to finish tutorial and verify it is reproducable
 * (https://github.com/zoom1338/UofI-CyberTutorials/issues/30) - final tutorial polishing for Mobil App sec part 1 and 2
 * URL of issue n <<One sentence explanation of why issue was not completed>>
 
 Examples of explanations (Remove this section when you save the file):
  * "We ran into a complication we did not anticipate (explain briefly)." 
  * "We decided that the feature did not add sufficient value for us to work on it in this sprint (explain briefly)."
  * "We could not reproduce the bug" (explain briefly).
  * "We did not get to this issue because..." (explain briefly)

## Code Files for Review
Please review the following code files, which were actively developed during this sprint, for quality:
 * MobileAppSecurity-Tutorial-Part1(https://github.com/zoom1338/UofI-CyberTutorials/blob/MobileAppSec/MobileAppSecurity/MobileAppSecurity-Mobsf-Frida/MobileAppSecurity-Tutorial-Part1.docx )
 * [Name of code file 2](https://github.com/your_repo/file_extension)
 * [Name of code file 3](https://github.com/your_repo/file_extension)
 
## Demo Video
Dynamic analysis using Frida: https://youtu.be/df1ZA2breQ8 



WPA 2/3 Sprint 3 report 
# Sprint 3 Report

**Sprint Dates:** 2025-10-18 to 2025-11-08

## Sprint Goal
The primary goal of Sprint 3 was to troubleshoot and resolve hardware issues with the ESP32 Marauder, document the process, and make progress on the overall project deliverables.

## Accomplishments
This sprint focused heavily on hands-on hardware troubleshooting and documentation. The following key tasks were completed:

*   **Marauder Troubleshooting Report (2025-10-21):** A comprehensive report was created to document the troubleshooting steps taken to identify and resolve issues with the ESP32 Marauder. This includes detailed descriptions of the problems encountered and the solutions that were implemented.
*   **Added Images for Troubleshooting Report:** Supporting images were added to the troubleshooting report to provide visual evidence of the issues and resolutions. This includes the `confirmed_sdCard_issue.jpg` image, which was a key finding during this sprint.
*   **Day 1-2 Marauder Troubleshooting Update:** A progress update was created to document the initial troubleshooting efforts for the ESP32 Marauder. This report details the steps taken during the first two days of troubleshooting and the findings from that work.
*   **Day 3 Project Progress Update:** A progress update was created to document the work completed on the third day of the sprint. This report details the continued progress on the project and any new findings or accomplishments.

## Challenges and Resolutions
The main challenge during this sprint was a persistent hardware issue with the ESP32 Marauder where the SD card was not being detected. This was a major blocker for the project. The root cause was eventually identified as a faulty connection on the board itself. The troubleshooting process was extensive and involved multiple steps before finding the issue:
*   **Replacing SD Cards:** Multiple known-good SD cards were tested to rule out a faulty card.
*   **Rewiring the Board:** The entire device was rewired multiple times to ensure all connections were correct and secure.
*   **Seeking Expert Advice:** Consulted with knowledgeable electricians to get a second opinion on the wiring and potential hardware faults.

After these steps, the issue was confirmed to be with the board's hardware. The plan is to solder the connections, which is expected to resolve the problem permanently.

## Deliverables
*   **Images:** All images related to the troubleshooting process are located in the `Deliverables/images` directory.
*   **Demo Video:** A short demo video of the build progress can be found here: https://youtube.com/shorts/ERxxiUBoubU?feature=share

## Sprint 3 Review
This sprint was successful in identifying the root cause of the hardware issues with the ESP32 Marauder, which was a major accomplishment after a lengthy troubleshooting process. The detailed documentation of these steps will be a valuable resource for the project moving forward. While the final fix (soldering) is pending, the project is now unblocked. The main area for improvement is to more quickly identify and resolve hardware issues to minimize their impact on the project timeline.

## Action Plan for Sprint 4
*   **Finalize ESP32 Marauder Setup:** Complete the final setup and configuration of the ESP32 Marauder to ensure it is fully functional for the project.
*   **Develop WPA2 Tutorial:** Begin development of the WPA2 tutorial, including creating the necessary documentation and code samples.
*   **Create WiFi Cracking Lab Manual:** Start creating the WiFi cracking lab manual, which will provide detailed instructions for setting up and using the lab environment.
*   **Prepare for Final Report:** Begin outlining and drafting the final project report to ensure it is completed on time.
