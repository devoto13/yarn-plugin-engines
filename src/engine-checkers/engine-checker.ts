import { ReportError, MessageName, Project, formatUtils } from "@yarnpkg/core";

export enum ErrorReporter {
  Yarn = "Yarn",
  Console = "Console",
}

export interface EngineCheckerOptions {
  project: Project;
  errorReporter: ErrorReporter;
}

export abstract class EngineChecker {
  protected project: Project;
  protected errorReporter: ErrorReporter;
  abstract get engine(): string;

  constructor(options: EngineCheckerOptions) {
    this.project = options.project;
    this.errorReporter = options.errorReporter;
  }

  protected throwWrongEngineError = (currentVersion: string, requiredVersion: string): void => {
    const message = this.formatErrorMessage(currentVersion, requiredVersion);
    this.throwError(message);
  };

  protected throwError = (message: string): void => {
    switch (this.errorReporter) {
      case ErrorReporter.Yarn:
        this.reportYarnError(message);
        break;
      case ErrorReporter.Console:
      default:
        this.reportConsoleError(message);
        break;
    }
  };

  protected reportYarnError = (message: string): never => {
    throw new ReportError(MessageName.UNNAMED, message);
  };

  protected reportConsoleError = (message: string): never => {
    console.error(message);
    process.exit(1);
  };

  protected formatErrorMessage = (currentVersion: string, requiredVersion: string): string => {
    const { configuration } = this.project;
    const engineText = formatUtils.applyStyle(
      configuration,
      formatUtils.pretty(configuration, this.engine, "green"),
      2
    );
    const currentVersionText = formatUtils.pretty(configuration, currentVersion, "cyan");
    const requiredVersionText = formatUtils.pretty(configuration, requiredVersion, "cyan");
    const message = `The current ${engineText} version ${currentVersionText} does not satisfy the required version ${requiredVersionText}.`;
    return formatUtils.pretty(configuration, message, "red");
  };

  abstract verifyEngine(engines: Record<string, string>): void;
}
