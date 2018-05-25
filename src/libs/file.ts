import * as fs from 'fs';
import * as path from 'path';

const mkdirsSync = (dirname: string) => {
  if (fs.existsSync(dirname)) {
    return true;
  } else {
    if (mkdirsSync(path.dirname(dirname))) {
      fs.mkdirSync(dirname);
      return true;
    }
  }
};

export {
  mkdirsSync,
};