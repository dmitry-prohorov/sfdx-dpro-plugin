sfdx-dpro-plugin
================



[![Version](https://img.shields.io/npm/v/sfdx-dpro-plugin.svg)](https://npmjs.org/package/sfdx-dpro-plugin)
[![CircleCI](https://circleci.com/gh/dmitry-prohorov/sfdx-dpro-plugin/tree/master.svg?style=shield)](https://circleci.com/gh/dmitry-prohorov/sfdx-dpro-plugin/tree/master)
[![Downloads/week](https://img.shields.io/npm/dw/sfdx-dpro-plugin.svg)](https://npmjs.org/package/sfdx-dpro-plugin)
[![License](https://img.shields.io/npm/l/sfdx-dpro-plugin.svg)](https://github.com/dmitry-prohorov/sfdx-dpro-plugin/blob/master/package.json)

<!-- toc -->
* [Debugging your plugin](#debugging-your-plugin)
<!-- tocstop -->
<!-- install -->
<!-- usage -->
```sh-session
$ npm install -g sfdx-dpro-plugin
$ sfdx-dpro-plugin COMMAND
running command...
$ sfdx-dpro-plugin (-v|--version|version)
sfdx-dpro-plugin/0.0.1 darwin-x64 node-v8.11.1
$ sfdx-dpro-plugin --help [COMMAND]
USAGE
  $ sfdx-dpro-plugin COMMAND
...
```
<!-- usagestop -->
<!-- commands -->
* [`sfdx-dpro-plugin dpro:projects:build [FILE]`](#sfdx-dpro-plugin-dproprojectsbuild-file)

## `sfdx-dpro-plugin dpro:projects:build [FILE]`
Build 3rd party frontend apps. To specify a project folders that includes spaces, enclose it in single quotes.

```
USAGE
  $ sfdx-dpro-plugin dpro:projects:build

OPTIONS
  -d, --directory=directory                       Directrory of frontend apps {default: ./frontend-apps}
  -f, --projects=projects                         Comma separated list of project names that needs to be build
  --json                                          format output as json
  --loglevel=(trace|debug|info|warn|error|fatal)  logging level for this command invocation
  --version                                       show CLI version

EXAMPLES
  $ sfdx dpro:projects:build --directory <path to projects folder> --projects <comma separated project folder names>

  $ sfdx dpro:projects:build -d <path to projects folder>
```

_See code: [src/commands/dpro/projects/build.ts](https://github.com/dmitry-prohorov/sfdx-dpro-plugin/blob/v0.0.1/src/commands/dpro/projects/build.ts)_
<!-- commandsstop -->
<!-- debugging-your-plugin -->
# Debugging your plugin
We recommend using the Visual Studio Code (VS Code) IDE for your plugin development. Included in the `.vscode` directory of this plugin is a `launch.json` config file, which allows you to attach a debugger to the node process when running your commands.

To debug the `dpro:projects:build` command:
1. Start the inspector

If you linked your plugin to the sfdx cli, call your command with the `dev-suspend` switch:
```sh-session
$ sfdx dpro:projects:build -d ./frontend-apps --dev-suspend
```

Alternatively, to call your command using the `bin/run` script, set the `NODE_OPTIONS` environment variable to `--inspect-brk` when starting the debugger:
```sh-session
$ NODE_OPTIONS=--inspect-brk dpro:projects:build -d ./frontend-apps
```

2. Set some breakpoints in your command code
3. Click on the Debug icon in the Activity Bar on the side of VS Code to open up the Debug view.
4. In the upper left hand corner of VS Code, verify that the "Attach to Remote" launch configuration has been chosen.
5. Hit the green play button to the left of the "Attach to Remote" launch configuration window. The debugger should now be suspended on the first line of the program.
6. Hit the green play button at the top middle of VS Code (this play button will be to the right of the play button that you clicked in step #5).
<br><img src=".images/vscodeScreenshot.png" width="480" height="278"><br>
Congrats, you are debugging!
