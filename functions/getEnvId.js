const got = require('got');
const gv = require('../globalvariables.json');
const cred = require('../credentials.json');
const exitWithMessage = require('./exitWithMessage');


module.exports = async(AppId, envName) => {
    try {
        console.log('Starting getEnvId...');
        const response = await got(gv.build_url+AppId+'/environments/', {
            headers: {
                "Content-Type": "application/json",
                "Mendix-Username": cred.mendix_username,
                "Mendix-ApiKey":  cred.api_key
            }
        });
        const environments = JSON.parse(response.body);
        isEnvironmenType = (envName) => {
            return obj => obj.Mode.toLowerCase() === envName.toLowerCase();
        }  
        const envId = environments.find(isEnvironmenType(envName)).EnvironmentId;
        if (envId) {
            console.log('EnvironmentId found: '+envId);
            return envId;
        } else {
            console.log('No environmentId found for appname: '+AppId);
            console.log('exiting process...');
            process.exit();
        }

    } catch (err) {
        exitWithMessage(err, 'Error in getEnvId');
    }

}