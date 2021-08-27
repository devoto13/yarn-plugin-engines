import { Plugin } from "@yarnpkg/core";

const plugin: Plugin = {
  hooks: {
    afterAllInstalled: () => {
      console.log(`What a great install, am I right?`);
    },
  },
};

export default plugin;
