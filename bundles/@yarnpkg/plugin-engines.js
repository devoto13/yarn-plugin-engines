/* eslint-disable */
//prettier-ignore
module.exports = {
name: "@yarnpkg/plugin-engines",
factory: function (require) {
var plugin=(()=>{var v=Object.create,t=Object.defineProperty;var g=Object.getOwnPropertyDescriptor;var p=Object.getOwnPropertyNames;var l=Object.getPrototypeOf,u=Object.prototype.hasOwnProperty;var f=e=>t(e,"__esModule",{value:!0});var a=e=>{if(typeof require!="undefined")return require(e);throw new Error('Dynamic require of "'+e+'" is not supported')};var m=(e,r)=>{for(var n in r)t(e,n,{get:r[n],enumerable:!0})},y=(e,r,n)=>{if(r&&typeof r=="object"||typeof r=="function")for(let s of p(r))!u.call(e,s)&&s!=="default"&&t(e,s,{get:()=>r[s],enumerable:!(n=g(r,s))||n.enumerable});return e},c=e=>y(f(t(e!=null?v(l(e)):{},"default",e&&e.__esModule&&"default"in e?{get:()=>e.default,enumerable:!0}:{value:e,enumerable:!0})),e);var N={};m(N,{default:()=>P});var o=c(a("@yarnpkg/core")),i=c(a("semver")),d=e=>r=>{let{engines:n={}}=r.getWorkspaceByCwd(r.cwd).manifest.raw;n.node!=null&&!(0,i.satisfies)(process.version,n.node)&&e(`The current Node version ${process.version} does not satisfy the required version ${n.node}.`),n.yarn!=null&&!(0,i.satisfies)(o.YarnVersion,n.yarn)&&e(`The current Yarn version v${o.YarnVersion} does not satisfy the required version ${n.yarn}.`)},h=e=>{throw new o.ReportError(o.MessageName.UNNAMED,e)},w=e=>{console.error(e),process.exit(1)},E={hooks:{validateProject:d(h),setupScriptEnvironment:d(w)}},P=E;return N;})();
return plugin;
}
};
