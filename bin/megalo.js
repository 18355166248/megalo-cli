#!/usr/bin/env node

const program = require('commander'); // 命令行工具
const chalk = require('chalk');
const semver = require('semver');
const didyoumean = require('didyoumean');
const requiredNodeVersion = require('../package.json').engines.node;
const enhanceErrorMessages = require('../lib/utils/enhanceErrorMessages');

didyoumean.threshold = 0.6;

// 检测node版本是否符号要求范围
function checkNodeVersion(wanted, cliName) {
  if (!semver.satisfies(process.version, wanted)) {
    console.log(
      chalk.red(
        '你正在使用 Node 版本 ' +
          process.version +
          ', 但是' +
          cliName +
          '脚手架要求的 Node 版本是' +
          wanted +
          '\n请更新你的 Node 版本'
      )
    );
    process.exit(1);
  }
}

checkNodeVersion(requiredNodeVersion, 'megalo-cli');

// 修改帮助信息的首行提示
program
  .version(require('../package.json').version, '-v, --version,')
  .usage('<command> [options]');

// 初始化项目模板
program
  .command('create <template-name> <project-name>')
  .description('create a new project from a template')
  .action((templateName, projectName, cmd) => {
    // 输入参数校验
    validateArgsLen(process.argv.length, 5);
    require('../lib/template/easy-create')(
      lowerCase(templateName),
      projectName
    );
  });

// 添加一个项目模板
program
  .command('add <template-name> <git-repo-address>')
  .description('add a project template')
  .action((templateName, gitRepoAddress, cmd) => {
    // 输入参数校验
    validateArgsLen(process.argv.length, 5);
    require('../lib/template/add-template')(templateName, gitRepoAddress);
  });

// 展示当前所有模板
program
  .command('list')
  .description('list all available project template')
  .action((cmd, options) => {
    validateArgsLen(process.argv.length, 4);
    require('../lib/template/list-template')();
  });

// 删除模板
program
  .command('delete <template-name>')
  .description('delete a project template')
  .action((templateName, cmd) => {
    validateArgsLen(process.argv.length, 4);
    require('../lib/template/delete-template')(templateName);
  });

// 处理非法命令
program.arguments('<command>').action((cmd) => {
  console.log();
  program.outputHelp();
  console.log();
  console.log(
    chalk.red(`不理解的命令 | Unknown command =>> ${chalk.yellow(cmd)}`)
  );
  console.log();
  suggestCommands(cmd);
});

// 重写 commander 丢失参数事件 当参数缺失会触发Command.missingArgument事件
enhanceErrorMessages('missingArgument', (argsName) => {
  return `Missing required argument ${chalk.yellow(`<${argsName}>`)}`;
});

// 把命令行参数提供给 commander 解析
program.parse(process.argv);

// 输入megalo显示帮助信息 ( 当不输入或者输入 --help 显示帮助新乡 )
if (!process.argv.slice(2).length || process.argv.slice(2)[0] === '--help') {
  program.outputHelp();
}

function validateArgsLen(argLen, MaxArgLength) {
  if (argLen > MaxArgLength) {
    console.log(chalk.yellow('\n 提示: 参数超过期望长度, 多余参数自动忽略'));
  }
}

// 对非法命令解析 给出相近的提示
function suggestCommands(cmd) {
  const avaliableCommands = program.commands.map((item) => item._name);
  // 简易只能匹配用户命令
  const suggestion = didyoumean(cmd, avaliableCommands);

  if (suggestion) {
    console.log(
      chalk.red(
        `可能你想输入的是 | Did you mean =>> ${chalk.green(suggestion)} ?`
      )
    );
    console.log();
  }
}

function lowerCase(name) {
  return name.toLocaleLowerCase();
}
