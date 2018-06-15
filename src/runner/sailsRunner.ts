import * as path from 'path';
import * as fs from 'fs';
import { execSync } from '../libs/exec';
import { mVscode } from '../libs/mVscode';
import * as commonTpl from '../libs/code/templates/sails/commonTpl';
import * as controllerTpl from '../libs/code/templates/sails/controllerTpl';
import * as bootTpl from '../libs/code/templates/sails/bootTpl';

const run = async (funcName: string, params: any[]) => {
  const file = genCodeFile(funcName, params);
  const bootFile = genBootFile(file);
  const cmd = `cd ${mVscode.rootPath} && node ${bootFile}`;
  console.log('will run cmd: ', cmd);
  return await execSync(cmd);
};

const genCodeFile = (funcName: string, params: any[]) => {
  const fileName = mVscode.fileName;
  const basename = path.basename(mVscode.fileName);
  const destFile = path.dirname(fileName) + path.sep + '.iw' + path.extname(fileName);

  const isController = /Controller\.[^\.]+$/.test(basename);
  let code: string;
  if (isController) {
    code = controllerTpl.genCode(funcName, params, mVscode.documentText, mVscode.isTs);
  } else {
    code = commonTpl.genCode(funcName, params, mVscode.documentText, mVscode.isTs);
  }
  fs.writeFileSync(destFile, code);
  return destFile;
};

const genBootFile = (codeFile: string) => {
  const code = bootTpl.genCode(codeFile, mVscode.isTs);
  const file = `${mVscode.rootPath}/.iw.boot.js`;
  fs.writeFileSync(file, code);
  return file;
};

export {
  run
};