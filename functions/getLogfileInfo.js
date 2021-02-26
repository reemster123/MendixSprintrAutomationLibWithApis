const gv = require('../globalvariables.json');
const cred = require('../credentials.json');
const got = require('got');
const exitWithMessage = require('./exitWithMessage');

module.exports = async (cmdArguments, app) => {
    try {
        console.log('Starting getLogfileInfo call...');
        const url = gv.build_url+app.AppId+'/environments/'+cmdArguments.environment+'/logs/'+cmdArguments.date;
        const response = await got(url, {
            headers: {
                "Content-Type": "application/json",
                "Mendix-Username": cred.mendix_username,
                "Mendix-ApiKey":  cred.api_key
            }
        });
        console.log('Logfile foud...');

        // returns object with attributes "Environment" (id), "Date" (unix timestamp), and "DownloadUrl"
        const logfileInfo =  JSON.parse(response.body); 
        console.log('Env: '+logfileInfo.Environment);
        console.log('Env: '+logfileInfo.Date);
        console.log('Env: '+logfileInfo.DownloadUrl);
        return logfileInfo;

    } catch (err){
        exitWithMessage(err, 'Error in getLogfileInfo');
    }
} 