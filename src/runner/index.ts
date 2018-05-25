import * as moment from 'moment';

import { getEnv } from '../libs/env';
import * as commonRunner from './commonRunner';
import * as sailsRunner from './sailsRunner';

let lastFunc: string;

const run = async (vscode: any) => {
  const vsConsole = vscode.debug.activeDebugConsole;
  vsConsole.append(`${moment().format('HH:mm:ss')} => `);

  if (!canRun(vscode.window.activeTextEditor)) {
    return vsConsole.appendLine('itwork-js 无法运行改文件！');
  }

  lastFunc = getFuncName(vscode.window.activeTextEditor);
  if (!lastFunc) {
    return vsConsole.appendLine('itwork-js 未检测到需要执行的函数！');
  }

  let result: any = '';
  try {
    const env = getEnv(vscode.workspace.rootPath);
    if (!env) {
      result = commonRunner.run(vscode, lastFunc);
    }
    if (/^sails@.*/.test(env)) {
      result = await sailsRunner.run(vscode, lastFunc, env);
    }
  } catch (err) {
    return vsConsole.appendLine(err.message);
  }
  vsConsole.appendLine(result);
};

const canRun = (editor: any) => {
  if (!editor) {
    return false;
  }
  const languages = ['javascript', 'typescript'];
  const languageId = editor.document.languageId;
  const isIn = languages.indexOf(languageId) !== -1;
  const isIWfile = /\.iw$/.test(editor.document.fileName)
  if (!isIn || isIWfile) {
    return false;
  }
  return true;
};

const getFuncName = (editor: any) => {
  const selection = editor.selection;
  const func = editor.document.getText(selection);
  return func || lastFunc || '';
};

export {
  run
};