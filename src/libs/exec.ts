
const { exec } = require('child_process');

const execSync = async (cmd: string, opt: any = {}) => {
  const options = { ...opt, timeout: 20000 };
  return await new Promise((resolve, reject) => {
    exec(cmd, options, (err: any, stdout: string, stderr: string) => {
      if (stdout && !/^\s*$/.test(stdout)) {
        return resolve(stdout);
      }
      return resolve(stderr);
    });
  });
};

export {
  execSync
};