
const delay = require('./functions/delay'); 
const exitWithMessage = require('./functions/exitWithMessage');
const parseArgumentForIndex = require('./functions/parseArgumentForIndex');
const cmdArguments =  {
    appName: parseArgumentForIndex(2),
    date: parseArgumentForIndex(3),
    environment: parseArgumentForIndex(4)
}

main = async () => {
    try {
        console.log('Starting restoreBackup...');
        const app = await require('./functions/retrieveApp')(cmdArguments.appName);
        const envId = await require('./functions/getEnvId')(app.AppId, cmdArguments.environment);
        const backups = await require('./functions/getBackups')(app.ProjectId, envId);
        const snapshotId = returnSnapshotId(cmdArguments.date, backups);
        const archiveInfo = await require('./functions/getArchiveInfo')(app.ProjectId, envId, snapshotId);
        const downloadType = require('./enums/downloadType.json');
        const pathToFile = await require('./functions/downloadFile')(cmdArguments, archiveInfo.url, downloadType.backup);
        await require('./functions/waitForFinishedDownload')(app.ProjectId, envId, snapshotId, archiveInfo.id);
        await require('./functions/restoreInPgAdmin')(cmdArguments, pathToFile);
    } catch (err) {
        exitWithMessage(err, 'Error in Main');

    }
}

main();

returnSnapshotId = (date, backupArr) => {
    try {
        console.log('Searching for backup in retrieved backups...')
        matchesDate = (date) => {
            return (obj => obj.finished_at.includes(date));
        } 
        const backupForDate = backupArr.find(matchesDate(date));
        if (backupForDate) {
            console.log('snapshotId found: '+backupForDate.snapshot_id)
            return backupForDate.snapshot_id;
        } else {
            console.log('No backup found for this date: '+date);
            console.log('exiting process...');
            process.exit();
        }
    } catch (err) {
        exitWithMessage(err, 'Error in returnSnapshotId')
    }
}


