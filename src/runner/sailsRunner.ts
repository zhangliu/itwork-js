import * as path from 'path';
import * as fs from 'fs';
import { execSync } from '../libs/exec';
import { mVscode } from '../libs/mVscode';
import * as commonTemplate from '../libs/code/templates/common';
import * as sControllerTemplate from '../libs/code/templates/sailsController';

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
    code = sControllerTemplate.genCode(funcName, params, mVscode.documentText, mVscode.languageId);
  } else {
    code = commonTemplate.genCode(funcName, params, mVscode.documentText, mVscode.languageId);
  }
  fs.writeFileSync(destFile, code);
  return destFile;
};

const genBootFile = (codeFile: string) => {
  const code = `
    ${mVscode.isTs ? 'require(\'ts-node/register\')' : ''}
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
  const file = `${mVscode.rootPath}/.iw.boot.js`;
  fs.writeFileSync(file, code);
  return file;
};

export {
  run
};