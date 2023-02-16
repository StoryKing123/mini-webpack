
    (() => {
     var modules = {
       
         "./demo/src/moduleA.js": (module) => {
           // exports.moduleA = function(){
// console.log('module a')
// }

module.exports.moduleA = function () {
  console.log('module A');
};
//给你的代码加点注释：loader2//给你的代码加点注释：loader1
         }
       ,
         "./demo/src/name.js": (module) => {
           module.exports = "99999";
//给你的代码加点注释：loader2//给你的代码加点注释：loader1
         }
       ,
         "./demo/src/index.js": (module) => {
           const {
  moduleA
} = require("./demo/src/moduleA.js");
const name = require("./demo/src/name.js");
console.log('1111 name:' + name);
// console.log('index')
// console.log(moduleA)
moduleA();
//给你的代码加点注释：loader2//给你的代码加点注释：loader1
         }
         
     };
     var cache = {};
     function require(moduleId) {
       var cachedModule = cache[moduleId];
       if (cachedModule !== undefined) {
         return cachedModule.exports;
       }
       var module = (cache[moduleId] = {
         exports: {},
       });
       modules[moduleId](module, module.exports, require);
       return module.exports;
     }
     var exports ={};
     const {
  moduleA
} = require("./demo/src/moduleA.js");
const name = require("./demo/src/name.js");
console.log('1111 name:' + name);
// console.log('index')
// console.log(moduleA)
moduleA();
//给你的代码加点注释：loader2//给你的代码加点注释：loader1
   })();
    