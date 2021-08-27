/* eslint-disable */
//prettier-ignore
module.exports = {
name: "@yarnpkg/plugin-engines",
factory: function (require) {
var plugin=(()=>{var f=Object.create,n=Object.defineProperty;var m=Object.getOwnPropertyDescriptor;var l=Object.getOwnPropertyNames;var g=Object.getPrototypeOf,u=Object.prototype.hasOwnProperty;var v=e=>n(e,"__esModule",{value:!0});var t=e=>{if(typeof require!="undefined")return require(e);throw new Error('Dynamic require of "'+e+'" is not supported')};var h=(e,o)=>{for(var r in o)n(e,r,{get:o[r],enumerable:!0})},P=(e,o,r)=>{if(o&&typeof o=="object"||typeof o=="function")for(let s of l(o))!u.call(e,s)&&s!=="default"&&n(e,s,{get:()=>o[s],enumerable:!(r=m(o,s))||r.enumerable});return e},i=e=>P(v(n(e!=null?f(g(e)):{},"default",e&&e.__esModule&&"default"in e?{get:()=>e.default,enumerable:!0}:{value:e,enumerable:!0})),e);var N={};h(N,{default:()=>k});var a=i(t("@yarnpkg/core")),c=i(t("fs")),p=i(t("path")),d=i(t("semver")),j={hooks:{validateProject:e=>{let o=(0,c.readFileSync)((0,p.resolve)(e.cwd,"package.json"),"utf-8"),{engines:r={}}=JSON.parse(o);if(r.node!=null&&!(0,d.satisfies)(process.version,r.node))throw new a.ReportError(a.MessageName.UNNAMED,`The current node version ${process.version} does not satisfy the required version ${r.node}.`)}}},k=j;return N;})();
return plugin;
}
};
