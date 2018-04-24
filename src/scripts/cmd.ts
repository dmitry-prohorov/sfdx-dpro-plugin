import { spawn } from 'child_process';

export class CmdError extends Error {}

export function sh(options: CmdOptions): Promise<any> { // tslint:disable-line:no-any
  return new Promise((resolve, reject) => {
    if (!options.cmd) {
      throw new CmdError('Parameted cmd is required and should be specified');
    }
    let cmd: string = options.cmd;
    const error: string[] = [];
    const args: string[] = options.args;
    const dir: string = options.cwd || process.cwd();
    const out: string[] = [];

    if (/^win/.test(process.platform)) {
      args.unshift(cmd);
      args.unshift('/c');
      cmd = 'cmd.exe';
    }

    const command = spawn(cmd, args, {
      cwd: dir
    });

    command.stdout.on('data', (data) => {
      out.push(data.toString());
    });

    command.stderr.on('data', (data) => {
      error.push(data.toString() + '\n');
    });

    command.on('exit', (code) => {
      resolve({
        status: code,
        stdout: out.join(''),
        stderr: error.join('')
      });
    });
  });
}

export interface CmdOptions {
  cmd: string;
  args?: string[];
  cwd?: string;
}
