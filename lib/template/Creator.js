const chalk = require('chalk');
const execa = require('execa'); // 一个child_process封装库
const EventEmitter = require('events');
const fs = require('fs-extra');
const { clearConsole } = require('../utils/clearConsole');
const { logWithSpinner, stopSpinner } = require('../utils/spinner');
const { log, warn, error } = require('../utils/logger');
const { hasGit, hasProjectGit } = require('../utils/env');
const fetchRemotePreset = require('../utils/loadRemotePreset');
const { readTemplateJson } = require('../utils/readTemplateData');

module.exports = class Creator extends EventEmitter {
  constructor(name, context) {
    super();
    this.name = name;
    this.context = process.env.EASY_CLI_CONTEXT = context; // 项目决定路径
  }

  async create(cliOptions = {}) {
    const { name, context } = this;
    const templateGitRepoJson = readTemplateJson();
    const gitRepoUrl = templateGitRepoJson[process.env.EASY_CLI_TEMPLATE_NAME];
    let tmpdir;
    await clearConsole(true);
    log(`✨ Creating project in ${chalk.yellow(context)}.`);
    try {
      stopSpinner();
      logWithSpinner(
        '⠋',
        'Download project template. This might take a while...'
      );
      tmpdir = await fetchRemotePreset(gitRepoUrl.download);
    } catch (e) {
      stopSpinner();
      error(`Failed fetching remote git repo ${chalk.cyan(gitRepoUrl)}:`);
      throw e;
    }
    // 拷贝到项目文件下
    try {
      fs.copySync(tmpdir, context);
    } catch (e) {
      return console.error(chalk.red.dim(`Error: ${e}`));
    }
    // git初始化
    const shouldInitGit = this.shouldInitGit();
    if (shouldInitGit) {
      stopSpinner();
      logWithSpinner('🗃', 'Initializing git repository...');
      this.emit('creation', { event: 'git-init' });
      // 执行git init
      await this.run('git init');
    }
    // commit init
    let gitCommitFailed = false;
    if (shouldInitGit) {
      await this.run('git add -A');
      try {
        await this.run('git', ['commit', '-m', 'init']);
      } catch (e) {
        gitCommitFailed = true;
      }
    }

    stopSpinner();
    log(`🎉  Successfully created project ${chalk.yellow(name)}.`);
    this.emit('creation', { event: 'done' });
    if (gitCommitFailed) {
      warn(
        'Skipped git commit due to missing username and email in git config.\n' +
          'You will need to perform the initial commit yourself.\n'
      );
    }
  }

  run(command, args) {
    if (!args) {
      [command, ...args] = command.split(/\s+/);
    }
    return execa(command, args, { cwd: this.context });
  }

  // 判断是否需要初始化git
  shouldInitGit() {
    if (!hasGit()) return false;
    return !hasProjectGit(this.context);
  }
};
