"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var e=require("@babel/runtime/helpers/defineProperty"),r=require("./pop-3b6d66e5.js"),t=require("@babel/runtime/helpers/objectWithoutProperties");function n(e){return e&&"object"==typeof e&&"default"in e?e:{default:e}}require("@babel/runtime/helpers/asyncToGenerator"),require("@babel/runtime/helpers/slicedToArray"),require("@babel/runtime/helpers/toConsumableArray"),require("@babel/runtime/helpers/typeof"),require("@babel/runtime/helpers/classCallCheck"),require("@babel/runtime/helpers/createClass"),require("@babel/runtime/regenerator");var o=n(e),i=n(t);function c(e,r){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);r&&(n=n.filter((function(r){return Object.getOwnPropertyDescriptor(e,r).enumerable}))),t.push.apply(t,n)}return t}function u(e){for(var r=1;r<arguments.length;r++){var t=null!=arguments[r]?arguments[r]:{};r%2?c(Object(t),!0).forEach((function(r){o.default(e,r,t[r])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):c(Object(t)).forEach((function(r){Object.defineProperty(e,r,Object.getOwnPropertyDescriptor(t,r))}))}return e}function a(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};return a.use=a.use.bind(a,e),a}a.use=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};return new r.Animation(u({opacity:1,duration:.65},e),{opacity:0})};var p=["direction"];function s(e,r){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);r&&(n=n.filter((function(r){return Object.getOwnPropertyDescriptor(e,r).enumerable}))),t.push.apply(t,n)}return t}function l(e){for(var r=1;r<arguments.length;r++){var t=null!=arguments[r]?arguments[r]:{};r%2?s(Object(t),!0).forEach((function(r){o.default(e,r,t[r])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):s(Object(t)).forEach((function(r){Object.defineProperty(e,r,Object.getOwnPropertyDescriptor(t,r))}))}return e}function b(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};return b.use=b.use.bind(b,e),b}b.use=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},t=e.direction,n=void 0===t?"right":t,o=i.default(e,p),c=0,u=1,a={x:0,y:.5};switch(n){case"left":a.x=1;break;case"up":c=1,u=0,a={x:0,y:1};break;case"down":c=1,u=0,a={x:0,y:0}}return new r.Animation(l({scale:{x:1},origin:a,duration:.6},o),{scale:{x:c,y:u}})};var f=["direction"];function O(e,r){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);r&&(n=n.filter((function(r){return Object.getOwnPropertyDescriptor(e,r).enumerable}))),t.push.apply(t,n)}return t}function y(e){for(var r=1;r<arguments.length;r++){var t=null!=arguments[r]?arguments[r]:{};r%2?O(Object(t),!0).forEach((function(r){o.default(e,r,t[r])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):O(Object(t)).forEach((function(r){Object.defineProperty(e,r,Object.getOwnPropertyDescriptor(t,r))}))}return e}function d(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};return d.use=d.use.bind(d,e),d}d.use=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},t=e.direction,n=void 0===t?"right":t,c=i.default(e,f);return["left","right","top","bottom"].includes(n)||(n="right"),new r.Animation(y({clip:o.default({},n,0)},c),{clip:o.default({},n,1)})},exports.Move=r.Move,exports.Pop=r.Pop,exports.Fade=a,exports.Scale=b,exports.Wipe=d;
