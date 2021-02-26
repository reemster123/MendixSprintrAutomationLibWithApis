const gv = require('../globalvariables.json');
const cred = require('../credentials.json');
const got = require('got');
const exitWithMessage = require('./exitWithMessage');

module.exports = async(cmdArguments, app, packageId) => {
    try {
        console.log('Starting transportpackage call...');
        const url = gv.build_url+app.AppId+'/environments/'+cmdArguments.environment+'/transport';
        console.log('url: '+ url);
        await got.post(url, {
            headers: {
                "Content-Type": "application/json",
                "Mendix-Username": cred.mendix_username,
                "Mendix-ApiKey":  cred.api_key
            },
            json: {
                "PackageId": packageId
            }
        });
        console.log('Transport done.');
    } catch (err) {
        exitWithMessage(err, 'Error transporting package');   
    }
}