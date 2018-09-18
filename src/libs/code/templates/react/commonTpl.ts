const genCode = (funcName: string, params: any[], source: string) => {
    return `
        ${source}
        const iwResult = async () => await ${funcName}(${params.join(',')});
        module.exports.iwResult = iwResult;
    `;
};
 export { genCode };