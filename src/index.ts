import { MessageName, Plugin, Project, ReportError } from "@yarnpkg/core";
import { readFileSync } from "fs";
import { resolve } from "path";
import { satisfies } from "semver";

const plugin: Plugin = {
  hooks: {
    validateProject: (project: Project): void => {
      const packageJson = readFileSync(
        resolve(project.cwd, "package.json"),
        "utf-8"
      );
      const { engines = {} } = JSON.parse(packageJson);
      if (engines.node != null && !satisfies(process.version, engines.node)) {
        throw new ReportError(
          MessageName.UNNAMED,
          `The current node version ${process.version} does not satisfy the required version ${engines.node}.`
        );
      }
    },
  },
};

export default plugin;
