import e from"@babel/runtime/helpers/slicedToArray";import{useState as r,useRef as t,useCallback as n,useEffect as o}from"react";export{u as useLink,a as useScroll}from"./scroll-9d408149.js";import"./events-6d11c253.js";import"./link-b3cf3dbe.js";import"@babel/runtime/helpers/typeof";import"@babel/runtime/helpers/defineProperty";function i(n){var o=r(n),i=e(o,2),u=i[0],c=i[1],a=t();return[u,function(){var e;if(!u)return c(!0);null===(e=a.current)||void 0===e||e.play(a.current.props.onUnmount,{reverse:!0,immediate:!0,callback:function(){return c(!1)}})},a]}function c(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[0,0],r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:1,o=t(),i=n((function(t,n){if(!o.current)return{x:0,y:0};var i=o.current.getTotalLength()*t/n,u=o.current.getPointAtLength(i),c=u.x,a=u.y;return{x:e[0]+c*r,y:e[1]+a*r}}),[o]);return[i,o]}function l(){var t=r(!1),n=e(t,2),i=n[0],u=n[1],c=function(e){return u(e.matches)};return o((function(){var e=matchMedia("(prefers-reduced-motion: reduce)");return e.addEventListener("change",c),u(e.matches),function(){return e.removeEventListener("change",c)}}),[]),i}export{c as usePath,l as useReducedMotion,i as useUnmount};
