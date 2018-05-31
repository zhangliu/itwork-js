import * as fs from 'fs';
import * as path from 'path';
const { execSync } = require('child_process');
import { mVscode } from '../libs/mVscode';

const run = (funcName: string, params: any[]) => {
  const file = genFile(funcName, params);
  return execSync(`node ${file}`);
};

const genFile = (funcName: string, params: any[]) => {
  const fileName = mVscode.fileName;
  const destFile = path.dirname(fileName) + path.sep + '.iw' + path.extname(fileName);
  fs.writeFileSync(destFile, genCallCode(funcName, params));
  return destFile;
};

const genCallCode = (funcName: string, params: any[]) => {
  return `
    ${mVscode.documentText}
    const iwResult = async () => await ${funcName}(${params.join(',')})
    iwResult().then(console.log)
  `;
};

export {
  run
};