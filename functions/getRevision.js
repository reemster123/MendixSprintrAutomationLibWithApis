const got = require('got');
const gv = require('../globalvariables.json');
const cred = require('../credentials.json');
const exitWithMessage = require('./exitWithMessage');


module.exports = async(appId, brancheName) => {
    try {
        const url = gv.build_url+appId+'/branches';
        const response = await got(url, {
            headers: {
                "Accept": '*/*',
                "Mendix-Username": cred.mendix_username,
                "Mendix-ApiKey": cred.api_key
            }
        });
        const branches = JSON.parse(response.body);
        const branche = branches.find(obj => obj.DisplayName.toLowerCase() === brancheName.toLowerCase());
        console.log('Latest revision number: '+branche.LatestRevisionNumber);
        return branche.LatestRevisionNumber;
    } catch (err) {
        exitWithMessage(err, 'Error in getRevison ');
    }
}



