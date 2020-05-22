const handleQuantifiers = require("./quantifiers.js");
const { parseBackslash } = require("./backSlash.js");
const InvalidRegularExpression = require("./InvalidRegularExpression.js");

function handleGroup(regex, startingIndex) {
  let group = [];
  let i = startingIndex;
  let negated = false;
  if (regex[i] === "^") {
    negated = true;
    ++i;
  }
  while (regex[i] !== "]") {
    if (regex[i] === "-") {
      group[group.length - 1] = `"any of ${group[group.length - 1]} through ${
        regex[++i]
      }"`;
    } else {
      if (regex[i] === "\\") {
        const escapedChar = parseBackslash(regex[i + 1]);
        if (escapedChar !== undefined) {
          group.push(escapedChar);
          i += 1;
        }
      }
      group.push(regex[i]);
    }
    i++;
  }
  let [quantifiers, index] = handleQuantifiers(regex, i + 1);
  if (quantifiers instanceof InvalidRegularExpression) {
    return [`${quantifiers.name}: ${quantifiers.message}`];
  }
  if (group.length > 0) {
    if (negated === true) {
      return [`'not any of "${group.join(" or ")}"'${quantifiers}`, index];
    }
    return [`'${group.join(`' or '`)}'${quantifiers}`, index];
  } else {
    return [quantifiers, index];
  }
}

module.exports = handleGroup;
