    const {char_to_replace} = require('../globalvariables.json');

    // return lowercase string for the index of the argument. If the argument has a 'char_to_replace'
    // then it should be replaced with a space. 
    module.exports = (i) => {
        return process.argv[i].split(char_to_replace).join(' ');
    }