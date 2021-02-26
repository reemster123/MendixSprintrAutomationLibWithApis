const fs = require('fs').promises;
const exitWithMessage = require('./exitWithMessage');

module.exports = async(appName) => {
    try {
        console.log('Starting retieve app..')
        const appsString = await fs.readFile('./apps.json');
        if (appsString.length > 0) {
            const apps = JSON.parse(appsString);
            hasAppName = (name) => {
                return obj => obj.Name.toLowerCase() === name.toLowerCase();
            } 
            const app = apps.find(hasAppName(appName));
            console.log('app found for appname: '+app.AppId);
            return app;
        } else {
            console.log('No apps in apps.json. Run command "node setup.js" first.');
            console.log('exiting process...');
            process.exit();    
        }
    } catch(err) {
        exitWithMessage(err, 'Error retrieving app')
    }
} 