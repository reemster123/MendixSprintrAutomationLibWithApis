const got = require('got');
const gv = require('../globalvariables.json');
const cred = require('../credentials.json');
const exitWithMessage = require('./exitWithMessage');


module.exports = async(projectId, envId) => {
    try {
        //default offset 0 and limit 100 
        console.log('Starting getBackups...')
        const response = await got(gv.backups_url+projectId+'/environments/'+envId+'/snapshots', {
            headers: {
                "Content-Type": "application/json",
                "Mendix-Username": cred.mendix_username,
                "Mendix-ApiKey":  cred.api_key
            }
        });
        console.log('Backups foud...');
        const backups = JSON.parse(response.body).snapshots;
        return backups;

    } catch (err) {
        exitWithMessage(err, 'Error in getBackups');
    }

}