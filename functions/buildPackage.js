const gv = require('../globalvariables.json');
const cred = require('../credentials.json');
const got = require('got');
const delay = require('./delay');
const exitWithMessage = require('./exitWithMessage');

module.exports = async(cmdArguments, app) => {
    const url = gv.build_url+app.AppId+'/packages/';
    const packageId = await postPackage(cmdArguments, url);
    await waitForBuildSucces(url, packageId);
    return packageId;
}

// post a call to start a proces on the mendix server to build a deployment package. 
postPackage = async(cmdArguments, url) => {
    try {
        console.log('url: '+url); 
        const branch = generateBranchPath(cmdArguments.branch);
        const response = await got.post(url, {
            headers: {
                "Accept":"*/*",
                "Mendix-Username": cred.mendix_username,
                "Mendix-ApiKey": cred.api_key,
            },
            json: {
                "Branch" : branch,
                "Revision" :  cmdArguments.revision ,
                "Version" :  "1.0.2" ,
                "Description" :  "by automation api"
            }
        });
        const pkgId = JSON.parse(response.body).PackageId;
        console.log('packageId: '+pkgId);
        return pkgId;
    } catch (err) {
        exitWithMessage(err, 'error posting deployment packag');
    } 
}

// wait for an endstatus of the proces, this would be 'Failed' or 'Succeeded'
waitForBuildSucces = async(url, packageId) => {
    try {
        let status = '';
        do {
            await delay(10000);
            console.log('checking status...')
            const {body} = await got.get(url+packageId, { 
                headers: {
                    "Mendix-Username": cred.mendix_username,
                    "Mendix-ApiKey": cred.api_key,
            }});
            status = JSON.parse(body).Status;
            console.log('after loop status: '+status);
        } while (status !== 'Failed' && status !== 'Succeeded');
        console.log('Done Looping...');
        if (status === 'Failed') {
            console.log('exiting process...');
            process.exit();
        };
    } catch (err) {
        exitWithMessage(err, 'error waiting for status');
    } 
}

// according to Mendix: if mainline then the path should be 'trunk' else the dir should be 'branches/[branchename]'
generateBranchPath = (branch) => {
    if (branch.toLowerCase() === 'main line') {
        return 'trunk';
    } else {
        return 'branches/'+branch;
    }
}