import * as fs from 'fs';
import * as path from 'path';
import { getParams } from '../libs/parses/jsParse';
const { execSync } = require('child_process');

const run = (vscode: any, funcName: string) => {
  const editor = vscode.window.activeTextEditor;
  const file = genFile(editor, funcName);
  return execSync(`node ${file}`);
};

const genFile = (editor: any, funcName: string) => {
  const fileName = editor.document.fileName;
  const destFile = path.dirname(fileName) + path.sep + '.iw.' + path.basename(fileName);
  const code = editor.document.getText();

  const params = getParams(code, funcName);
  fs.writeFileSync(destFile, genCallCode(code, funcName, params));
  return destFile;
};

const genCallCode = (code: string, funcName: string, params: any[]) => {
  return `
    ${code}
    const iwResult = async () => await ${funcName}(${params.join(',')})
    iwResult().then(console.log)
  `;
};

export {
  run
};