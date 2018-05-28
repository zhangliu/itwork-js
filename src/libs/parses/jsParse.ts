const babylon = require('@babel/parser');

const getParams = (code: any, funcName: string): any[] => {
  const plugins = ['typescript', 'objectRestSpread'];
  const codeTree = babylon.parse(code, { allowImportExportEverywhere: true, sourceType: 'module', plugins });
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
    return [];
  }
  obj.leadingComments.map((c: any) => {
    const paramsStr = trim(c.value);
    const subParams = trim(paramsStr.replace(/^(.*?=)(.*)$/, '$2'));
    params = params.concat(subParams);
  });
  return params;
};

export {
  getParams
};