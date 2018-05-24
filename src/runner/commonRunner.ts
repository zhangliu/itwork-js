import * as fs from 'fs';
import * as path from 'path';
const babylon = require('babylon');
const os = require('os');
const { execSync } = require('child_process');

let lastFunc: string;

const run = (vscode: any) => {
  const editor = vscode.window.activeTextEditor;
  let file;
  file = genFile(editor);
  return execSync(`node ${file}`);
};


const genFile = (editor: any) => {
  const fileName = editor.document.fileName;
  const destFile = path.dirname(fileName) + path.sep + path.basename(fileName) + '.iw' + path.extname(fileName);
  const code = editor.document.getText();
  fs.writeFileSync(destFile, code);

  const codeTree = babylon.parse(code);
  const callCode = genCallCode(editor, codeTree);
  fs.appendFileSync(destFile, os.EOL);
  fs.appendFileSync(destFile, `console.log(${callCode})`);
  return destFile;
};

const genCallCode = (editor: any, codeTree: any) => {
  const selection = editor.selection;
  const func = editor.document.getText(selection);
  lastFunc = func || lastFunc;

  const params = getParams(codeTree, lastFunc);
  return lastFunc ? `${lastFunc}(${params.join(',')})` : '';
};

const getParams = (codeTree: any, funcName: string): any[] => {
  for (const obj of codeTree.program.body) {
    if (obj.type === 'VariableDeclaration') {
      if (obj.declarations[0].id.name === funcName) {
        return getFuncParams(obj);
      }
    }
    if (obj.type === 'FunctionDeclaration') {
      if (obj.id.name === funcName) {
        return getFuncParams(obj);
      }
    }
  }
  return [];
};

const getFuncParams = (obj: any) => {
  let params: any[] = [];
  const trim = (str: string) => str.replace(/(^\s+)|(\s+$)/g, '');
  if (!Array.isArray(obj.leadingComments)) {
    throw new Error('【错误】没有可以解析的注释！');
  }
  obj.leadingComments.map((c: any) => {
    const paramsStr = trim(c.value);
    const subParams = trim(paramsStr.replace(/^(.*?=)(.*)$/, '$2'));
    params = params.concat(subParams);
  });
  return params;
};

export {
  run
};