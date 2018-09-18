import * as path from 'path';
import * as fs from 'fs';
import { mVscode } from '../libs/mVscode';
import * as commonTpl from '../libs/code/templates/react/commonTpl';
import * as bootTpl from '../libs/code/templates/react/bootTpl';

const run = (funcName: string, params: any[]) => {
  const file = genCodeFile(funcName, params);
  const bootFile = genBootFile(file);
  const cmd = `cd ${mVscode.rootPath} && node ${bootFile} && rm -rf ${file} ${bootFile}`;
  console.log('will run cmd: ', cmd);
  return mVscode.exec(cmd);
};

const genCodeFile = (funcName: string, params: any[]) => {
  const fileName = mVscode.fileName;
  const destFile = path.dirname(fileName) + path.sep + '.iw' + path.extname(fileName);

  const code: string = commonTpl.genCode(funcName, params, mVscode.documentText);
  fs.writeFileSync(destFile, code);
  return destFile;
};

const genBootFile = (codeFile: string) => {
  const code = bootTpl.genCode(codeFile);
  const file = `${mVscode.rootPath}/.iw.boot.js`;
  fs.writeFileSync(file, code);
  return file;
};

export {
  run
};