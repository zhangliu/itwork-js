import * as moment from 'moment';

import { getEnv } from '../libs/env';
import * as commonRunner from './commonRunner';
import * as sailsRunner from './sailsRunner';

const run = (vscode: any) => {
  const vsConsole = vscode.debug.activeDebugConsole;
  vsConsole.append(`${moment().format('HH:mm:ss')} => `);

  if (!canRun(vscode.window.activeTextEditor)) {
    return vsConsole.appendLine('itwork-js 无法运行改文件！');
  }

  let result: string = '';
  try {
    const env = getEnv(vscode.workspace.rootPath);
    if (!env) {
      result = commonRunner.run(vscode);
    }
    if (/^sails@.*/.test(env)) {
      result = sailsRunner.run(vscode, env);
    }
  } catch (err) {
    return vsConsole.appendLine(err.message);
  }
  vsConsole.appendLine(result);
};

const canRun = (editor: any) => {
  const languages = ['javascript', 'typescript'];
  const languageId = editor.document.languageId;
  const isIn = languages.indexOf(languageId) !== -1;
  if (!editor || editor.document.isUntitled || !isIn) {
    return false;
  }
  return true;
};

export {
  run
};