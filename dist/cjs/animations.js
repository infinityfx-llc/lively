"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var e=require("./animation-ebe42adf.js"),r=require("@babel/runtime/helpers/defineProperty"),t=require("./pop-8f3d8837.js"),n=require("@babel/runtime/helpers/objectWithoutProperties");function o(e){return e&&"object"==typeof e&&"default"in e?e:{default:e}}require("@babel/runtime/helpers/slicedToArray"),require("@babel/runtime/helpers/classCallCheck"),require("@babel/runtime/helpers/createClass"),require("@babel/runtime/helpers/inherits"),require("@babel/runtime/helpers/possibleConstructorReturn"),require("@babel/runtime/helpers/getPrototypeOf"),require("./link-27893881.js"),require("@babel/runtime/helpers/typeof");var i=o(r),c=o(n);function u(e,r){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);r&&(n=n.filter((function(r){return Object.getOwnPropertyDescriptor(e,r).enumerable}))),t.push.apply(t,n)}return t}function a(e){for(var r=1;r<arguments.length;r++){var t=null!=arguments[r]?arguments[r]:{};r%2?u(Object(t),!0).forEach((function(r){i.default(e,r,t[r])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):u(Object(t)).forEach((function(r){Object.defineProperty(e,r,Object.getOwnPropertyDescriptor(t,r))}))}return e}var p=e.Animation.create((function(e){return[a({opacity:1,duration:.65},e),{opacity:0}]})),s=["direction"];function b(e,r){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);r&&(n=n.filter((function(r){return Object.getOwnPropertyDescriptor(e,r).enumerable}))),t.push.apply(t,n)}return t}function l(e){for(var r=1;r<arguments.length;r++){var t=null!=arguments[r]?arguments[r]:{};r%2?b(Object(t),!0).forEach((function(r){i.default(e,r,t[r])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):b(Object(t)).forEach((function(r){Object.defineProperty(e,r,Object.getOwnPropertyDescriptor(t,r))}))}return e}var f=e.Animation.create((function(e){var r=e.direction,t=void 0===r?"right":r,n=c.default(e,s),o=0,i=1,u={x:0,y:.5};switch(t){case"left":u.x=1;break;case"up":o=1,i=0,u={x:0,y:1};break;case"down":o=1,i=0,u={x:0,y:0}}return[l({scale:{x:1},origin:u,duration:.6},n),{scale:{x:o,y:i}}]})),O=["direction"];function y(e,r){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);r&&(n=n.filter((function(r){return Object.getOwnPropertyDescriptor(e,r).enumerable}))),t.push.apply(t,n)}return t}function j(e){for(var r=1;r<arguments.length;r++){var t=null!=arguments[r]?arguments[r]:{};r%2?y(Object(t),!0).forEach((function(r){i.default(e,r,t[r])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):y(Object(t)).forEach((function(r){Object.defineProperty(e,r,Object.getOwnPropertyDescriptor(t,r))}))}return e}var d=e.Animation.create((function(e){var r=e.direction,t=void 0===r?"right":r,n=c.default(e,O);return["left","right","top","bottom"].includes(t)||(t="right"),[j({clip:i.default({},t,0)},n),{clip:i.default({},t,1)}]}));exports.Animation=e.Animation,exports.Move=t.Move,exports.Pop=t.Pop,exports.Fade=p,exports.Scale=f,exports.Wipe=d;
