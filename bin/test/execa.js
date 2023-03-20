const execa = require('execa');

// execa('ls').then((r) => console.log('展示  ', r.stdout));
// execa('mkdir', ['123.js']).then((r) => console.log(r.stdout));

// 实时打印出子进程的信息，并作为变量保存下来
const getStream = require('get-stream');

const stream = execa('echo', ['foo']).stdout;
stream.pipe(process.stdout); // 实时输出 foo

getStream(stream).then((value) => {
  console.log('child output:', value); // child output: foo
});
