const vscode = require("vscode");
const parseRegex = require("./index.js");

/**
 * @param {vscode.ExtensionContext} context
 */

function activate(context) {
  console.log('Congratuations, the extension "parse_regex" is now active');

  let disposable = vscode.commands.registerCommand(
    "extension.parseRegex",
    () => {
      // Get active text editor
      let editor = vscode.window.activeTextEditor;

      if (editor) {
        let document = editor.document;
        // Get position of selected text
        let selection = editor.selection;
        // Get Line object of selection
        let regexLine = document.lineAt(selection.end.line);
        // Get the character position of the end of the line of selection
        let endOfLine = regexLine._text.length + 1;
        // Get highlighted regular expression
        let regex = document.getText(selection);
        // Parse regular expression
        let parsedRegex = parseRegex(regex);
        // Create a new position object to feed to insert function
        let lineEnd = new vscode.Position(selection.end.line, endOfLine);
        editor.edit((editBuilder) => {
          // Insert line comment at the end of the line of the selection
          editBuilder.insert(lineEnd, " // " + parsedRegex);
        });
      }
    }
  );
  context.subscriptions.push(disposable);
}

module.exports = { activate };
