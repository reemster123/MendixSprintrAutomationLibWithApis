// delay for miliseconds.

module.exports = (delaytime) => {
    return new Promise(function (resolve) {
        setTimeout(resolve, delaytime);
    });

}