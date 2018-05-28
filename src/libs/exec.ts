
const { exec } = require('child_process');

const execSync = async (cmd: string, opt: any = {}) => {
  const options = { ...opt, timeout: 20000 };
  return await new Promise((resolve, reject) => {
    exec(cmd, options, (err: any, stdout: any, stderr: any) => {
      if (stdout) {
        return resolve(stdout);
      }
      return resolve(stderr);
    });
  });
};

export {
  execSync
};