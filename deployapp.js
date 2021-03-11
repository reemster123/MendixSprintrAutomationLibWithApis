const delay = require('./functions/delay');
const parseArgumentForIndex = require('./functions/parseArgumentForIndex');
const cmdArguments =  {
    appName: parseArgumentForIndex(2),
    branch: parseArgumentForIndex(3),
    environment: parseArgumentForIndex(4)
}

main = async () => {
    try {
        const app = await require('./functions/retrieveApp')(cmdArguments.appName);
        const revision = await require('./functions/getRevision')(app.AppId, cmdArguments.branch);
        const packageId = await require('./functions/buildPackage')(cmdArguments, revision, app);
        await delay(3000);
        await require('./functions/transportPackage')(cmdArguments, app, packageId);
        await delay(3000);
        await require('./functions/restartApp')(cmdArguments, app);
    } catch(err) {
        console.log('something went wrong in main: '+err);
    }
}

main();
