const didyoumean = require('didyoumean');
const { Command } = require('commander');
const chalk = require('chalk');

// didyoumean.threshold = 0.4;
didyoumean.thresholdAbsolute = 30;
// didyoumean.caseSensitive = true;

var list = ['facebook', 'twitter', 'instagram', 'linkedin'];

const program = new Command();

program.argument('did <params>').action((params) => {
  console.log(chalk.red(params));
  console.log(didyoumean(params, list));
});

program.parse();
