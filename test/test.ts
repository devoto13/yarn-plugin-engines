import { spawnSync } from "child_process";
import { existsSync, readFileSync, unlinkSync, writeFileSync } from "fs";
import { resolve } from "path";
import test from "tape";

const isWin = process.platform === "win32";

const updatePackage = (values: { engines?: { node?: string; yarn?: string } }): void => {
  const content = JSON.parse(readFileSync(resolve(__dirname, "..", "package.json"), "utf-8"));
  delete content.engines;
  Object.assign(content, values);
  writeFileSync(resolve(__dirname, "..", "package.json"), JSON.stringify(content, undefined, "  "));
};

const install = (options: { env?: Record<string, unknown> } = {}): { stdout: string; status: number } => {
  return spawnSync(isWin ? "yarn.cmd" : "yarn", {
    cwd: resolve(__dirname, ".."),
    encoding: "utf-8",
    env: { ...process.env, ...options.env, GITHUB_ACTIONS: undefined },
  });
};

const build = (options: { env?: Record<string, unknown> } = {}): { stderr: string; status: number } => {
  return spawnSync(isWin ? "yarn.cmd" : "yarn", ["build"], {
    cwd: resolve(__dirname, ".."),
    encoding: "utf-8",
    env: { ...process.env, ...options.env, GITHUB_ACTIONS: undefined },
  });
};

const getYarnVersion = (): string => {
  const content = JSON.parse(readFileSync(resolve(__dirname, "..", "package.json"), "utf-8"));
  return content.packageManager.slice(5);
};

const yarnVersion = getYarnVersion();

const nvmrcPath = resolve(__dirname, "..", ".nvmrc");

const originalNvmrcContent = existsSync(nvmrcPath) ? readFileSync(nvmrcPath) : null;
const restoreNvmrc = () => {
  if (!existsSync(nvmrcPath)) {
    return;
  }
  if (originalNvmrcContent === null) {
    unlinkSync(nvmrcPath);
  } else {
    writeFileSync(nvmrcPath, originalNvmrcContent);
  }
};

const updateNvmrc = (requirement: string) => {
  writeFileSync(nvmrcPath, requirement);
};

test("fails package installation when Node version does not satisfy engines.node", (t) => {
  t.plan(2);

  updatePackage({ engines: { node: ">= 42" } });
  const { stdout: output, status: exitCode } = install();

  t.equal(exitCode, 1);
  t.match(
    output,
    new RegExp(
      "^" +
        [
          "➤ YN0000: ┌ Project validation",
          `➤ YN0000: │ The current Node version ${process.versions.node} does not satisfy the required version >= 42.`,
          "➤ YN0000: └ Completed",
          "➤ YN0000: Failed with errors",
        ].join("\n")
    )
  );
});

test("fails script execution when Node version does not satisfy engines.node", (t) => {
  t.plan(2);

  updatePackage({ engines: { node: ">= 42" } });
  const { stderr: output, status: exitCode } = build();

  t.equal(exitCode, 1);
  t.equal(output, `The current Node version ${process.versions.node} does not satisfy the required version >= 42.\n`);
});

test("does nothing when Node version satisfies engines.node", (t) => {
  t.plan(2);

  updatePackage({ engines: { node: ">= 10" } });
  const { stdout: output, status: exitCode } = install();

  t.equal(exitCode, 0);
  t.match(output, new RegExp("^➤ YN0000: ┌ Resolution step"));
});

test("fails script execution when Node version does not satisfy the .nvmrc file", (t) => {
  t.plan(2);

  updatePackage({ engines: { node: ".nvmrc" } });
  updateNvmrc(">= 42");
  const { stderr: output, status: exitCode } = build();
  restoreNvmrc();

  t.equal(exitCode, 1);
  t.equal(output, `The current Node version ${process.versions.node} does not satisfy the required version >= 42.\n`);
});

test("fails script execution when the .nvmrc file contains an invalid semver range", (t) => {
  t.plan(2);

  updatePackage({ engines: { node: ".nvmrc" } });
  updateNvmrc("stable");
  const { stderr: output, status: exitCode } = build();
  restoreNvmrc();

  t.equal(exitCode, 1);
  t.equal(output, "Unable to verify the Node version. The .nvmrc file contains an invalid semver range.\n");
});

test("fails script execution when the .nvmrc file does not exist", (t) => {
  t.plan(2);

  updatePackage({ engines: { node: ".nvmrc" } });
  const { stderr: output, status: exitCode } = build();

  t.equal(exitCode, 1);
  t.equal(output, "Unable to verify the Node version. The .nvmrc file does not exist.\n");
});

test("does nothing when Node version satisfies the .nvmrc file", (t) => {
  t.plan(2);

  updatePackage({ engines: { node: ".nvmrc" } });
  updateNvmrc(">= 10");
  const { stdout: output, status: exitCode } = install();
  restoreNvmrc();

  t.equal(exitCode, 0);
  t.match(output, new RegExp("^➤ YN0000: ┌ Resolution step"));
});

test("fails package installation when Yarn version does not satisfy engines.yarn", (t) => {
  t.plan(2);

  updatePackage({ engines: { yarn: ">= 42" } });
  const { stdout: output, status: exitCode } = install();

  t.equal(exitCode, 1);
  t.match(
    output,
    new RegExp(
      "^" +
        [
          "➤ YN0000: ┌ Project validation",
          `➤ YN0000: │ The current Yarn version ${yarnVersion} does not satisfy the required version >= 42.`,
          "➤ YN0000: └ Completed",
          "➤ YN0000: Failed with errors",
        ].join("\n")
    )
  );
});

test("fails script execution when Yarn version does not satisfy engines.yarn", (t) => {
  t.plan(2);

  updatePackage({ engines: { yarn: ">= 42" } });
  const { stderr: output, status: exitCode } = build();

  t.equal(exitCode, 1);
  t.equal(output, `The current Yarn version ${yarnVersion} does not satisfy the required version >= 42.\n`);
});

test("does nothing when Yarn version satisfies engines.yarn", (t) => {
  t.plan(2);

  updatePackage({ engines: { yarn: "3.x" } });
  const { stdout: output, status: exitCode } = install();

  t.equal(exitCode, 0);
  t.match(output, new RegExp("^➤ YN0000: ┌ Resolution step"));
});

test("does nothing when engines is not present", (t) => {
  t.plan(2);

  updatePackage({});
  const { stdout: output, status: exitCode } = install();

  t.equal(exitCode, 0);
  t.match(output, new RegExp("^➤ YN0000: ┌ Resolution step"));
});

test("allows installation when plugin is disabled using environment variable", (t) => {
  t.plan(2);

  updatePackage({ engines: { node: ">= 42" } });

  const { stdout: output, status: exitCode } = install({ env: { YARN_PLUGIN_ENGINES_DISABLE: "1" } });

  t.equal(exitCode, 0);
  t.match(output, new RegExp("^➤ YN0000: ┌ Resolution step"));
});

test("allows script execution when plugin is disabled using environment variable", (t) => {
  t.plan(1);

  updatePackage({ engines: { node: ">= 42" } });

  const { status: exitCode } = build({ env: { YARN_PLUGIN_ENGINES_DISABLE: "1" } });

  t.equal(exitCode, 0);
});
