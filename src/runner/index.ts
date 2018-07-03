import { getEnv } from '../libs/env';
import * as commonRunner from './commonRunner';
import * as sailsRunner from './sailsRunner';
import { mVscode } from '../libs/mVscode';
import { parse } from '../libs/parses/jsParse';

const run = async () => {
  if (!canRun()) {
    return mVscode.log('itwork-js 无法运行改文件！');
  }

  const code = mVscode.documentText;
  const funcInfo = parse(code, mVscode.selectedText || '');
  mVscode.log(`解析出函数名：${funcInfo.funcName}，参数：${funcInfo.params}`);

  try {
    const env = getEnv(mVscode.rootPath);
    if (!env) {
      return commonRunner.run(funcInfo.funcName, funcInfo.params);
    }

    mVscode.log(`解析出运行环境：${env}`);
    if (/^sails@.*/.test(env)) {
      return sailsRunner.run(funcInfo.funcName, funcInfo.params);
    }
    mVscode.log('无法在该环境下运行！');
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