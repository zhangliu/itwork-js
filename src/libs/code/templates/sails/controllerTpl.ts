const genCode = (funcName: string, params: any[], source: string, isTs: boolean) => {
  const resCode = `
    const res = {
      ok: v => v,
      send: v => v,
      wrap: async fn => await fn()
    }
  `;
  let resultCode = `return await ${funcName}(${params.join(',')})`;
  if (params.length === 0) {
    resultCode = `return await ${funcName} ({}, res)`;
  }
  if (params.length === 1) {
    resultCode = `return await ${funcName} (${params[0]}, res)`;
  }
  return `
    ${source}
    const iwResult = async () => {
      ${resCode}
      ${resultCode}
    }
    ${isTs ? 'export {iwResult}' : 'module.exports.iwResult = iwResult;'}
  `;
};
export {
  genCode
};