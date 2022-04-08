module.exports = async (innertext, tagname, parent, page) => {
    const element = await page.evaluateHandle((name, tag, parent) => {
        const elements = parent.getElementsByTagName(tag);
        const elementsArr = Array.from(elements);
        elementsArr.map(el => console.log(el.innerText));
        el = elementsArr.find(element => {
            if (element !== null){
                console.log(element);
                return element.innerText.toLowerCase().includes(name);
            }
            return false;
        });
        if (typeof el !== 'undefined') {
            return el;
        }
        return null;
    }, innertext, tagname, parent );
    return element;

}