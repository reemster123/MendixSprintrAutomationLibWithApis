const gv = require('../globalvariables.json');
const cred = require('../credentials.json');
const got = require('got');
const exitWithMessage = require('./exitWithMessage');
const delay = require('./delay');

module.exports = async (projectId, envId, snapId) => {
    try {
        console.log('Starting getArchiveInfo call...');
        const url = gv.backups_url+projectId+'/environments/'+envId+'/snapshots/'+snapId+'/archives'; 
        const archiveId = await getArchiveId(url);
        const archiveUrl = await waitForArchiveUrl(url, archiveId);
        return {
            "url": archiveUrl,
            "id": archiveId
        }

    } catch (err){
        exitWithMessage(err, 'Error in getDownloadUrl');
    }
} 

getArchiveId = async (url) => {
    try {
        console.log('getting archives_id...');
            const response = await got.post(url+'?data_type=database_only', {
            headers: {
                "Content-Type": "application/json",
                "Mendix-Username": cred.mendix_username,
                "Mendix-ApiKey":  cred.api_key
            }
        });
        const archiveId = JSON.parse(response.body).archive_id;
        console.log('ArchiveId found: '+archiveId);
        return archiveId;
    } catch (err){
        exitWithMessage(err, 'Error in getArchiveId');
    }
}

waitForArchiveUrl = async(url, archiveId) => {
    try {
        let backup = {};
        do {
            console.log('checking status...');
            await delay(10000);
            const {body} = await got.get(url+'/'+archiveId, { 
                headers: {
                    "Mendix-Username": cred.mendix_username,
                    "Mendix-ApiKey": cred.api_key,
            }});
            backup = JSON.parse(body);
            console.log('after loop status: '+backup.state);
        } while (backup.state !== 'failed' && backup.state !== 'completed');
        if (backup.state === 'failed') {
            console.log('exiting process...');
            process.exit();
        } else {
            console.log('archiveUrl found: '+backup.url);
            return backup.url;
        }
    } catch (err) {
        exitWithMessage(err, 'error in waitForEndStatus');
    } 
}

getDownload = async (downloadUrl) => {
    await got(downloadUrl);

}