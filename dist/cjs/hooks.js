"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var e=require("@babel/runtime/helpers/slicedToArray"),r=require("react"),t=require("./link-dec44b74.js"),u=require("./scroll-a45008a4.js");function n(e){return e&&"object"==typeof e&&"default"in e?e:{default:e}}require("@babel/runtime/helpers/typeof"),require("./events-c8a1692d.js");var s=n(e);exports.useScroll=u.useScroll,exports.useLink=function(e){var r=t.Link.create(e);return[r,r.set]},exports.usePath=function(){var e=r.useRef();return[r.useCallback((function(r,t){if(!e.current)return{x:0,y:0};var u=e.current.getTotalLength()*r/t,n=e.current.getPointAtLength(u);return{x:n.x,y:n.y}}),[e]),e]},exports.useUnmount=function(e){var t=r.useState(e),u=s.default(t,2),n=u[0],a=u[1],i=r.useRef();return[n,function(){if(!n)return a(!0);i.current.play(i.current.props.onUnmount,{reverse:!0,immediate:!0,callback:function(){return a(!1)}})},i]};
