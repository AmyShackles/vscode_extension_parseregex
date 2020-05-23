# vscode extension parse regex

Have you ever looked at a regular expression and found it difficult to understand? Have you ever wished that the programmers before you (or you, yourself, in the past) had taken the time to write a comment describing what the regular expression was accomplished? Well, wish no more!

With the parseRegex extension, you can select a regular expression in your file, run the extension, and presto! code comment!

## Features

Describe specific features of your extension including screenshots of your extension in action. Image paths are relative to this README file.

For example if there is an image subfolder under your extension project workspace:

![Demo](./images/Demo.gif)

> Tip: Many popular extensions utilize animations. This is an excellent way to show off your extension! We recommend short, focused animations that are easy to follow.

## Requirements

This repo now makes use of git submodules!

In order to clone this project, you should use `git clone --recursive https://github.com/AmyShackles/vscode_extension_parseregex`

## Extension Settings

None as of yet, it's early days

## Known Issues

- There appears to be a bug where the \$ anchor is incorrectly added as a match item and treated as an anchor -- need to investigate
- Anything that's listed on [the original program's README](https://github.com/AmyShackles/parse_regex/blob/master/README.md) as still to do
