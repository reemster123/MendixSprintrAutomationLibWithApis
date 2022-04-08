const gv = require('../globalvariables.json');
const cred = require('../credentials.json');
const delay = require('./delay');
const got = require('got');
const exitWithMessage = require('./exitWithMessage');

module.exports = async (cmdArguments, app) => {
    try {
        console.log('Restarting app...');
        const url = gv.build_url+app.AppId+'/environments/'+cmdArguments.environment;
        await stopEnv(url);
        await delay(5000);
        await startEnv(url);
    } catch (err){
        exitWithMessage(err, 'Error restarting application');
    }
} 

stopEnv = async (url) => {
    try {
        await got.post(url+'/stop', {
            headers: {
                "Content-Type": "application/json",
                "Mendix-Username": cred.mendix_username,
                "Mendix-ApiKey":  cred.api_key
            }
        });
        console.log('Application stopped succesfully...');
    }catch (err) {
        exitWithMessage(err, 'Error stopping the application');
    }
}

startEnv = async (url) => {
    try {
        const response = await got.post(url+'/start', {
            headers: {
                "Content-Type": "application/json",
                "Mendix-Username": cred.mendix_username,
                "Mendix-ApiKey":  cred.api_key
            },
            json: {
                "AutoSyncDb" :  true
            }
        });
        const jobID = JSON.parse(response.body).JobId;
        await delay(2000);
        await waitForStartSucces(url, jobID);
        console.log('Application started succesfully with jobID: '+jobID);
    }catch (err) {
        exitWithMessage(err, 'Error starting the application');
    }
}


waitForStartSucces = async(url, jobId) => {
    try {
        let status = '';
        do {
            await delay(10000);
            console.log('Checking status...')
            const {body} = await got.get(url+'/start/'+jobId, { 
                headers: {
                    "Content-Type": "application/json",
                    "Mendix-Username": cred.mendix_username,
                    "Mendix-ApiKey": cred.api_key,
            }});
            status = JSON.parse(body).Status;
            console.log('after loop status: '+status);
        } while (status === 'Starting');
        console.log('Done Looping...');
  
    } catch (err) {
        exitWithMessage(err, 'Error in waitForStartSucces');
    } 
}