module.exports = async (page, browser) => {
    console.log('Shutting down page...');
    await page.close();
    await browser.close();
}