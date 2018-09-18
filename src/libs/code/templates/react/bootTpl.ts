const genCode = (codeFile: string) => {
  return `
  require("babel-register")({
    'presets': ["es2015", 'react'],
  });

  require('babel-polyfill');
  require('${codeFile}').iwResult().then(console.log).then(process.exit).catch(err => {
    console.log(err)
    process.exit()
  });
  `;
};
export {
  genCode
};