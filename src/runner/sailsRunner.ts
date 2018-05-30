import * as path from 'path';
import * as fs from 'fs';
import { execSync } from '../libs/exec';
import { mVscode } from '../libs/mVscode';
import { parse } from '../libs/parses/jsParse';

const run = async (funcName: string, env: string) => {
  const file = genCodeFile(funcName);
  const bootFile = genBootFile(file);
  const cmd = `cd ${mVscode.rootPath} && node ${bootFile}`;
  console.log('will run cmd: ', cmd);
  return await execSync(cmd);
};

const genCodeFile = (funcName: string) => {
  const basename = path.basename(mVscode.fileName);
  const isController = /Controller\.[^\.]+$/.test(basename);
  if (isController) {
    return genControllerFile(funcName);
  }
  throw new Error('itwork-js 无法处理改文件！');
};

const genControllerFile = (funcName: string) => {
  const fileName = mVscode.fileName;
  const destFile = path.dirname(fileName) + path.sep + '.iw' + path.extname(fileName);

  const code = mVscode.documentText;
  const funcInfo = parse(code, funcName);
  mVscode.log(`解析出函数名：${funcInfo.funcName}，参数：${funcInfo.params}`);
  fs.writeFileSync(destFile, genCallCode(code, funcInfo.funcName, funcInfo.params));
  return destFile;
};

const genCallCode = (code: string, funcName: string, params: any[]) => {
  const isTs = mVscode.languageId === 'typescript';
  const resCode = `
  const res = {
    ok: v => v,
    send: v => v,
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

const genBootFile = (codeFile: string) => {
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
  const file = `${mVscode.rootPath}/.iw.boot.js`;
  fs.writeFileSync(file, code);
  return file;
};

export {
  run
};