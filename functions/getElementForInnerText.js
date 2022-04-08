module.exports = async (innertext, tagname, page) => {
    const element = await page.evaluateHandle((name, tag) => {
        let elements = document.getElementsByTagName(tag);
        elements = Array.from(elements);
        el = elements.find(element => element.innerText.toLowerCase().includes(name));
        if (typeof el !== 'undefined') {
            return el;
        }
        return null;
    }, innertext, tagname );
    return element;

}