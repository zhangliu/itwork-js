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
      result = getVariableDeclarationFuncInfo(node, funcName);
      break;
    case 'FunctionDeclaration':
      if (node.id.name === funcName) {
        result = { funcName, params: getParams(node) };
      }
      break;
    case 'ExpressionStatement':
      result = getExpressionStatementFuncInfo(node, funcName);
      break;
  }
  return result;
};

const getVariableDeclarationFuncInfo = (node: any, funcName: string) => {
  const funcTypes = ['ArrowFunctionExpression', 'FunctionExpression'];
  const initType = _.get(node, 'declarations[0].init.type');
  const varName = _.get(node, 'declarations[0].id.name');
  const isFunc = funcTypes.indexOf(initType) !== -1;
  if (isFunc) {
    const isSameFunc = funcName === varName;
    return isSameFunc ? { funcName, params: getParams(node) } : null;
  }
  if (initType === 'ObjectExpression') {
    const props = _.get(node, 'declarations[0].init.properties');
    const methodNodes = props.filter((p: any) => p.type === 'ObjectMethod');
    const funcNode = methodNodes.find((n: any) => n.key.name === funcName);
    return funcNode ? { funcName: `${varName}.${funcName}`, params: getParams(funcNode) } : null;
  }
};

const getExpressionStatementFuncInfo = (node: any, funcName: string) => {
  const expression = node.expression;
  if (expression.type !== 'AssignmentExpression') {
    return;
  }
  const { left, right } = expression;
  let leftName: string = '';
  if (left.type === 'MemberExpression') {
    const prop = left.property;
    const objName = left.object.name;
    leftName = prop.name ? `${objName}.${prop.name}` : `${objName}['${prop.value}']`;
  }
  if (left.type === 'Identifier') {
    leftName = left.name;
  }
  if (right.type === 'ObjectExpression') {
    const funcInfo = getObjectExpressionFuncInfo(right, funcName);
    if (!funcInfo) {
      return;
    }
    const newFuncName = `${leftName}.${funcInfo.funcName}`;
    return funcInfo ? { funcName: newFuncName, params: funcInfo.params } : null;
  }
  if (right.type === 'FunctionExpression') {
    const isSame = funcName === leftName;
    return isSame ? { funcName: leftName, params: getParams(node) } : null;
  }
};

const getObjectExpressionFuncInfo = (node: any, funcName: string) => {
  for (const prop of node.properties) {
    if (prop.type === 'ObjectProperty' && prop.value.type === 'FunctionExpression') {
      if (prop.key.name === funcName) {
        return { funcName, params: getParams(prop) };
      }
      continue;
    }
    if (prop.type === 'ObjectMethod') {
      if (prop.key.name === funcName) {
        return { funcName, params: getParams(prop) };
      }
      continue;
    }
  }
};

const getParams = (obj: any) => {
  let params: any[] = [];
  const trim = (str: string) => str.replace(/(^\s+)|(\s+$)/g, '');
  if (!Array.isArray(obj.leadingComments)) {
    return [];
  }
  const cReg = /^(.*?=)(.*)$/
  const comments = obj.leadingComments.filter((c: any) => cReg.test(c.value) && c.type === 'CommentLine');
  comments.map((c: any) => {
    const paramsStr = trim(c.value);
    const subParams = trim(paramsStr.replace(cReg, '$2'));
    params = params.concat(subParams);
  });
  return params;
};

export {
  parse
};