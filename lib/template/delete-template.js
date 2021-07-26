const chalk = require('chalk');
const inquirer = require('inquirer');
const { stopSpinner } = require('../utils/spinner');
const { log } = require('../utils/logger');
const {
  readTemplateJson,
  writeTemplateJson
} = require('../utils/readTemplateData');

async function deleteTemplateName(templateName) {
  const templateGitReopJson = readTemplateJson();

  if (!templateGitReopJson[templateName]) {
    console.log(
      ` ` + chalk.red(`template name ${templateName} has not exits.`)
    );
    return;
  }

  const { ok } = await inquirer.prompt([
    {
      name: 'ok',
      type: 'confirm',
      message: `Make sure you want to delete template name ${templateName}?`
    }
  ]);

  if (!ok) return;

  delete templateGitReopJson[templateName];
  writeTemplateJson(templateGitReopJson);
  stopSpinner();
  log();
  log(
    `🎉  Successfully delete project template ${chalk.yellow(templateName)}.`
  );
  log();
}

module.exports = (templateName) => {
  return deleteTemplateName(templateName).catch((err) => {
    log(err);
    process.exit(1);
  });
};
