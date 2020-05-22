const InvalidRegularExpression = require("./InvalidRegularExpression.js");

function handleQuantifiers(regex, index) {
  switch (regex[index]) {
    case "*":
      return [" zero or more times", index];
    case "+":
      return [" one or more times", index];
    case "?":
      return [" zero or one time", index];
    case "{":
      // if the character after { is not a number
      if (isNaN(regex[index + 1])) {
        return ["", index + 1];
      } else {
        switch (regex[index + 2]) {
          case "}":
            // e.g. {3}
            return [` ${regex[index + 1]} times`, index + 2];
          case ",":
            // e.g. {3,}
            if (regex[index + 3] === "}") {
              return [` at least ${regex[index + 1]} times`, index + 3];
            } else if (!isNaN(regex[index + 3]) && regex[index + 4] === "}") {
              // e.g. {3,5}
              if (regex[index + 1] < regex[index + 3]) {
                return [
                  ` between ${regex[index + 1]} and ${regex[index + 3]} times`,
                  index + 4,
                ];
              } else {
                // Invalid regular expression
                return [
                  new InvalidRegularExpression(
                    `Invalid regular expression, {${regex[index + 1]}, ${
                      regex[index + 3]
                    }}.  You cannot define a range where the lower range (${
                      regex[index + 1]
                    }) is greater than higher range (${regex[index + 3]})`
                  ),
                ];
              }
            }
          default:
            return ["", index + 2];
        }
      }
    default:
      // If there is no quantifier
      // we need to return the previous index
      // because the index will be incremented
      // before being checked
      return ["", index - 1];
  }
}

module.exports = handleQuantifiers;
