declare var require: any;

const babylon = require('@babel/parser');
const _ = require('lodash');

const parse = (code: any, funcName: string, line: number = 0): any => {
  const plugins = ['typescript', 'objectRestSpread'];
  const codeTree = babylon.parse(code, { allowImportExportEverywhere: true, sourceType: 'module', plugins });
  for (const node of codeTree.program.body) {
    const funcInfo = getFuncInfo(node, funcName);
    if (funcInfo) {
      return funcInfo;
    }
  }
  return { funcName: '', params: [] };
};

const getFuncInfo = (node: any, funcName: string) => {
  let result: any;
  switch (node.type) {
    case 'VariableDeclaration':
      if (node.declarations[0].id.name === funcName) {
        result = { funcName, params: getFuncParams(node) };
      }
      break;
    case 'FunctionDeclaration':
      if (node.id.name === funcName) {
        result = { funcName, params: getFuncParams(node) };
      }
      break;
    case 'ExpressionStatement':
      result = getExpressionStatementFuncInfo(node, funcName);
      break;
  }
  return result;
};

const getExpressionStatementFuncInfo = (node: any, funcName: string) => {
  const properties = _.get(node, 'expression.right.properties', []);
  const methodNodes = properties.filter((p: any) => p.type === 'ObjectMethod');
  const funcNode = methodNodes.find((n: any) => n.key.name === funcName);
  const leftobjName = _.get(node, 'expression.left.object.name');
  const leftPropName = _.get(node, 'expression.left.property.name');
  const leftName = leftobjName ? `${leftobjName}.${leftPropName}` : leftPropName;
  const allFuncName = `${leftName}.${funcName}`;
  return { funcName: allFuncName, params: getFuncParams(funcNode) };
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
  parse
};