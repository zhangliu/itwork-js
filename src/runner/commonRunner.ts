import * as fs from 'fs';
import * as path from 'path';
const { execSync } = require('child_process');
import { mVscode } from '../libs/mVscode';
import * as commonTemplate from '../libs/code/templates/commonTpl';

const run = (funcName: string, params: any[]) => {
  const file = genFile(funcName, params);
  return mVscode.isTs ? execSync(`ts-node ${file}`) : execSync(`node ${file}`);
};

const genFile = (funcName: string, params: any[]) => {
  const fileName = mVscode.fileName;
  const destFile = path.dirname(fileName) + path.sep + '.iw' + path.extname(fileName);
  const code = commonTemplate.genCode(funcName, params, mVscode.documentText, mVscode.isTs);
  fs.writeFileSync(destFile, code);
  return destFile;
};

export {
  run
};