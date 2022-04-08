const got = require('got');
const gv = require('../globalvariables.json');
const cred = require('../credentials.json');
const exitWithMessage = require('./exitWithMessage');
const delay = require('./delay');

module.exports = async(projectId, envId, snapId, archiveId) => {
    try {
        console.log('Starting waitForFinishedDownload...');
        let status = '';
        do {
            console.log('Getting status...');
            await delay(10000);
            const url = gv.backups_url+projectId+'/environments/'+envId+'/snapshots/'+snapId+'/archives/'+archiveId;
            console.log('url: '+url);
            const {body} = await got(url, {
                headers: {
                    "Content-Type": "application/json",
                    "Mendix-Username": cred.mendix_username,
                    "Mendix-ApiKey":  cred.api_key
                }
            });
            status = JSON.parse(body).state;
            console.log('Status: '+status);
        } while (status !== 'failed' && status !== 'completed');
        if (status === 'failed') {
            console.log('exiting process...');
            process.exit();
        } else {
            console.log('Download finished...');
            return true;
        }

    } catch (err) {
        exitWithMessage(err, 'Error in waitForFinishedDownload');

    }
 
}