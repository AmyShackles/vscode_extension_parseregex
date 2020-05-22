const InvalidRegularExpression = require("./InvalidRegularExpression.js");

function anchors(regex) {
  let valid;
  if (regex[regex.length - 1] === "$" && regex[0] === "^") {
    try {
      regex = regex.slice(1, -1);
      valid = areAnchorsValid(regex);
      return `to the start and end of the line`;
    } catch (error) {
      return error;
    }
  } else if (regex[regex.length - 1] === "$") {
    try {
      regex = regex.slice(0, -1);
      valid = areAnchorsValid(regex);
      return `to the end of the line`;
    } catch (error) {
      return error;
    }
  } else if (regex[0] === "^") {
    try {
      regex = regex.slice(1);
      valid = areAnchorsValid(regex);
      return `to the start of the line`;
    } catch (error) {
      return error;
    }
  } else {
    if (regex.includes("$") || regex.includes("^")) {
      try {
        valid = areAnchorsValid(regex);
        return;
      } catch (error) {
        return error;
      }
    }
  }
}

function areAnchorsValid(regex) {
  let errorMessage = [];
  /*
    A regular expression is invalid if ^ appears as the last character
    or if $ appears as the first character if there are other characters
  */
  if (regex.length > 1) {
    if (regex[0] === "$" && regex[regex.length - 1] === "^") {
      errorMessage.push(
        "Regular expressions cannot start with an end of string anchor ($) and cannot end with a start of string anchor (^)."
      );
    } else if (regex[regex.length - 1] === "^") {
      errorMessage.push(
        "Regular expressions cannot end with a start of string anchor (^)."
      );
    } else if (regex[0] === "$") {
      errorMessage.push(
        "Regular expressions cannot start with an end of string anchor ($)."
      );
    }
  }
  // $ and ^ are still valid if they are escaped
  // or if they appear in a character set
  let occurenceMap = indexesOf(regex, /\^|\$|\[|\]/g);
  const {
    "^": carats = [],
    $: dollars = [],
    "[": openBrackets = [],
    "]": closedBrackets = [],
  } = occurenceMap;
  /*
    We want to remove instances where the character has been escaped
    before we look for them in character sets
  */
  const unEscapedCarats = removeEscapedIndices(regex, carats);
  const unEscapedDollars = removeEscapedIndices(regex, dollars);
  /*
    We also have to ensure that the symbols for the start and end
    of a character set aren't escpaed before relying on them to
    check the validity of anchor symbols
  */
  const characterSetStart = removeEscapedIndices(regex, openBrackets);
  const characterSetEnd = removeEscapedIndices(regex, closedBrackets);

  /* 
    If the number of unescaped opening brackets is not equal
    to the number of unescaped closing brackets, 
    we have an invalid regular expression
  */
  if (characterSetStart.length !== characterSetEnd.length) {
    errorMessage.push(
      'The number of unescaped opening square brackets "[" is not equal to the number of unescaped closing square brackets "]", which makes this regular expression invalid.'
    );
  }

  /*
    If there are no character sets and there are unescaped
    carats or dollars, we know we have an invalid regex
  */
  if (characterSetStart.length === 0) {
    if (unEscapedCarats.length > 0) {
      errorMessage.push(
        "The ^ is a special character in regular expressions.  You either need to include it at the very beginning of the regular expression, inside of a character set (e.g, [^]), or escape it, (e.g., \\^)."
      );
    }
    if (unEscapedDollars.length > 0) {
      errorMessage.push(
        "The $ is a special character in regular expressions.  You either need to include it at the very end of the regular expression, inside of a character set (e.g., [$]), or escape it (e.g., \\$)."
      );
    }
  } else {
    let areCaratsValid = areAnchorsInCharacterSet(
      unEscapedCarats,
      characterSetStart,
      characterSetEnd
    );
    let areDollarsValid = areAnchorsInCharacterSet(
      unEscapedDollars,
      characterSetStart,
      characterSetEnd
    );
    if (areDollarsValid === false && areCaratsValid === false) {
      errorMessage.push(
        "The dollar sign ($) and the carat (^) are special character in a regular expression.  The dollar sign ($) can either be used at the end of a regular expression to match the end of the string or must be contained in a character set (e.g, [$]) or escaped (e.g. \\$).  The carat (^) can either be used at the beginning of a regular expression to match the start of the string or must be contained in a character set (e.g, [^]) or escaped (e.g. \\^)."
      );
    } else if (areDollarsValid === false) {
      errorMessage.push(
        "The dollar sign is a special character in a regular expression.  They can either be used at the end of a regular expression to match the end of the string or must be contained in a character set (e.g, [$]) or escaped (e.g. \\$)."
      );
    } else if (areCaratsValid === false) {
      errorMessage.push(
        "The carat (^) can either be used at the beginning of a regular expression to match the start of the string or must be contained in a character set (e.g, [^]) or escaped (e.g. \\^)."
      );
    }
  }
  if (errorMessage.length > 0) {
    throw new InvalidRegularExpression(errorMessage.join(" "));
  }
  return true;
}
function removeEscapedIndices(regex, indices) {
  return indices.filter((index) => !isItEscaped(regex, index));
}
function isItEscaped(regex, index) {
  if (regex[index - 1] === "\\") {
    return true;
  }
  return false;
}
function areAnchorsInCharacterSet(
  anchorIndices,
  characterSetStarts,
  characterSetEndings
) {
  let anchorIndex = 0;
  while (anchorIndex < anchorIndices.length) {
    let characterSetIndex = 0;
    /*
      Find the first index in the characterSet arrays where
      the anchor has a chance of residing
    */
    while (
      characterSetEndings[characterSetIndex] < anchorIndices[anchorIndex]
    ) {
      characterSetIndex++;
    }
    if (
      anchorIndices[anchorIndex] > characterSetStarts[characterSetIndex] &&
      characterSetEndings[characterSetIndex] > anchorIndices[anchorIndex]
    ) {
      anchorIndex++;
    } else {
      return false;
    }
  }
  /*
    If we get through the entire array without returning false,
    we know that all instances fall within a character set
    and are therefore valid
  */
  return true;
}

function indexesOf(string, regex) {
  var match,
    indexes = {};

  regex = new RegExp(regex);

  while ((match = regex.exec(string))) {
    if (!indexes[match[0]]) indexes[match[0]] = [];
    indexes[match[0]].push(match.index);
  }
  return indexes;
}

process.on("uncaughtException", (err) => {
  console.error("There was an uncaught error", err);
  process.exit(1); //mandatory (as per the Node.js docs)
});

module.exports = {
  anchors,
  areAnchorsValid,
  removeEscapedIndices,
  isItEscaped,
  areAnchorsInCharacterSet,
  indexesOf,
};
