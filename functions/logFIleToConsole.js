const fs = require('fs');
const exitWithMessage = require('./exitWithMessage');


module.exports = async (pathToFile) => {
    try {
        console.log('Starting logFileToConsole...')
        const file = fs.readFileSync(pathToFile, {encoding: 'utf8'});
        console.log(file);

    } catch (err) {
        exitWithMessage(err, 'Error in logFileToConsole');
    } 
} 
