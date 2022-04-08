const fs = require('fs');
const exitWithMessage = require('./exitWithMessage');

/*
the file is stored to the downloads folder with name '[downloadType]_[Appname]_[Environment]_[Date]_v[VersionNr].[extention]
for a backup the name will be "backup_myapp_acceptance_2021-02-22_v1.backup"
for a logfile the name will be "log_myapp_acceptance_2021-02-22_v1.txt"
*/

module.exports = (cmdArgruments, pathToDownloads, downloadType) => {
 
    try { 
        console.log('Starting genetateBackupName');
        const filename = downloadType+'_'+cmdArgruments.appName+'_'+cmdArgruments.environment+'_'+cmdArgruments.date;
        const files = fs.readdirSync(pathToDownloads);
        containsFileName = (name) => { return file => file.includes(name) };
        const countFilesWithSameName = files.filter(containsFileName(filename)).length;
        let newFileName = filename+'_v'+(countFilesWithSameName+1);
        const downLoadTypeEnum = require('../enums/downloadType.json');
        if (downloadType === downLoadTypeEnum.backup) {
            newFileName+='.backup';
        } else if (downloadType === downLoadTypeEnum.log) {
            newFileName+='.txt';
        } else {
            console.log('downloadType '+'"'+downloadType+'"'+'does NOT match the available download types...');
            console.log('exiting process...');
            process.exit();
        }
        console.log('New file name: '+newFileName);
        return newFileName;
        
    } catch (err) {
        exitWithMessage(err, 'error in generateBackupName');

    }
}