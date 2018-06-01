const genCode = (codeFile: string, languageId: string) => {
  const isTs = languageId === 'typescript';
  return `
    ${isTs ? 'require(\'ts-node/register\')' : ''}
    const sails = require('sails');

    sails.lift({
      hooks: { grunt: false },
      log: { level: 'warn' },
    }, (err) => {
      if (err) {
        return console.log(err);
      }
      require('${codeFile}').iwResult().then(console.log).then(process.exit).catch(err => {
        console.log(err)
        process.exit()
      });
    });
  `;
};
export {
  genCode
};