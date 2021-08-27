/* eslint-disable */
//prettier-ignore
module.exports = {
name: "@yarnpkg/plugin-engines",
factory: function (require) {
var plugin=(()=>{var a=Object.defineProperty;var n=(t,l)=>{for(var o in l)a(t,o,{get:l[o],enumerable:!0})};var g={};n(g,{default:()=>e});var r={hooks:{afterAllInstalled:()=>{console.log("What a great install, am I right?")}}},e=r;return g;})();
return plugin;
}
};
