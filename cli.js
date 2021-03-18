#!/usr/bin/env node
'use strict'

const meow = require('meow');
const {queryRates, writeToExcel} = require('./index');

const commandLine = meow(`
    Usage:
        > rates <clientId> <opt|filename>
`);

if (commandLine.input.length == 0) {
    console.error('Required: Client Identifier');
    commandLine.showHelp(1);
}

var outputFile = "sample-output.xlsx";
if (commandLine.input.length == 2) {
    outputFile = commandLine.input[1];
    if (!outputFile.toLowerCase().endsWith('.xlsx')) {
        outputFile += ".xlsx";
    }
}

queryRates(commandLine.input[0])
    .then((data) => writeToExcel(data, outputFile))
    .catch(err => console.error(err))