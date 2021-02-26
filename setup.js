const gv = require('./globalvariables.json');
const cred = require('./credentials.json');
const fs = require('fs').promises;
const got = require('got');

main = async () => {
    try {
        getApps();
        
    } catch (err) {
        console.log('Something went wrong: '+err);
    } 
}

getApps = async () => {
    console.log('getting apps and setting them to apps.json...');
    const response = await got(gv.build_url,{
        method: 'GET',
        headers: {
            'Content-Type':'application/json', 
            'Mendix-Username':cred.mendix_username, 
            'Mendix-ApiKey':cred.api_key
    }});

    // responses' body is already stringyfied.
    await fs.writeFile('./apps.json', response.body);
    console.log('done setting apps.')


} 






main();


