import e from"@babel/runtime/helpers/defineProperty";import{a as r}from"./animation-3fd518a9.js";export{M as Move,P as Pop}from"./pop-4afee907.js";import t from"@babel/runtime/helpers/objectWithoutProperties";import"@babel/runtime/helpers/asyncToGenerator";import"@babel/runtime/helpers/slicedToArray";import"@babel/runtime/helpers/toConsumableArray";import"@babel/runtime/helpers/typeof";import"@babel/runtime/helpers/classCallCheck";import"@babel/runtime/helpers/createClass";import"@babel/runtime/regenerator";function n(e,r){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);r&&(n=n.filter((function(r){return Object.getOwnPropertyDescriptor(e,r).enumerable}))),t.push.apply(t,n)}return t}function o(r){for(var t=1;t<arguments.length;t++){var o=null!=arguments[t]?arguments[t]:{};t%2?n(Object(o),!0).forEach((function(t){e(r,t,o[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(r,Object.getOwnPropertyDescriptors(o)):n(Object(o)).forEach((function(e){Object.defineProperty(r,e,Object.getOwnPropertyDescriptor(o,e))}))}return r}function i(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};return i.use=i.use.bind(i,e),i}i.use=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};return new r(o({opacity:1,duration:.65},e),{opacity:0})};var c=["direction"];function p(e,r){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);r&&(n=n.filter((function(r){return Object.getOwnPropertyDescriptor(e,r).enumerable}))),t.push.apply(t,n)}return t}function a(r){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?p(Object(n),!0).forEach((function(t){e(r,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(r,Object.getOwnPropertyDescriptors(n)):p(Object(n)).forEach((function(e){Object.defineProperty(r,e,Object.getOwnPropertyDescriptor(n,e))}))}return r}function s(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};return s.use=s.use.bind(s,e),s}s.use=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},n=e.direction,o=void 0===n?"right":n,i=t(e,c),p=0,s=1,u={x:0,y:.5};switch(o){case"left":u.x=1;break;case"up":p=1,s=0,u={x:0,y:1};break;case"down":p=1,s=0,u={x:0,y:0}}return new r(a({scale:{x:1},origin:u,duration:.6},i),{scale:{x:p,y:s}})};var u=["direction"];function b(e,r){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);r&&(n=n.filter((function(r){return Object.getOwnPropertyDescriptor(e,r).enumerable}))),t.push.apply(t,n)}return t}function l(r){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?b(Object(n),!0).forEach((function(t){e(r,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(r,Object.getOwnPropertyDescriptors(n)):b(Object(n)).forEach((function(e){Object.defineProperty(r,e,Object.getOwnPropertyDescriptor(n,e))}))}return r}function f(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};return f.use=f.use.bind(f,e),f}f.use=function(){var n=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},o=n.direction,i=void 0===o?"right":o,c=t(n,u);return["left","right","top","bottom"].includes(i)||(i="right"),new r(l({clip:e({},i,0)},c),{clip:e({},i,1)})};export{i as Fade,s as Scale,f as Wipe};
