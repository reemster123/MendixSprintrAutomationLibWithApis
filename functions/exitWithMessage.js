// exit process and log why.
module.exports = (err, message) => {
    console.log(message+': '+err);
    console.log('exiting process...');
    process.exit();
}