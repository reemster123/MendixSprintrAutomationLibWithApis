const delay = require('./functions/delay');
const parseArgumentForIndex = require('./functions/parseArgumentForIndex');
const cmdArguments =  {
    appName: parseArgumentForIndex(2),
    branch: parseArgumentForIndex(3),
    revision: parseArgumentForIndex(4),
    environment: parseArgumentForIndex(5)
}

main = async () => {
    try {
        const app = await require('./functions/retrieveApp')(cmdArguments.appName);
        const packageId = await require('./functions/buildPackage')(cmdArguments, app);
        await delay(3000);
        await require('./functions/transportPackage')(cmdArguments, app, packageId);
        await delay(3000);
        await require('./functions/restartApp')(cmdArguments, app);
    } catch(err) {
        console.log('something went wrong in main: '+err);
    }
}

main();