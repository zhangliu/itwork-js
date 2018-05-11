import * as fs from 'fs';
import * as path from 'path';
const babylon = require('babylon');
const os = require('os');
const { exec } = require('child_process');

let lastFunc: string;

const run = (vscode: any) => {
  // TODO 获取当前环境

  // 获取当前文件
  const editor = vscode.window.activeTextEditor;
  const file = genFile(editor);
  if (file === null) {
    return;
  }



  // 在当前环境中执行当前文件
};

const genFile = (editor: any) => {
  if (!editor || editor.document.isUntitled || editor.document.languageId !== 'javascript') {
    return false;
  }
  const fileName = editor.document.fileName;
  const destFile = path.dirname(fileName) + path.sep + path.basename(fileName) + '.iw' + path.extname(fileName);
  const code = fs.readFileSync(fileName).toString();
  fs.writeFileSync(destFile, code);

  const codeTree = babylon.parse(code);
  const callCode = genCallCode(editor, codeTree);
  fs.appendFileSync(destFile, os.EOL);
  fs.appendFileSync(destFile, `console.log(${callCode})`);

  exec(`node ${destFile}`, (err: Error, stdout: string, stderr: string) => {
    if (err) {
      return console.error(err);
    }
    if (stdout) {
      console.log(stdout);
    }
    if (stderr) {
      console.warn(stderr);
    }
  });
};

const genCallCode = (editor: any, codeTree: any) => {
  const selection = editor.selection;
  const func = editor.document.getText(selection);
  lastFunc = func || lastFunc;

  const params = getParams(codeTree, lastFunc);
  return lastFunc ? `${lastFunc}(${params.join(',')})` : '';
};

const getParams = (codeTree: any, funcName: string): any[] => {
  // console.log(codeTree);
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
  obj.leadingComments.map((c: any) => {
    const arr = c.value.split(';').filter((s: any) => !!trim(s));
    const subParams = arr.map((a: any) => trim(a.split('=')[1]));
    params = params.concat(subParams);
  });
  return params;
};



export {
  run
};