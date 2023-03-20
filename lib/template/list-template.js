const chalk = require('chalk');
const { readTemplateJson } = require('../utils/readTemplateData');
const { stopSpinner } = require('../utils/spinner');
const { log } = require('../utils/logger');

async function listAllTemplate() {
  // 获取所有的模板数据
  const templateGitReopJson = readTemplateJson();
  log();
  for (const key in templateGitReopJson) {
    stopSpinner();
    log(
      `-> Template name ${chalk.green(key)}, Github address ${chalk.yellow(
        templateGitReopJson[key]['github']
      )}`
    );
    log();
  }

  if (!Object.keys(templateGitReopJson).length) {
    stopSpinner();
    log();
    log('💔 No any template.');
    log();
  }
}

module.exports = () => {
  return listAllTemplate().catch((err) => {
    console.log(err);
    process.exit(1);
  });
};
