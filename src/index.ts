import {
  MessageName,
  Plugin,
  Project,
  ReportError,
  YarnVersion,
} from "@yarnpkg/core";
import { npath } from "@yarnpkg/fslib";
import { readFileSync } from "fs";
import { resolve } from "path";
import { satisfies } from "semver";

const plugin: Plugin = {
  hooks: {
    validateProject: (project: Project): void => {
      const packageJson = readFileSync(
        resolve(npath.fromPortablePath(project.cwd), "package.json"),
        "utf-8"
      );
      const { engines = {} } = JSON.parse(packageJson);
      if (engines.node != null && !satisfies(process.version, engines.node)) {
        throw new ReportError(
          MessageName.UNNAMED,
          `The current Node version ${process.version} does not satisfy the required version ${engines.node}.`
        );
      }
      if (engines.yarn != null && !satisfies(YarnVersion, engines.yarn)) {
        throw new ReportError(
          MessageName.UNNAMED,
          `The current Yarn version v${YarnVersion} does not satisfy the required version ${engines.yarn}.`
        );
      }
    },
    setupScriptEnvironment: async (project: Project): Promise<void> => {
      const packageJson = readFileSync(
        resolve(npath.fromPortablePath(project.cwd), "package.json"),
        "utf-8"
      );
      const { engines = {} } = JSON.parse(packageJson);
      if (engines.node != null && !satisfies(process.version, engines.node)) {
        console.error(
          `The current Node version ${process.version} does not satisfy the required version ${engines.node}.`
        );
        process.exit(1);
      }
      if (engines.yarn != null && !satisfies(YarnVersion, engines.yarn)) {
        console.error(
          `The current Yarn version v${YarnVersion} does not satisfy the required version ${engines.yarn}.`
        );
        process.exit(1);
      }
    },
  },
};

export default plugin;
