const InvalidRegularExpression = require("./InvalidRegularExpression.js");

function handleLooks(regex, index, prevPhrase) {
  let currentPhrase = [];
  let nextPhrase;
  let i = index + 1;
  while (regex[i] !== ")" && i < regex.length) {
    currentPhrase.push(regex[i]);
    i++;
  }
  if (regex[index] === "<") {
    nextPhrase = regex.slice(i + 1);
    currentPhrase.shift();
  }
  currentPhrase = currentPhrase ? currentPhrase.join("") : "";
  nextPhrase = nextPhrase ? nextPhrase : "";
  prevPhrase =
    prevPhrase.length > 1
      ? prevPhrase.join(" followed by ")
      : prevPhrase.join("");
  switch (regex[index]) {
    case "=": // positive lookahead
      return ` "${prevPhrase}" only if "${prevPhrase}" is followed by "${currentPhrase}"`;
    case "!": // negative lookahead
      return ` "${prevPhrase}" only if "${prevPhrase}" is not followed by "${currentPhrase}"`;
    case "<":
      // If there is no nextPhrase, invalid
      if (!nextPhrase) {
        return new InvalidRegularExpression(
          "You cannot use a lookbehind at the end of input"
        );
      }
      if (regex[index + 1] === "=") {
        // positive lookbehind
        return ` "${prevPhrase}" and "${nextPhrase}" only if "${nextPhrase}" follows "${currentPhrase}"`;
      } else if (regex[index + 1] === "!") {
        // negative lookbehind
        return ` "${nextPhrase}" only if "${nextPhrase}" does not follow "${currentPhrase}"`;
      }
    default:
      return "";
  }
}

module.exports = handleLooks;
