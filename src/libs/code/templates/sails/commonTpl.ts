
const genCode = (funcName: string, params: any[], source: string, languageId: string) => {
  const isTs = languageId === 'typescript';
  return `
    ${source}
    const iwResult = async () => await ${funcName}(${params.join(',')})
    ${isTs ? 'export {iwResult}' : 'module.exports.iwResult = iwResult;'}
  `;
};
export {
  genCode
};