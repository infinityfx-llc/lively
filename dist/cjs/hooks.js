"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var e=require("@babel/runtime/helpers/slicedToArray"),r=require("react"),t=require("./scroll-c6918c92.js");function n(e){return e&&"object"==typeof e&&"default"in e?e:{default:e}}require("./events-3eb4d8ea.js"),require("./link-6ddefb82.js"),require("@babel/runtime/helpers/typeof"),require("@babel/runtime/helpers/defineProperty");var u=n(e);exports.useLink=t.useLink,exports.useScroll=t.useScroll,exports.usePath=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[0,0],t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:1,n=r.useRef(),u=r.useCallback((function(r,u){if(!n.current)return{x:0,y:0};var i=n.current.getTotalLength()*r/u,o=n.current.getPointAtLength(i),s=o.x,c=o.y;return{x:e[0]+s*t,y:e[1]+c*t}}),[n]);return[u,n]},exports.useReducedMotion=function(){var e=r.useState(!1),t=u.default(e,2),n=t[0],i=t[1],o=function(e){return i(e.matches)};return r.useEffect((function(){var e=matchMedia("(prefers-reduced-motion: reduce)");return e.addEventListener("change",o),i(e.matches),function(){return e.removeEventListener("change",o)}}),[]),n},exports.useUnmount=function(e){var t=r.useState(e),n=u.default(t,2),i=n[0],o=n[1],s=r.useRef();return[i,function(){var e;if(!i)return o(!0);null===(e=s.current)||void 0===e||e.play(s.current.props.onUnmount,{reverse:!0,immediate:!0,callback:function(){return o(!1)}})},s]};
