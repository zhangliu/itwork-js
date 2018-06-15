import * as fs from 'fs';
import * as path from 'path';
import { mVscode } from '../libs/mVscode';
import * as commonTemplate from '../libs/code/templates/commonTpl';

const run = async (funcName: string, params: any[]) => {
  const file = genFile(funcName, params);
  const cmd = `cd ${mVscode.rootPath} && ${mVscode.isTs ? 'ts-node' : 'node'} ${file}`;
  return mVscode.exec(cmd);
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