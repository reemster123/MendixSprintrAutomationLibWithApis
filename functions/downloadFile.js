const got = require('got');
const fs = require('fs');
const exitWithMessage = require('./exitWithMessage');
const generateFileName = require('./generateFileName');
const downloadFolder = require('downloads-folder');
const pathToDownloads = downloadFolder().split('\\').join('/');

module.exports = async (cmdArgruments, url, downloadType) => {
    try {
        console.log('Starting download...');
        const fileName = generateFileName(cmdArgruments, pathToDownloads, downloadType);
        const pathToFile = pathToDownloads +'/'+fileName;
        const fileWriterStream = fs.createWriteStream(pathToFile);
        const downloadStream = await got.stream(url);
        downloadStream.pipe(fileWriterStream); 
        console.log('pathToDownloads: '+pathToFile); 
        return pathToFile;
    } catch (err) {
        exitWithMessage(err, 'Error in downloadBackup');
    } 
} 

