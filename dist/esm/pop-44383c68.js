import e from"@babel/runtime/helpers/defineProperty";import t from"@babel/runtime/helpers/objectWithoutProperties";import{a as r}from"./animation-59aec53f.js";var n=["direction"];function o(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function i(t){for(var r=1;r<arguments.length;r++){var n=null!=arguments[r]?arguments[r]:{};r%2?o(Object(n),!0).forEach((function(r){e(t,r,n[r])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(n,e))}))}return t}function c(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};return c.use=c.use.bind(c,e),c}function p(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function a(t){for(var r=1;r<arguments.length;r++){var n=null!=arguments[r]?arguments[r]:{};r%2?p(Object(n),!0).forEach((function(r){e(t,r,n[r])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(n)):p(Object(n)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(n,e))}))}return t}function s(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};return s.use=s.use.bind(s,e),s}c.use=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},o=e.direction,c=void 0===o?"up":o,p=t(e,n),a="0px",s="20px";switch(c){case"down":s="-20px";break;case"left":a="20px",s="0px";break;case"right":a="-20px",s="0px"}return new r(i({position:{x:"0px",y:"0px"},opacity:1,duration:.5},p),{position:{x:a,y:s},opacity:0})},s.use=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};return new r(a({opacity:1,scale:1,duration:.25},e),{opacity:0,scale:.85})};export{c as M,s as P};