const chalk = require('chalk');
const isGitUrl = require('is-git-url');
const { stopSpinner } = require('../utils/spinner');
const { log } = require('../utils/logger');
const {
  readTemplateJson,
  writeTemplateJson
} = require('../utils/readTemplateData');

async function addProjectTemplate(templateName, gitRepoAddress) {
  const templateGitRepoJson = readTemplateJson();
  // 判断 config下的json数据是否已经存在, 如果存在 退出添加
  if (templateGitRepoJson[templateName]) {
    console.log(`  ` + chalk.red(`template name ${templateName} has exists.`));
    return;
  }
  // 判断是不是正确的git地址
  if (!isGitUrl(gitRepoAddress)) {
    console.log(
      `${chalk.blue(gitRepoAddress)} ` + chalk.red(`不是一个正确的 SSH 地址`)
    );
    return;
  }
  // 转化为需要的正确格式
  const correctGitRepo = getRealGitRepo(gitRepoAddress);
  // 赋值并写入json文件
  templateGitRepoJson[templateName] = {
    github: gitRepoAddress,
    download: correctGitRepo
  };
  writeTemplateJson(templateGitRepoJson);
  stopSpinner();
  log();
  log(`🎉  Successfully add project template ${chalk.yellow(templateName)}.`);
  log();
}
/**
 * format
 * https => https://github.com/NuoHui/node_code_constructor.git
 * ssh => git@github.com:NuoHui/node_code_constructor.git
 * want => github:NuoHui/node_code_constructor
 */
function getRealGitRepo(gitRepo) {
  const sshRegExp = /^git@github.com:(.+)\/(.+).git$/;
  const httpsRegExp = /^https:\/\/github.com\/(.+)\/(.+).git$/;
  if (sshRegExp.test(gitRepo)) {
    // ssh
    const match = gitRepo.match(sshRegExp);
    return `github:${match[1]}/${match[2]}`;
  }
  if (httpsRegExp.test(gitRepo)) {
    // https
    const match = gitRepo.match(httpsRegExp);
    return `github:${match[1]}/${match[2]}`;
  }
}

module.exports = (...args) => {
  return addProjectTemplate(...args).catch((err) => {
    console.error(err);
    process.exit(1);
  });
};
