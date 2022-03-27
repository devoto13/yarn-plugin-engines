# yarn-plugin-engines

Yarn Berry plugin to enforce Node version.

## Installation

```sh
$ yarn plugin import https://raw.githubusercontent.com/devoto13/yarn-plugin-engines/main/bundles/%40yarnpkg/plugin-engines.js
```

## Usage

Specify the desired Node version constraint using `engines.node` field and the plugin will fail installation if the current Node version does not satisfy it:

```sh
$ cat package.json
{
    "name": "my-package",
    "engines": {
        "node": ">= 42"
    }
}
$ yarn
yarn
➤ YN0000: ┌ Project validation
➤ YN0000: │ The current node version v14.17.3 does not satisfy the required version >= 42.
➤ YN0000: └ Completed
➤ YN0000: Failed with errors in 0s 5ms
```

As well as fail a script execution with a non-zero exit code:

```sh
$ cat package.json
{
    "name": "my-package",
    "scripts": {
        "build": "echo success!"
    },
    "engines": {
        "node": ">= 42"
    }
}
$ yarn build
The current node version v14.17.3 does not satisfy the required version >= 42.
```

## Supported `engines` keys

- `node` to control the version of Node.
- `yarn` to control the version of Yarn.

## Motivation

It's important to ensure that all developers on the team use the same version of Node to avoid "it does not work on my machine" kind of problems. With Yarn 1 one can set [`engines.node` field](https://docs.npmjs.com/cli/v7/configuring-npm/package-json#engines) in the project's `package.json` to communicate the required Node version, but this feature is [missing in Yarn 2+](https://github.com/yarnpkg/berry/issues/1177). Hopefully one day this will be implemented in Yarn core making the plugin obsolete.
