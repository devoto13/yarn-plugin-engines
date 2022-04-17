/* eslint-disable */
//prettier-ignore
module.exports = {
name: "@yarnpkg/plugin-engines",
factory: function (require) {
var plugin=(()=>{var g=Object.create,a=Object.defineProperty;var v=Object.getOwnPropertyDescriptor;var d=Object.getOwnPropertyNames;var u=Object.getPrototypeOf,h=Object.prototype.hasOwnProperty;var y=r=>a(r,"__esModule",{value:!0});var t=r=>{if(typeof require!="undefined")return require(r);throw new Error('Dynamic require of "'+r+'" is not supported')};var P=(r,o)=>{for(var n in o)a(r,n,{get:o[n],enumerable:!0})},k=(r,o,n)=>{if(o&&typeof o=="object"||typeof o=="function")for(let e of d(o))!h.call(r,e)&&e!=="default"&&a(r,e,{get:()=>o[e],enumerable:!(n=v(o,e))||n.enumerable});return r},i=r=>k(y(a(r!=null?g(u(r)):{},"default",r&&r.__esModule&&"default"in r?{get:()=>r.default,enumerable:!0}:{value:r,enumerable:!0})),r);var w={};P(w,{default:()=>$});var s=i(t("@yarnpkg/core")),p=i(t("@yarnpkg/fslib")),f=i(t("fs")),l=i(t("path")),c=i(t("semver")),m=r=>o=>{let n=(0,f.readFileSync)((0,l.resolve)(p.npath.fromPortablePath(o.cwd),"package.json"),"utf-8"),{engines:e={}}=JSON.parse(n);e.node!=null&&!(0,c.satisfies)(process.version,e.node)&&r(`The current Node version ${process.version} does not satisfy the required version ${e.node}.`),e.yarn!=null&&!(0,c.satisfies)(s.YarnVersion,e.yarn)&&r(`The current Yarn version v${s.YarnVersion} does not satisfy the required version ${e.yarn}.`)},E=r=>{throw new s.ReportError(s.MessageName.UNNAMED,r)},N=r=>{console.error(r),process.exit(1)},j={hooks:{validateProject:m(E),setupScriptEnvironment:m(N)}},$=j;return w;})();
return plugin;
}
};
