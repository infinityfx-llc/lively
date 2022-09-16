"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var e=require("@babel/runtime/helpers/slicedToArray"),r=require("react"),t=require("./link-e8e87adf.js"),n=require("./scroll-89216acd.js");function u(e){return e&&"object"==typeof e&&"default"in e?e:{default:e}}require("@babel/runtime/helpers/typeof"),require("@babel/runtime/helpers/defineProperty"),require("./events-71b942e1.js");var i=u(e);exports.useScroll=n.useScroll,exports.useLink=function(e){var r=t.Link.create(e);return[r,r.set]},exports.usePath=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[0,0],t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:1,n=r.useRef(),u=r.useCallback((function(r,u){if(!n.current)return{x:0,y:0};var i=n.current.getTotalLength()*r/u,o=n.current.getPointAtLength(i),a=o.x,c=o.y;return{x:e[0]+a*t,y:e[1]+c*t}}),[n]);return[u,n]},exports.useReducedMotion=function(){var e=r.useState(!1),t=i.default(e,2),n=t[0],u=t[1],o=function(e){return u(e.matches)};return r.useEffect((function(){var e=matchMedia("(prefers-reduced-motion: reduce)");return e.addEventListener("change",o),u(e.matches),function(){return e.removeEventListener("change",o)}}),[]),n},exports.useUnmount=function(e){var t=r.useState(e),n=i.default(t,2),u=n[0],o=n[1],a=r.useRef();return[u,function(){if(!u)return o(!0);a.current.play(a.current.props.onUnmount,{reverse:!0,immediate:!0,callback:function(){return o(!1)}})},a]};
