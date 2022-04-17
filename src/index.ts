import {
  Plugin,
  Project,
} from "@yarnpkg/core";
import {
  EngineChecker,
  EngineCheckerOptions,
  ErrorReporter,
  NodeEngineChecker,
  YarnEngineChecker,
} from "./engine-checkers"

const verifyEngines = (errorReporter: ErrorReporter) => (project: Project): void => {
  const { engines = {} } = project.getWorkspaceByCwd(project.cwd).manifest.raw;
  const options: EngineCheckerOptions = { project, errorReporter };
  const engineCheckers: EngineChecker[] = [
    new NodeEngineChecker(options),
    new YarnEngineChecker(options)
  ]
  engineCheckers.forEach(engineChecker => engineChecker.verifyEngine(engines))
}

const plugin: Plugin = {
  hooks: {
    validateProject: verifyEngines(ErrorReporter.Yarn),
    setupScriptEnvironment: verifyEngines(ErrorReporter.Console),
  },
};

export default plugin;
