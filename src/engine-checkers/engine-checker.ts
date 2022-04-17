import {
    ReportError,
    MessageName,
} from "@yarnpkg/core";

export enum ErrorReporter {
    Yarn = "Yarn",
    Console = "Console"
}

export interface EngineCheckerOptions {
    errorReporter: ErrorReporter
}

export abstract class EngineChecker {
    protected errorReporter: ErrorReporter;
    abstract get engine(): string;

    constructor(options: EngineCheckerOptions) {
        this.errorReporter = options.errorReporter;
    }

    protected throwWrongEngineError = (currentVersion: string, requiredVersion: string): void => {
        const message = `The current ${this.engine} version ${currentVersion} does not satisfy the required version ${requiredVersion}.`;
        switch (this.errorReporter) {
            case ErrorReporter.Yarn:
                this.reportYarnError(message);
                break;
            case ErrorReporter.Console:
            default:
                this.reportConsoleError(message);
                break;
        }
    }

    protected reportYarnError = (message: string): never => {
        throw new ReportError(MessageName.UNNAMED, message);
    }

    protected reportConsoleError = (message: string): never => {
        console.error(message);
        process.exit(1);
    }

    abstract verifyEngine(engines: Record<string, string>): void
}