import { readFileSync, existsSync } from "fs";
import { resolve } from "path";
import { satisfies, validRange } from "semver";
import { npath } from "@yarnpkg/fslib";
import { formatUtils } from "@yarnpkg/core";
import { EngineChecker } from "./engine-checker";

const NVMRC_FILENAME = ".nvmrc";
const NODE_VERSION_FILENAME = ".node-version";

export class NodeEngineChecker extends EngineChecker {
  get engine(): string {
    return "Node";
  }

  verifyEngine(engines: Record<string, string>): void {
    let nodeRequiredVersion = engines.node;
    if (nodeRequiredVersion == null) {
      return;
    }
    [NVMRC_FILENAME, NODE_VERSION_FILENAME].forEach((filename) => {
      if (nodeRequiredVersion === filename) {
        nodeRequiredVersion = this.resolveNodeFromFileRequiredVersion(filename);
      }
    });
    if (!satisfies(process.version, nodeRequiredVersion, { includePrerelease: true })) {
      this.throwWrongEngineError(process.version.replace(/^v/i, ""), nodeRequiredVersion.replace(/^v/i, ""));
    }
  }

  protected resolveNodeFromFileRequiredVersion = (filename: string): string => {
    const { configuration, cwd } = this.project;
    const filePath = resolve(npath.fromPortablePath(cwd), filename);
    const engineText = formatUtils.applyStyle(
      configuration,
      formatUtils.pretty(configuration, this.engine, "green"),
      2,
    );
    if (!existsSync(filePath)) {
      this.throwError(
        formatUtils.pretty(
          configuration,
          `Unable to verify the ${engineText} version. The ${filename} file does not exist.`,
          "red",
        ),
      );
      return;
    }
    const nodeFileVersion = readFileSync(filePath, "utf-8").trim();
    if (validRange(nodeFileVersion)) {
      return nodeFileVersion;
    }
    const filenameText = formatUtils.pretty(configuration, filename, "yellow");
    this.throwError(
      formatUtils.pretty(
        configuration,
        `Unable to verify the ${engineText} version. The ${filenameText} file contains an invalid semver range.`,
        "red",
      ),
    );
  };
}
