import e,{cloneElement as t,useRef as r}from"react";import{A as i}from"./animatable-41be66c5.js";import{i as a}from"./link-6e5a534b.js";import n from"@babel/runtime/helpers/toConsumableArray";import{u as l}from"./scroll-c0dcb5a9.js";import"@babel/runtime/helpers/classCallCheck";import"@babel/runtime/helpers/createClass";import"@babel/runtime/helpers/inherits";import"@babel/runtime/helpers/possibleConstructorReturn";import"@babel/runtime/helpers/getPrototypeOf";import"@babel/runtime/helpers/defineProperty";import"./animation-28142c56.js";import"@babel/runtime/helpers/slicedToArray";import"@babel/runtime/helpers/objectWithoutProperties";import"./events-024928fc.js";import"@babel/runtime/helpers/typeof";function o(t){var r=t.children,n=t.className,l=t.style,o=t.duration;if(!a.string(r))return r;var s=r.split("");return e.createElement("div",{className:n,style:l},e.createElement(i,{whileViewport:!0,animate:{opacity:1,translate:{y:0},rotate:0,duration:.8},initial:{opacity:0,translate:{y:"100%"},rotate:10},stagger:(o-.8)/(s.length-1)},s.map((function(t,r){return e.createElement("span",{style:{display:"inline-block"},key:r},/\s/.test(t)?" ":t)}))))}function s(r){var a,l=r.children,o=r.color,s=r.duration,m=(null===(a=l.props)||void 0===a?void 0:a.children)||[];Array.isArray(m)||(m=[m]);var p=[e.createElement(i,{key:0,initial:{clip:{right:0}},animate:{clip:{left:1},duration:s/2}},e.createElement("div",{style:{position:"absolute",inset:0,backgroundColor:o}}))].concat(n(m));return e.createElement(i,{whileViewport:!0,animate:{clip:{right:0},duration:s/2},initial:{clip:{right:1}}},t(l,{},p))}function m(t){var a,n=t.children,o=t.amount,s=l(),m=r();return e.createElement(i,{ref:m,animate:{translate:s((function(e){if(void 0===a){var t,r=null===(t=m.current)||void 0===t?void 0:t.elements[0];r&&(a=Math.max(r.getBoundingClientRect().y+window.scrollY-window.innerHeight/2,0))}return{x:0,y:(e-(a||0))*o}}))}},n)}o.defaultProps={style:{},className:"",duration:1.6},s.defaultProps={color:"grey",duration:1.6},m.defaultProps={amount:.5};export{s as ColorWipe,m as Parallax,o as WriteOn};
