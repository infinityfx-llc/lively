import{A as e}from"./animation-a20a5a5a.js";export{A as Animation}from"./animation-a20a5a5a.js";import r from"@babel/runtime/helpers/defineProperty";export{M as Move,P as Pop}from"./pop-ee2e99f3.js";import t from"@babel/runtime/helpers/objectWithoutProperties";import"@babel/runtime/helpers/slicedToArray";import"@babel/runtime/helpers/classCallCheck";import"@babel/runtime/helpers/createClass";import"@babel/runtime/helpers/inherits";import"@babel/runtime/helpers/possibleConstructorReturn";import"@babel/runtime/helpers/getPrototypeOf";import"./link-3a0d1369.js";import"@babel/runtime/helpers/typeof";function o(e,r){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);r&&(o=o.filter((function(r){return Object.getOwnPropertyDescriptor(e,r).enumerable}))),t.push.apply(t,o)}return t}function n(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?o(Object(n),!0).forEach((function(t){r(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(r){Object.defineProperty(e,r,Object.getOwnPropertyDescriptor(n,r))}))}return e}var i=e.create((function(e){return[n({opacity:1,duration:.65},e),{opacity:0}]})),c=["direction"];function p(e,r){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);r&&(o=o.filter((function(r){return Object.getOwnPropertyDescriptor(e,r).enumerable}))),t.push.apply(t,o)}return t}function a(e){for(var t=1;t<arguments.length;t++){var o=null!=arguments[t]?arguments[t]:{};t%2?p(Object(o),!0).forEach((function(t){r(e,t,o[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(o)):p(Object(o)).forEach((function(r){Object.defineProperty(e,r,Object.getOwnPropertyDescriptor(o,r))}))}return e}var s=e.create((function(e){var r=e.direction,o=void 0===r?"right":r,n=t(e,c),i=0,p=1,s={x:0,y:.5};switch(o){case"left":s.x=1;break;case"up":i=1,p=0,s={x:0,y:1};break;case"down":i=1,p=0,s={x:0,y:0}}return[a({scale:{x:1},origin:s,duration:.6},n),{scale:{x:i,y:p}}]})),b=["direction"];function l(e,r){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);r&&(o=o.filter((function(r){return Object.getOwnPropertyDescriptor(e,r).enumerable}))),t.push.apply(t,o)}return t}function u(e){for(var t=1;t<arguments.length;t++){var o=null!=arguments[t]?arguments[t]:{};t%2?l(Object(o),!0).forEach((function(t){r(e,t,o[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(o)):l(Object(o)).forEach((function(r){Object.defineProperty(e,r,Object.getOwnPropertyDescriptor(o,r))}))}return e}var O=e.create((function(e){var o=e.direction,n=void 0===o?"right":o,i=t(e,b);return["left","right","top","bottom"].includes(n)||(n="right"),[u({clip:r({},n,0)},i),{clip:r({},n,1)}]}));export{i as Fade,s as Scale,O as Wipe};
