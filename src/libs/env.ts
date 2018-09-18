import * as fs from 'fs';

const getEnv = (rootPath: string): string => {
  const filePath = `${rootPath}/package.json`;
  if (!fs.existsSync(filePath)) {
    return '';
  }
  if (fs.existsSync(`${rootPath}/.sailsrc`)) {
    return 'sails@1.0.0';
  }
  try {
    const packageJSON = fs.readFileSync(filePath).toString();
    const packageObj = JSON.parse(packageJSON)
    if (packageObj.dependencies.react) return 'react'
  } catch(err) {}

  return '';
};

export {
  getEnv
};