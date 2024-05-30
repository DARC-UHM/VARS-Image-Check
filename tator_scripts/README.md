# Tator Scripts

This folder contains various scripts related to Tator expeditions.

- `load_dropcam_fieldbook.py` loads information from the fieldbook XLSX to the DARC review server. This script should be run whenever a new expedition is uploaded to Tator.
- `populate_substrates.py` loads substrates from a local CSV file and populates them into all matching media clips in Tator. This script should be run after the substrate XSLX has been completely filled out.
- `populate_ctd.py` loads DO values from sensor CSV files on Dropbox into Tator. This script should be run after an expedition has been completely annotated.
- `load_video_start_times.py` loads video start times from the XML files on Dropbox into the corresponding media files in Tator (should no longer be necessary)

### load_dropcam_fieldbook.py

This script loads information (deployment names, location, depth, and bait type) from the dropcam fieldbook XLSX and saves it to the DARC review server. This information is then referenced on the external review pages and the final Tator summary tables.

This script can be run as soon as an expedition is uploaded into Tator, and should be run before sending out images for review so that the review images have location and depth information populated.

To run this script:

1) Download the fieldbook XLSX file from the Dropbox and save it locally on your computer.
   1) Note the name of the expedition's folder in Dropbox (e.g. DOEX0096_Palau). This name will be used as an argument in the script and saved in the database.
2) Find the section ID for the expedition on Tator. The section ID is the number that is displayed next to the expedition name when the expedition folder is selected on Tator ([example](img/tator-section-id.png)). This will also be used as an argument in the script and saved in the database.
3) Open a terminal window and activate the DARC virtual environment (`conda activate darc`).
4) `cd` into the folder that contains the scripts.
5) Run the command:
    ```
    python load_dropcam_fieldbook.py <SECTION ID> <EXPEDITION NAME> <PATH TO DROPCAM XLSX>
    ```
    Example:
    ```
    python load_dropcam_fieldbook.py 11922 DOEX0096_Palau /Users/darc/Downloads/PLW_dscm_fieldbook.xlsx
    ```
The script will print a status code and the response from the server.
   
### populate_substrates.py

This script loads information from the Substrates spreadsheet into Tator. This should be run after the Substrates sheet has been completely filled out.

The script expects the second row of the sheet to contain these exact headers: `deployment`, `FoV`, `Substrate (Hard/Soft)`, `primarySubstrate`, `secondarySubstrate`, `relief`, `bedforms`, and `Notes`.

A Tator API token is required to run this script. To get one, start the image review app like normal and select `Tator` from the VARS/Tator dropdown on the homepage. If you're logged in already, your Tator token will be printed in the terminal. If you're not logged in, log in and refresh the page. Add this token to the `.env` file at the root of this repository:

```
TATOR_TOKEN = '<TOKEN HERE>'
```

Note that each time you log into Tator via the image review app, the old token is invalidated, so you may have to upload the value in the `.env` periodically.

To run this script:

1) Download the Substrates sheet from the Annotation Log XLSX as a CSV and save it locally on your computer.
2) Find the project ID for the expedition on Tator. This is almost certainly `26`, but to double-check, open Tator and navigate to the project page (the main page that shows all the expeditions) and check the URL. The number immediately following "cloud.tator.io" is the project ID ([example](img/tator-project-id.png)).
3) Find the section ID for the expedition on Tator. The section ID is the number that is displayed next to the expedition name when the expedition folder is selected on Tator ([example](img/tator-section-id.png)).
4) Open a terminal window and activate the DARC virtual environment (`conda activate darc`).
4) `cd` into the folder that contains the scripts.
5) Run the command:
   ```
   python populate_substrates.py <PROJECT ID> <SECTION ID> "<PATH TO SUBSTRATES CSV>"
   ```
   Example:
   ```
   python populate_substrates.py 26 11922 "/Users/darc/Downloads/DOEX0096(Palau)_Annotation_Log - Substrates.csv"
   ```
The script will iterate over each deployment in the CSV and update all the media files in Tator with the substrate information. For each media that is updated, a server response is printed. This will take quite a while.

### populate_ctd.py

This script loads dissolved oxygen values (temperature and concentration) from sensor CSV files on Dropbox into Tator. This should be run after an expedition has been completely annotated.

This script currently does not rely on timestamps to sync CTD data with annotations, but instead uses the bottom times notes in Tator and the corresponding "leveling out" time in the sensor CSV. Because of this, each deployment's sensor file should be checked manually to ensure the script found the correct leveling out time (for PLW, it was correct on all deployments except for one where the camera hit bottom but then slid down a slope for a few minutes).

A Dropbox access token is required to run this script. To obtain one, navigate to https://www.dropbox.com/developers/apps and select `Create app`. After creating the app, you can generate an access token by selecting `Generate` under "Generated access token" from the app page. This token only lasts about 4 hours or so, so you may have to regenerate the access token a few times. Once you have your access token, add it and the Dropbox folder path to the `.env` at the root of the repository:

```
DROPBOX_ACCESS_TOKEN = '<TOKEN GOES HERE>'
DROPBOX_FOLDER_PATH = '/Pristine Seas Dropcam Data/DOEX0096_Palau'
```

A Tator token is also required to run this script, see above in the `populate_substrates.py` section.

To run the script:

1) Get the project/section IDs from Tator (see above in the `populate_substrates.py` section).
2) Open a terminal window and activate the DARC virtual environment (`conda activate darc`).
3) `cd` into the folder that contains the scripts.
4) Run the command:

   ```
   python populate_ctd.py <PROJECT ID> <SECTION ID> <DEPLOYMENT NAME>
   ```
   
   Example:

   ```
   python populate_ctd.py 26 11922 PLW_dscm_02
   ```
   
5) (Optional) Check the timestamp printed on the line `Sensor bottom data arrival time unix:` against the timestamp that you see the depths leveling out on bottom in the sensor CSV file. The depth at the printed timestamp should also approximately match the depth recorded for this deployment in the fieldbook. 

The script will go through each localization for the deployment and upload the matching DO values to Tator. For each localization that is updated, a server response is printed. 
