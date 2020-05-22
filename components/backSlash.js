const backSlash = {
  d: "'any digit between 0 and 9'",
  D: "'any non-digit'",
  w:
    "'any letter between a and z or any letter between A and Z or any digit between 0 and 9 or an underscore'",
  W:
    "'any character that is not between a and z or between A and Z or between 0 and 9 and not an underscore'",
  s: "'any space, tab, or line break'",
  S: "'anything that is not a space or a tab or a line break'",
  t: "'a horizontal tab'",
  r: "'a carriage return'",
  n: "'a linefeed'",
  v: "'a vertical tab'",
  f: "'a form-feed'",
  "0": "'null'",
  b: "'a word character not followed by another word character'",
  B: "'a word character followed by another word character'",
  "+": "the '+' symbol",
  "\\": "the '\\' symbol",
  "[": "the '[' symbol",
  "*": "the '*' symbol",
  "(": "the '(' symbol",
  ")": "the ')' symbol",
  "?": "the '?' symbol",
  $: "the '$' symbol",
  "|": "the '|' symbol",
  ".": "the '.' symbol",
};

/*  TODO:  
    Understand the Unicode specifications
    in order to add the Unicode-specific character classes
*/

function parseBackslash(character) {
  return backSlash[character];
}

module.exports = { backSlash, parseBackslash };
