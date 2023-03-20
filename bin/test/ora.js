const ora = require('ora'); // 美化终端交互
const chalk = require('chalk');
const { red } = require('chalk');

const spinner = ora({
  text: '加载中',
  prefixText: '前缀文本->',
  color: 'gray',
  hideCursor: false
});

spinner.start();

setTimeout(() => {
  spinner.color = 'yellow';
  spinner.text = '加载变色了';
}, 1000);

setTimeout(() => {
  // spinner.stop();
  // spinner.succeed(chalk.green('加载成功'));
  // spinner.fail(chalk.green('加载失败'));
  spinner.warn(chalk.green('加载警告'));
}, 2000);
