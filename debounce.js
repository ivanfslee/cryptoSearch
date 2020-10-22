const debounce = (func, delay = 1000) => {
    let timeoutID;
    return (...args) => {
        // If there is a setTimeout, then clear it, and
        // invoke another setTimeout on line 33
        if (timeoutID) {
            clearTimeout(timeoutID);
        }

        timeoutID = setTimeout(() => {
            func.apply(null, args);
        }, delay);
    };
};