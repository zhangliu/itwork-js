import * as vscode from 'vscode';
import * as moment from 'moment';

class MVscode {
  public log(str: string, line: boolean = true) {
    const vsConsole = vscode.debug.activeDebugConsole;
    const log = line ? vsConsole.appendLine : vsConsole.append;
    const pre = `${moment().format('HH:mm:ss')} => `;
    log.call(vsConsole, `${pre}${str}`);
  }

  public get selectedText() {
    const editor: any = vscode.window.activeTextEditor;
    const selection = editor.selection;
    return editor.document.getText(selection) || '';
  }

  public get currentEditor() {
    return vscode.window.activeTextEditor;
  }

  public get rootPath() {
    return vscode.workspace.rootPath || '';
  }

  public get languageId() {
    return this.currentEditor ? this.currentEditor.document.languageId : '';
  }

  public get fileName() {
    return this.currentEditor ? this.currentEditor.document.fileName : '';
  }

  public get documentText() {
    return this.currentEditor ? this.currentEditor.document.getText() : '';
  }

  public get cursorPosition() {
    return this.currentEditor ? this.currentEditor.selection.start : null;
  }

  public getText(startChar: number, startLine: number, endChar: number, endLine: number) {
    if (!this.currentEditor) {
      return '';
    }
    const range = new vscode.Range(startChar, startLine, endChar, endLine);
    return this.currentEditor.document.getText(range);
  }
}

const mVscode: MVscode = new MVscode();

export {
  mVscode
};