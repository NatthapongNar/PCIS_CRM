/** ESSENTIAL FUNCTION **/
export const in_array = (needle, haystack, argStrict) => {
    var key = '', strict = !!argStrict;
    if (strict) {
        for (key in haystack) {
            if (haystack[key] === needle) { return true }
        }
    } else {
        for (key in haystack) {
            if (haystack[key] == needle) { return true }
        }
    }
    return false
}

export const roundFixed = (value, decimals) => {
    return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);
}

export const compareByAlph = (a, b) => { 
    let aData = (!_.isEmpty(a)) ? a : ''
    let bData = (!_.isEmpty(b)) ? b : ''

    if (aData > bData) { return -1; } 
    if (aData < bData) { return 1; } 
    return 0; 
}

export const compareByDate = (a, b) => { 
    let aData = (!_.isEmpty(a)) ? a : '2015-01-01T00:00:00.000Z'
    let bData = (!_.isEmpty(b)) ? b : '2015-01-01T00:00:00.000Z'
    
    if (aData > bData) { return -1; } 
    if (aData < bData) { return 1; } 
    return 0; 
}

export const compareByAmount = (a, b) => { 
    let aData = (a && a > 0) ? a : 0.00
    let bData = (b && b > 0) ? b : 0.00

    if (aData > bData) { return -1; } 
    if (aData < bData) { return 1; } 
    return 0; 
}