const chalk = require('chalk');

const log = console.log;
const error = chalk.bold.red;
const warning = chalk.hex('#FFA500');

log(error('Error!'));
log(warning('Warning!'));

log(chalk.blue('Hello') + ' World' + chalk.red('!'));

log(chalk.blue.bgRed.bold('Hello world!'));
