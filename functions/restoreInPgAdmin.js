//import variables
const gv = require('../globalvariables.json');
const cred = require('../credentials.json');
//import libraries
const puppeteer = require('puppeteer');
//import functions
const getElementForInnerText = require('./getElementForInnerText');
const getElementForInnerTextAndParent = require('./getElementForInnerTextAndParent');
const shutdown = require('./shutdown');
const exitWithMessage = require('./exitWithMessage');
const delay = require('./delay');

module.exports = async (cmdArguments, filePath) => {
    try {
        // setup page
        console.log('Setting up chromium page...');
        const browser = await puppeteer.launch({headless: !gv.showProcesInBrowser});
        const page = await browser.newPage();
        await page.setViewport({
            height: 800,
            width: 1200
        });
        
        await page.goto(cred.pgAdminUrl, {waitUntil: 'networkidle2'});
        await delay(gv.standardDelayAfterFunction);
        
        // login
        console.log('Logging into pgAdmin...');
        const menu = await page.waitForSelector('div[id="0"]');
        const serverSpan = await getElementForInnerTextAndParent('servers', 'span', menu, page);
        const serverButton = await page.evaluateHandle((span) => {return span.closest('.aciTreeEntry').querySelector('.aciTreeButton')}, serverSpan);
        await serverButton.click();
        await delay(gv.standardDelayAfterFunction);
        await page.waitForSelector('#password');
        await page.type('#password', cred.pgAdminPass);
        await delay(gv.standardDelayAfterFunction);
        await page.waitForSelector('button[class="ajs-button btn btn-primary fa fa-check pg-alertify-button"]');
        await page.click('button[class="ajs-button btn btn-primary fa fa-check pg-alertify-button"]');
        await delay(gv.standardDelayAfterPageLoad);

        // it could be that there are messageboxes open from older restore sessions, close those first
        const msgBxAvailable = await page.evaluate(() => {
            const msgBox = document.querySelector('.ajs-message.ajs-bg-bgprocess.ajs-visible');
            if (msgBox !== null) {
                console.log('Msgbox= '+msgBox);
                return true;
            } else {
                console.info('no msgBox found...')
                return false;
            } 
        });

        if (msgBxAvailable) {
            await page.evaluate(()=>{
                let arr = document.querySelectorAll('.ajs-message.ajs-bg-bgprocess.ajs-visible');
                console.log('msgBoxList= '+arr);
                arr = Array.from(arr);
                arr.map(el => el.querySelector('.pg-bg-close').click());
            });
            console.log('Closed all older messageboxes...');
        } else {
            console.log('No older messageboxes open...');
        }

        await delay(gv.standardDelayAfterFunction);

        // this objectMenuItem can also be retrieved by id= mnu_obj
        const objectMenuItem = await getElementForInnerText('object ', 'a', page);
        await objectMenuItem.click();
        await delay(gv.standardDelayAfterFunction);
        const parentOfObjectMenuItem = await page.evaluateHandle((menuItem)=> menuItem.parentElement, objectMenuItem);
        let createMenuItem = await getElementForInnerTextAndParent('create', 'span', parentOfObjectMenuItem, page);
        await createMenuItem.hover();
        await delay(gv.standardDelayAfterFunction);

        const databaseMenuItem = await getElementForInnerTextAndParent('database...', 'span', parentOfObjectMenuItem, page);
        await databaseMenuItem.click();
        console.log('clicked');
        await delay(gv.standardDelayAfterFunction);
        
        // enter dbname field
        const createDbPopup = await page.waitForSelector('.wcFrame.wcWide.wcTall.wcFloating');
        const dbNameInput = await page.evaluateHandle((popup) => popup.querySelector('input[name="name"]'), createDbPopup); 
        
        const dbName = extractFileNameFromPath(cmdArguments.appName, filePath);
        await dbNameInput.type(dbName);
        await delay(gv.standardDelayAfterFunction);
        
        // click save
        const saveButton = await page.evaluateHandle((popup) => popup.querySelector('button[type="save"]'), createDbPopup); 
        await saveButton.click();
        console.log('Clicked save...');
        console.log('Database created... ');
        await delay(gv.standardDelayAfterPageLoad);
      
        const newDb = await getElementForInnerTextAndParent(dbName.toLowerCase(), 'span', menu, page);
        await newDb.click();
        console.log(dbName+' selected...');
        await delay(gv.standardDelayAfterFunction);

        // Open the restore popup for the selected DB
        const toolsMenuItem = await page.waitForSelector('#mnu_tools');
        await toolsMenuItem.click();
        await delay(gv.standardDelayAfterFunction);
        const restoreMenuItem = await page.waitForSelector('#restore_object');
        await restoreMenuItem.click();
        await delay(gv.standardDelayAfterFunction);
        console.log('Restore popup opened...');

        // fill in the fields on the restore popup
        const restorePopup = await page.waitForSelector('.ajs-dialog.pg-el-container');
        console.log('Restore popup found...');
        const filenameInput = await page.evaluateHandle((popup) => popup.querySelector('input[name="file"]'), restorePopup )
        console.log('Filename input found...');
        await filenameInput.type(filePath);
        console.log('typed filename: '+filePath);
        await delay(gv.standardDelayAfterFunction);
 
        const roleDropdown = await page.evaluateHandle((popup) => popup.querySelector('span[title="role"]'), restorePopup);
        await roleDropdown.click();
        console.log('Clicked on roleDropdown...');
        await delay(gv.standardDelayAfterFunction);

        console.log('found rolename dropdown...');
        await delay(gv.standardDelayAfterFunction);

        const searchResultsUl = await page.waitForSelector('.select2-results__options');
        const selectedRole = await getElementForInnerTextAndParent(gv.pgRoleName, 'span', searchResultsUl,  page);
        await selectedRole.click();
        console.log('clicked rolename in list...');
        await delay(gv.standardDelayAfterFunction);

        // click save
        const restoreButton = await page.evaluateHandle((popup) => popup.querySelector('.ajs-button.btn.btn-primary.fa.fa-upload.pg-alertify-button'), restorePopup); 
        await restoreButton.click();
        console.log('clicked "Restore"...');
        await delay(gv.standardDelayAfterPageLoad);
        
        // wait for restore to finish (when the message != "Started" || "Running..."") and log message.
        console.log('Waiting for restore to be completed...');
        await page.waitForFunction(
            '(document.querySelector(".ajs-message.ajs-bg-bgprocess.ajs-visible").querySelector(".pg-bg-status-text").innerText != "Running...") && (document.querySelector(".ajs-message.ajs-bg-bgprocess.ajs-visible").querySelector(".pg-bg-status-text").innerText != "Started")'
            , {timeout: gv.longProcesTimeout});
        const msgContent = await page.evaluate(() => document.querySelector(".ajs-message.ajs-bg-bgprocess.ajs-visible").querySelector(".pg-bg-status-text").innerText);
        console.log('Restore finished with message: "'+msgContent+'"');
        console.log('Copy this databasename: '+dbName);

        shutdown(page, browser);
        


    } catch (err) {
        exitWithMessage(err, 'Error in restoreInPagAdmin');
    }





}

extractFileNameFromPath = (appName, path) => {
    const firstPart = path.split('.')[0];
    const index = firstPart.indexOf(appName);
    return firstPart.substring(index);

}