import * as path from 'path';
import * as fs from 'fs';
import { execSync } from '../libs/exec';
// import { mkdirsSync } from '../libs/file';
import { getParams } from '../libs/parses/jsParse';

const run = async (vscode: any, funcName: string, env: string) => {
  const file = genCodeFile(vscode, funcName);
  const rootPath = vscode.workspace.rootPath;
  const iwFile = genIWFile(rootPath, file);
  const cmd = `cd ${rootPath} && node ${iwFile}`;
  console.log('will run cmd: ', cmd);
  return await execSync(cmd);
};

const genCodeFile = (vscode: any, funcName: string) => {
  const fileName = vscode.window.activeTextEditor.document.fileName;
  const basename = path.basename(fileName);
  const isController = /Controller\.[^\.]+$/.test(basename);
  if (isController) {
    return genControllerFile(vscode, funcName, fileName);
  }
  throw new Error('itwork-js 无法处理改文件！');
};

const genControllerFile = (vscode: any, funcName: string, fileName: string) => {
  const destFile = path.dirname(fileName) + path.sep + '.iw' + path.extname(fileName);

  const code = vscode.window.activeTextEditor.document.getText();
  const params = getParams(code, funcName);
  const scriptType = vscode.window.activeTextEditor.document.languageId;
  fs.writeFileSync(destFile, genCallCode(code, funcName, params, scriptType));
  return destFile;
};

const genCallCode = (code: string, funcName: string, params: any[], scriptType: string) => {
  const isTs = scriptType === 'typescript';
  const resCode = `
  const res = {
    ok: v => v,
    wrap: async fn => await fn()
  }
  `;
  let resultCode = `return await ${funcName}(${params.join(',')})`;
  if (params.length === 0) {
    resultCode = `return await ${funcName} ({}, res)`;
  }
  if (params.length === 1) {
    resultCode = `return await ${funcName} (${params[0]}, res)`;
  }
  return `
  ${isTs ? 'declare var console: any;' : ''}
  ${isTs ? 'declare var process: any;' : ''}
  ${code}
  const iwResult = async () => {
    ${resCode}
    ${resultCode}
  }
  iwResult().then(console.log).then(process.exit).catch(err => {
    console.log(err)
    process.exit()
  })
  `;
};

const genIWFile = (rootPath: string, codeFile: string) => {
  const code = `
    require('ts-node/register');

    const sails = require('sails');

    sails.lift({
      hooks: { grunt: false },
      log: { level: 'warn' },
    }, (err) => {
      if (err) {
        return console.log(err);
      }
      require('${codeFile}');
    });
  `;
  const file = `${rootPath}/.iw.boot.js`;
  fs.writeFileSync(file, code);
  return file;
};

export {
  run
};