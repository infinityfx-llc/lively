import r from"@babel/runtime/helpers/slicedToArray";import{useState as e,useRef as t}from"react";import{L as o}from"./link-67981677.js";export{u as useScroll}from"./scroll-efaeb330.js";import"./helper-ef605e17.js";import"@babel/runtime/helpers/defineProperty";import"@babel/runtime/helpers/typeof";function n(o){var n=e(o),i=r(n,2),p=i[0],u=i[1],l=t();return[p,function(){var r;if(!p)return u(!0);null!==(r=l.current)&&void 0!==r&&r.props.onUnmount&&l.current.play(l.current.props.onUnmount,{reverse:!0,immediate:!0,callback:function(){return u(!1)}})},l]}function i(r){var e=o.create(r);return[e,e.feed]}export{i as useAnimation,n as useUnmount};
