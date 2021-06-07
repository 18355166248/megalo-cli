const program = require('commander'); // 命令行工具
const chalk = require('chalk');
const semver = require('semver');

program.version('0.0.1', '-v --version').parse(process.argv);
