/** ESSENTIAL FUNCTION **/

// FIND VALUES IN ARRAY IF FOUND RETURN TRUE
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

// SET NUMBER AND DIGIT
export const roundFixed = (value, decimals) => {
    return (!_.isEmpty(value) && value > 0 || value > 0.00) ? Number(Math.round(value + 'e' + decimals) + 'e-' + decimals) : 0 
}

// SET NUMBER TO MONEY FORMATTER
export const numberWithCommas = (x) => {
    if(x) {
        var parts = x.toString().split(".")
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",")
        return parts.join(".")
    } else {
        return 0
    }
}

export const largeNumberToShort = (num, limit = 8, decimals = 0) => {
    if(num && num.toString().length > limit)
        return `${roundFixed((num / 1000000), decimals)}Mb`
    else 
        return num              
}

// FOR GRID OF ANTDESIGN
// SORT COLUMNS BY ALPHABETH | DATE | AMOUNT
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