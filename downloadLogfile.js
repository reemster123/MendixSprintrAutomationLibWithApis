const delay = require('./functions/delay');
const gv = require('./globalvariables.json');
const parseArgumentForIndex = require('./functions/parseArgumentForIndex');
const cmdArguments =  {
    appName: parseArgumentForIndex(2),
    date: parseArgumentForIndex(3),
    environment: parseArgumentForIndex(4)
}

main = async () => {
    try {
        
        const app = await require('./functions/retrieveApp')(cmdArguments.appName);
        const logfileInfo = await require('./functions/getLogfileInfo')(cmdArguments, app);
        const downloadType = await require('./enums/downloadType.json');
        const pathToFile = await require('./functions/downloadFile')(cmdArguments, logfileInfo.DownloadUrl, downloadType.log);
        console.log('Waiting for file to be downloaded...');
        await delay(10000);
        require('./functions/logFIleToConsole')(pathToFile);
        console.log('Done.');

    } catch(err) {
        console.log('something went wrong in main: '+err);
    }
}

main();