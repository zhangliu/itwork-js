
const genCode = (funcName: string, params: any[], source: string, isTs: boolean) => {
  return `
    ${source}
    const iwResult = async () => await ${funcName}(${params.join(',')})
    ${isTs ? 'export {iwResult}' : 'module.exports.iwResult = iwResult;'}
  `;
};
export {
  genCode
};