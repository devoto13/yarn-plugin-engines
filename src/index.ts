import {
  MessageName,
  Plugin,
  Project,
  ReportError,
  YarnVersion,
} from "@yarnpkg/core";
import { satisfies } from "semver";

const verifyEngines = (reportError: (message: string) => never) => (project: Project): void => {
  const { engines = {} } = project.getWorkspaceByCwd(project.cwd).manifest.raw;
  if (engines.node != null && !satisfies(process.version, engines.node)) {
    reportError(
      `The current Node version ${process.version} does not satisfy the required version ${engines.node}.`
    );
  }
  if (engines.yarn != null && !satisfies(YarnVersion, engines.yarn)) {
    reportError(
      `The current Yarn version v${YarnVersion} does not satisfy the required version ${engines.yarn}.`
    );
  }
}

const reportYarnError = (message: string) => {
  throw new ReportError(MessageName.UNNAMED, message);
}

const reportConsoleError = (message: string) => {
  console.error(message);
  process.exit(1);
}

const plugin: Plugin = {
  hooks: {
    validateProject: verifyEngines(reportYarnError),
    setupScriptEnvironment: verifyEngines(reportConsoleError),
  },
};

export default plugin;
