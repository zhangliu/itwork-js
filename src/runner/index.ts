import { getEnv } from '../libs/env';
import * as commonRunner from './commonRunner';
import * as sailsRunner from './sailsRunner';
import { mVscode } from '../libs/mVscode';
import { parse } from '../libs/parses/jsParse';

let lastFunc: string;

const run = async () => {
  if (!canRun()) {
    return mVscode.log('itwork-js 无法运行改文件！');
  }

  lastFunc = mVscode.selectedText || lastFunc;
  const code = mVscode.documentText;
  const funcInfo = parse(code, lastFunc);
  mVscode.log(`解析出函数名：${funcInfo.funcName}，参数：${funcInfo.params}`);

  try {
    let result: any = 'iw无法在该环境下运行！';
    const env = getEnv(mVscode.rootPath);
    if (!env) {
      result = commonRunner.run(funcInfo.funcName, funcInfo.params);
    }

    mVscode.log(`解析出运行环境：${env}`);
    if (/^sails@.*/.test(env)) {
      result = await sailsRunner.run(funcInfo.funcName, funcInfo.params);
    }
    mVscode.log(`运行结果：${result}`);
  } catch (err) {
    return mVscode.log(`运行发生错误：${err.message}`);
  }
};

const canRun = () => {
  const languages = ['javascript', 'typescript'];
  const isIn = languages.indexOf(mVscode.languageId) !== -1;
  const isIWfile = /^\.iw\..*$/.test(mVscode.baseFileName);
  if (!isIn || isIWfile) {
    return false;
  }
  return true;
};

export {
  run
};