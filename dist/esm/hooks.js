import r from"@babel/runtime/helpers/slicedToArray";import{useState as e,useRef as t,useCallback as n,useEffect as o}from"react";import{L as i}from"./link-6e5a534b.js";export{u as useScroll}from"./scroll-c0dcb5a9.js";import"@babel/runtime/helpers/typeof";import"@babel/runtime/helpers/defineProperty";import"./events-024928fc.js";function c(n){var o=e(n),u=r(o,2),i=u[0],c=u[1],a=t();return[i,function(){if(!i)return c(!0);a.current.play(a.current.props.onUnmount,{reverse:!0,immediate:!0,callback:function(){return c(!1)}})},a]}function a(r){var e=i.create(r);return[e,e.set]}function m(){var r=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[0,0],e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:1,o=t(),u=n((function(t,n){if(!o.current)return{x:0,y:0};var u=o.current.getTotalLength()*t/n,i=o.current.getPointAtLength(u),c=i.x,a=i.y;return{x:r[0]+c*e,y:r[1]+a*e}}),[o]);return[u,o]}function f(){var t=e(!1),n=r(t,2),u=n[0],i=n[1],c=function(r){return i(r.matches)};return o((function(){var r=matchMedia("(prefers-reduced-motion: reduce)");return r.addEventListener("change",c),i(r.matches),function(){return r.removeEventListener("change",c)}}),[]),u}export{a as useLink,m as usePath,f as useReducedMotion,c as useUnmount};
