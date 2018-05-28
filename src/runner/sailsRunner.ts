import * as path from 'path';
import * as fs from 'fs';
import { execSync } from '../libs/exec';
// import { mkdirsSync } from '../libs/file';
import { getParams } from '../libs/parses/jsParse';

const run = async (vscode: any, funcName: string, env: string) => {
  const file = genFile(vscode, funcName);
  const rootPath = vscode.workspace.rootPath;
  const cmd = `cd ${rootPath} && node ${rootPath}/node_modules/mocha/bin/mocha -t 20000 ${rootPath}/tests/lifecycle.test.js ${file}`;
  console.log('will run cmd: ', cmd);
  return await execSync(cmd);
};

const genFile = (vscode: any, funcName: string) => {
  const fileName = vscode.window.activeTextEditor.document.fileName;
  const basename = path.basename(fileName);
  const isController = /Controller\.[^\.]+$/.test(basename);
  if (isController) {
    return genControllerTestFile(vscode, funcName, fileName);
  }
  throw new Error('itwork-js 无法处理改文件！');
};

const genControllerTestFile = (vscode: any, funcName: string, fileName: string) => {
  const destFile = path.dirname(fileName) + path.sep + '.' + path.basename(fileName) + '.iw';

  const code = vscode.window.activeTextEditor.document.getText();
  const params = getParams(code, funcName);

  fs.writeFileSync(destFile, genTestCode(code, funcName, params));
  return destFile;
};

const genTestCode = (code: string, funcName: string, params: any[]) => {
  const resCode = `
  const res = {
    ok: v => console.log(v)
  }
  `;
  let resultCode = `await ${funcName}(${params.join(',')})`;
  if (params.length === 0) {
    resultCode = `iwResult = await ${funcName} ({}, res)`;
  }
  if (params.length === 1) {
    resultCode = `iwResult = await ${funcName} (${params[0]}, res)`;
  }
  return `describe('', () => {
    it('', async () => {
      ${code}
      let iwResult
      ${resCode}
      ${resultCode}
      console.log(iwResult)
    })
  })`;
};

export {
  run
};