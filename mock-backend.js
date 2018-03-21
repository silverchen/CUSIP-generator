let CHECK_DIGITS;

function generateCUSIP(bloombergTicket) {
    if (bloombergTicket == null || bloombergTicket == undefined || bloombergTicket.length == 0) 
        throw "Invalid bloomberg ticket."

    // construct ticket prefix and expiration month
    var i = 0, result = "", yearIndex = bloombergTicket.length;
    while(i<yearIndex) {
        if (bloombergTicket.charAt(i) == ' ' && i <= 3) {
            yearIndex = Math.min(i + 2, yearIndex);
            i++;
            continue;
        } else if (!isNaN(bloombergTicket.charAt(i))) {
            yearIndex = Math.min(i, yearIndex);
            break;
        }
        
        result = result.concat(bloombergTicket.charAt(i));
        i++;
    }

    // construct expiration year
    var suffix = bloombergTicket.substr(yearIndex).split(" ");
    var currentYear = new Date().getFullYear();
    var year = currentYear.toString().substr(0, currentYear.toString().length - suffix[0].length).concat(suffix[0]);

    // last digit of expiration year
    result = result.concat(year.charAt(year.length - 1));
    
    // expiration year to fill up the remaining space
    var len = result.length;
    for(var i = 0; i < 8 - len; i++) {
        if (i > year.length - 1) {
            result = result.concat(year.charAt(year.length - 1));
        } else {
            result = result.concat(year.charAt(i));
        }
    }

    // construct check digit
    var checkDigit = parseInt(generateCheckDigit(result));
    if (checkDigit != null) {
        result = result.concat(checkDigit);
    } else {
        throw "Invalid check digit."
    }

    return result;
}

function generateCheckDigit2(s) {
    var sum = 0, v = 0;

    for (var i = 0; i < s.length; i++) {
        if (!isNaN(s[i])) {
            v = s[i];
        } else {
            var p = getIndexInAlphabet(s[i]);

            if (p > -1) {
                v = p + 9;
            } else if (s[i] == '*') {
                v = 36;
            } else if (s[i] == '@') {
                v = 37;
            } else if (s[i] == '#') {
                v = 38;
            }
        }

        if (v % 2 == 0) {
            v = v * 2;
        }

        sum = sum + parseInt(v / 10) + v % 10;
    }

    return (10 - (sum % 10)) % 10;
}

function getIndexInAlphabet (char) {
    const alphabet = 'abcdefghijklmnopqrstuvwxyz'
  
    if (Array.isArray(char)) {
      return chars.map(char => getIndexInAlphabet(char)[0]) // <-- call itself if the input's an array
    } else if (!char.toLowerCase) {
      throw new TypeError(`${char} is not string-like`)
    } else if (char.length !== 1) {
      throw new Error(`${char} is not a single character`)
    }
  
    const num = alphabet.indexOf(char.toLowerCase()) + 1
  
    if (num === 0) return -1;
  
    return [num]
}

function generateCheckDigit(s) {
    if (s == null || s == undefined || s.length == 0) 
        throw "Invalid CUSIP."

    if (!CHECK_DIGITS) {
        CHECK_DIGITS = {};
        initCheckDigitLookup();
    }

    var total = -1;
    for(var i = 0; i < s.length; i++) {
        total += parseInt(CHECK_DIGITS[s.charAt(i)][i%2]);
    }

    total += 1;

    return total > 0 ? (10 - (total % 10)) % 10 : null;
}

function initCheckDigitLookup() {
    var s = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ*@#";
    for (var i = 0; i < s.length; i++) {
        CHECK_DIGITS[s[i]] = [parseInt(i%10 + i/10), parseInt(2*i%10 + 2*i/10)];
    }
}