
const genCode = (funcName: string, params: any[], source: string, isTs: boolean) => {
  const baseCode = `
    ${isTs ? 'declare var console: any;' : ''}
    ${isTs ? 'declare var process: any;' : ''}
    ${source}
  `;
  const callCode = `
    ${baseCode}
    const iwResult = async () => await ${funcName}(${params.join(',')})
    iwResult().then(console.log).then(process.exit).catch(err => {
      console.log(err)
      process.exit()
    })
  `;
  return funcName ? callCode : baseCode;
};
export {
  genCode
};