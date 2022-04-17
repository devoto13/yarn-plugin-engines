import {readFileSync} from "fs";
import {resolve} from "path";
import {
    satisfies,
    validRange,
 } from "semver"
import {npath} from "@yarnpkg/fslib"
import {
    ReportError,
    MessageName,
    formatUtils,
} from "@yarnpkg/core";
import { EngineChecker } from "./engine-checker";

export class NodeEngineChecker extends EngineChecker {
    get engine(): string {
        return "Node";
    }

    verifyEngine(engines: Record<string, string>): void {
        let nodeRequiredVersion = engines.node;
        if (nodeRequiredVersion == null) {
            return;
        }
        if (nodeRequiredVersion === ".nvmrc") {
            nodeRequiredVersion = this.resolveNvmRequiredVersion();
        }
        if (!satisfies(process.version, nodeRequiredVersion)) {
            this.throwWrongEngineError(process.version.replace(/^v/i, ''), nodeRequiredVersion.replace(/^v/i, ''));
        }
    }

    protected resolveNvmRequiredVersion = (): string => {
        const {configuration, cwd} = this.project;
        const nvmrcVersion = readFileSync(resolve(npath.fromPortablePath(cwd), ".nvmrc"), "utf-8").trim();
        if (validRange(nvmrcVersion)){
            return nvmrcVersion;
        }
        const engineText = formatUtils.applyStyle(configuration, formatUtils.pretty(configuration, this.engine, 'green'), 2);
        const nvmrcText = formatUtils.pretty(configuration, '.nvmrc', 'yellow');
        this.throwError(formatUtils.pretty(configuration, `Unable to verify the ${engineText} version. The ${nvmrcText} file contains an invalid semver range.`, 'red'));
    }
}