import { flags } from '@oclif/command';
import { join } from 'path';
import { SfdxCommand, core } from '@salesforce/command';
import { sh, CmdOptions } from '../../../scripts/cmd';

core.Messages.importMessagesDirectory(join(__dirname, '..', '..', '..', '..'));
const messages = core.Messages.loadMessages('sfdx-dpro-plugin', 'build');

export default class Build extends SfdxCommand {

  public static description = messages.getMessage('commandDescription');

  public static examples = [
  '$ sfdx dpro:projects:build --directory <path to projects folder> --projects <comma separated project folder names>',
  '$ sfdx dpro:projects:build -d <path to projects folder>'
  ];

  protected static flagsConfig = {
    version: flags.version(),
    directory: flags.string({char: 'd', description: messages.getMessage('directoryFlagDescription')}),
    projects: flags.string({char: 'f', description: messages.getMessage('projectsFlagDescription')})
  };

  public async run(): Promise<any> { // tslint:disable-line:no-any
    const directory = this.flags.directory || join(process.cwd(), 'frontend-apps');

    const projectsDirectoryExist = await this.isDirectory(directory);
    if (!projectsDirectoryExist) {
      this.error(`Apps folder is not exists: ${directory}`);
    }

    const projects: string[] = (this.flags.projects && this.flags.projects.split(',')) || await core.fs.readdir(directory);

    const output: any = { // tslint:disable-line:no-any
        successDetails: [],
        failDetails: []
    };
    for (const project of projects) {
      const projectPath = join(directory, project);
      const isProject = await this.isProject(projectPath);

      if (!isProject) {
        continue;
      }
      const result = await sh({
          cmd: 'npm',
          args: ['run', 'build'],
          cwd: projectPath} as CmdOptions);

      if (result.status === 0) {
        this.ux.log(`Project ${project} build successfully!`);
        output.successDetails.push({
          success: true,
          project,
          stack: result.stdout
        });
      } else {
        // TODO: figure out how to create more descriptive output
        this.ux.error(`Project ${project} build unsuccessfully!`);
        output.failDetails.push({
          success: false,
          project,
          stack: result.stderr
        });
      }
    }

    if (output.failDetails.length > 0) {
      this.error(`Build was failed for next projects: ${output.failDetails.map((item) => item.project).join(',')}\
      !\nStack:${output.failDetails.map((item) => item.stack).join('\n###############\n')}`, {exit: 1});
    }

    this.ux.log('Build was successful!');

    // Return an object to be displayed with --json
    return { details: output.successDetails };
  }

  private isProject(projectPath: string): Promise<boolean> {
    return Promise.all([this.isDirectory(projectPath), this.isPackageJsonExist(projectPath)])
        .then(([isDir, packageExist]) => isDir && packageExist);
  }

  private isDirectory(projectPath: string): Promise<boolean> {
    return core.SfdxUtil.stat(projectPath)
        .then((stats) => stats.isDirectory())
        .catch((err) => false);
    return core.fs.stat(projectPath)
  }

  private isPackageJsonExist(projectPath: string): Promise<boolean> {
    return core.SfdxUtil.stat(join(projectPath, 'package.json'))
        .then((stat) => stat.isFile())
        .catch((err) => false);
    return core.fs.stat(join(projectPath, 'package.json'))
  }
}
