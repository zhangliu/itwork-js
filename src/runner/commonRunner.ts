import * as fs from 'fs';
import * as path from 'path';
import { parse } from '../libs/parses/jsParse';
const { execSync } = require('child_process');
import { mVscode } from '../libs/mVscode';

const run = (funcName: string) => {
  const file = genFile(funcName);
  return execSync(`node ${file}`);
};

const genFile = (funcName: string) => {
  const fileName = mVscode.fileName;
  const destFile = path.dirname(fileName) + path.sep + '.iw' + path.extname(fileName);
  const code = mVscode.documentText;

  const funcInfo = parse(code, funcName);
  mVscode.log(`解析出函数名：${funcInfo.funcName}，参数：${funcInfo.params}`);
  fs.writeFileSync(destFile, genCallCode(code, funcInfo.funcName, funcInfo.params));
  return destFile;
};

const genCallCode = (code: string, funcName: string, params: any[]) => {
  return `
    ${code}
    const iwResult = async () => await ${funcName}(${params.join(',')})
    iwResult().then(console.log)
  `;
};

export {
  run
};