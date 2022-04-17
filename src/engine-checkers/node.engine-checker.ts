import { satisfies } from "semver"
import { EngineChecker } from "./engine-checker";

export class NodeEngineChecker extends EngineChecker {
    get engine(): string {
        return "Node";
    }

    verifyEngine(engines: Record<string, string>): void {
        const nodeRequiredVersion = engines.node;
        if (nodeRequiredVersion == null) {
            return;
        }
        if (!satisfies(process.version, nodeRequiredVersion)) {
            this.throwWrongEngineError(process.version.replace(/^v/i, ''), nodeRequiredVersion.replace(/^v/i, ''));
        }
    }
}