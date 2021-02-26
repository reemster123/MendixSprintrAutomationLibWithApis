module.exports = async (innertext, tagname, parent, page) => {
    const element = await page.evaluateHandle((name, tag, parent) => {
        let elements = parent.getElementsByTagName(tag);
        elements = Array.from(elements);
        elements.map(el => console.log(el.innerText));
        el = elements.find(element => {
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