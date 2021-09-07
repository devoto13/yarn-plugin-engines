/* eslint-disable */
//prettier-ignore
module.exports = {
name: "@yarnpkg/plugin-engines",
factory: function (require) {
var plugin=(()=>{var v=Object.create,n=Object.defineProperty;var f=Object.getOwnPropertyDescriptor;var u=Object.getOwnPropertyNames;var l=Object.getPrototypeOf,m=Object.prototype.hasOwnProperty;var g=e=>n(e,"__esModule",{value:!0});var t=e=>{if(typeof require!="undefined")return require(e);throw new Error('Dynamic require of "'+e+'" is not supported')};var h=(e,o)=>{for(var r in o)n(e,r,{get:o[r],enumerable:!0})},P=(e,o,r)=>{if(o&&typeof o=="object"||typeof o=="function")for(let s of u(o))!m.call(e,s)&&s!=="default"&&n(e,s,{get:()=>o[s],enumerable:!(r=f(o,s))||r.enumerable});return e},i=e=>P(g(n(e!=null?v(l(e)):{},"default",e&&e.__esModule&&"default"in e?{get:()=>e.default,enumerable:!0}:{value:e,enumerable:!0})),e);var y={};h(y,{default:()=>k});var c=i(t("@yarnpkg/core")),a=i(t("fs")),p=i(t("path")),d=i(t("semver")),j={hooks:{validateProject:e=>{let o=(0,a.readFileSync)((0,p.resolve)(e.cwd,"package.json"),"utf-8"),{engines:r={}}=JSON.parse(o);if(r.node!=null&&!(0,d.satisfies)(process.version,r.node))throw new c.ReportError(c.MessageName.UNNAMED,`The current node version ${process.version} does not satisfy the required version ${r.node}.`)},setupScriptEnvironment:async e=>{let o=(0,a.readFileSync)((0,p.resolve)(e.cwd,"package.json"),"utf-8"),{engines:r={}}=JSON.parse(o);r.node!=null&&!(0,d.satisfies)(process.version,r.node)&&(console.error(`The current node version ${process.version} does not satisfy the required version ${r.node}.`),process.exit(1))}}},k=j;return y;})();
return plugin;
}
};
