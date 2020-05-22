function initialize(regex) {
  if (!(regex instanceof RegExp)) {
    return getFlags(regex);
    /* 
          Note: I do not remember why I had this in here
          but I do not want to remove it in case I was
          smarter previous to now
          
          // } else if (regex[0] === "/") {
          //   return regex.split("").slice(1);
          // } else if (regex[regex.length - 1] === "/") {
          //   return regex.split("").slice(0, -1);
        */
  } else {
    let regexString = regex.toString();
    return getFlags(regexString);
  }
}
function getFlags(regexString) {
  if (regexString[0] === "/") {
    if (regexString[regexString.length - 1] === "/") {
      return { regexString: regexString.slice(1, -1), flags: null };
    } else {
      const endOfPattern = regexString.lastIndexOf("/");
      const flags = regexString.slice(endOfPattern + 1);
      regexString = regexString.slice(1, endOfPattern);
      return { regexString, flags };
    }
  } else {
    return { regexString, flags: null };
  }
}

module.exports = { initialize, getFlags };
