*** READ ME FILE ***

This is a libarary created for Mendix developers in order to automate some developer processes on the mendix SprintrEnvironment. 

This library consists of the following functions:
- Deploy an application
- Download backup and restore in PgAdmin
- Download logfile


SETUP REQUIRED

step 1:

Install Node on your computer: https://nodejs.org/en/download/

step 2:

Open CMD (windows) or Terminal (Mac) and go to the folder of the library.
example 'cd desktop/programming/mendixdSprinrBot

step 3:

make the project ready for use with npm. Type: 'npm init'
hit enter multiple times (10) untill you see a dollar sign again $

step 4:

install dependancies:
- puppeteer: type: 'npm install puppeteer'. And hit enter. this is a prebuilt module the script uses to navigate throug a webpage. type 'npm install puppeteer' 
- downloads-folder: type: 'npm install downloads-folder'. And hit enter. This gets the local downloads folder on your computer (so it can locate the downloaded logfiles from sprintr).
- got: type 'npm install got'. And hit enter. We use this to handle requests to the mendix API.


step 5:

In the rootfolder of this project create a file called 'credentials.json' and copy-paste the following json into that file:
{
    "api_key": "yourMendixApiKey",
    "mendix_username": "yourMendixUsername (email)",
    "pgAdminUrl": "http://[IP-localhost]:[port]/?key=[key]",
    "pgAdminPass": "yourPgAdminPass"
}

yourMendixApiKey = you can create one via these steps: https://docs.mendix.com/developerportal/mendix-profile/#api-key 
Please note that you have to check the checkbox for api rights on the security/nodepermissions page of your app in the sprintr environment. 
[IP-localhost] = most of the time 127.0.0.1, but you can find this number by launching pgAdmin in the webbrowser and clicking on the url.
[port] = launch pgAdmin in the webbrowser, click on the url. Some numbers will appear in the url on the place where [port] stands in the example above. 
[key] = launch pgAdmin, enter password. Then go to cookies in your browser for this page. Copy the value for PGADMIN_INT_KEY

step 6

Navigate to root folder of this library via commandline,type 'node setup.js' and hit enter. 
This wil download all the AppId's for your account and save them in apps.json.



SETUP DONE! YOU CAN NOW RUN 3 DIFFERENT COMMANDS:


deployApp:

You can run the deployboyApp.js from the commandline from the directory where the file is located. 
The file uses two extra parameters [appname] and [branchename] so the command will look like this:

Format: (..)/MendixSprintrAutomationLibrary$ node deployApp.js [appname] [branchename] [revision] [environment]
Example: (..)/MendixSprintrAutomationLibrary$ node deployApp.js myapp My,branche,name 120 acceptance

Note that the appname nor branchename can have spaces inbetween, else those separate words of the branche or appname will be interpreted as separate parameters. 
So instead of a ' ' you have to type a ',' So 'my branche name' needs to be typed as 'my,branche,name'.
Also note that branchename is CASE SENSITIVE! for some reason mendix has built that in their api
Also note that the deploy version will allways be set to 1.1.1 (else we had to add an extra commandline paramter, this
can be updated in comming releases if nessecary). 


downloadLogfile:

Run the downloadLogfile.js from the commandline from the directory where the file is located. 
The file uses two extra parameters [appname] and [date] (formatted 'YYYY-MM-DD'), so the command will look like this:

Format: (..)/MendixSprintrAutomationLibrary$ node downloadLogfile.js [appname] [date] [environment]
Example: (..)/MendixSprintrAutomationLibrary$ node downloadLogfile.js myapp 2021-02-22 acceptance


restorebackuptopgAdmin:

run the restorebackuptopgAdmin.js from the commandline from the directory where the file is located (root). 
The file uses two extra parameters [appname] and [date] (formatted 'YYYY-MM-DD'), so the command will look like this:

Format: (..)/MendixSprintrAutomationLibrary$ node restorebackuptopgadmin.js [appname] [date] [environment]
Example (..)/MendixSprintrAutomationLibrary$ node restorebackuptopgadmin.js myapp 2021-02-22 acceptance


have fun!





