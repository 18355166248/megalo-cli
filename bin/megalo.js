const program = require('commander'); // 命令行工具
const chalk = require('chalk');
const semver = require('semver');
const didyoumean = require('didyoumean');
const requiredNodeVersion = require('../package.json').engines.node;

didyoumean.threshold = 0.6;

// 检测node版本是否符号要求范围
function checkNodeVersion(wanted, cliName) {
  if (!semver.satisfies(process.version, wanted)) {
    console.log(
      chalk.red(
        '你正在使用Node版本 ' +
          process.version +
          ', 但是这个' +
          cliName +
          '脚手架要求的Node版本是' +
          wanted +
          '\n请更新你的Node版本'
      )
    );
    process.exit(1);
  }
}

checkNodeVersion(requiredNodeVersion, 'megalo-cli');

program
  .version(require('../package.json').version, '-v, --version')
  .usage('<command> [options]');

// 初始化项目模板
program
  .command('create <template-name> <project-name>')
  .description('create a new project from a template')
  .action((templateName, projectName, cmd) => {
    // 输入参数校验
    validateArgsLen(process.argv.length, 5);
    require('../lib/template/easy-create')(
      lowercase(templateName),
      projectName
    );
  });

function validateArgsLen(argLen, MaxArgLength) {
  if (argLen > MaxArgLength) {
    console.log(chalk.yellow('\n 提示: 参数超过期望长度, 多余参数自动忽略'));
  }
}
