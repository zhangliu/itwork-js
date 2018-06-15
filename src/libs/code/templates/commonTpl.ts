
const genCode = (funcName: string, params: any[], source: string, isTs: boolean) => {
  return `
    ${isTs ? 'declare var console: any;' : ''}
    ${isTs ? 'declare var process: any;' : ''}
    ${source}
    const iwResult = async () => await ${funcName}(${params.join(',')})
    iwResult().then(console.log).then(process.exit).catch(err => {
      console.log(err)
      process.exit()
    })
  `;
};
export {
  genCode
};