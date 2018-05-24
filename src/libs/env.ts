import * as fs from 'fs';

const getEnv = (rootPath: string): string => {
  const filePath = `${rootPath}/package.json`;
  if (!fs.existsSync(filePath)) {
    return '';
  }
  const packageJSON = fs.readFileSync(filePath).toString();
  const packageObj = JSON.parse(packageJSON)
  return '';
  // const packageInfo = JSON.parse(fs.readdirSync(filePath));
};

export {
  getEnv
};