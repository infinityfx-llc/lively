import e from"@babel/runtime/helpers/classCallCheck";import t from"@babel/runtime/helpers/createClass";import r from"@babel/runtime/helpers/inherits";import n from"@babel/runtime/helpers/possibleConstructorReturn";import i from"@babel/runtime/helpers/getPrototypeOf";import a from"@babel/runtime/helpers/defineProperty";import o,{Children as l,isValidElement as s,cloneElement as u,Component as c,useRef as p}from"react";import{A as m}from"./animatable-bd69423e.js";import{s as f,j as d,M as h,i as y}from"./link-3a0d1369.js";import{c as v}from"./animation-a20a5a5a.js";import b from"@babel/runtime/helpers/toConsumableArray";import{u as g}from"./scroll-d5f2acef.js";import"./events-d793abef.js";import"@babel/runtime/helpers/typeof";import"@babel/runtime/helpers/slicedToArray";import"@babel/runtime/helpers/objectWithoutProperties";function k(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}();return function(){var r,a=i(e);if(t){var o=i(this).constructor;r=Reflect.construct(a,arguments,o)}else r=a.apply(this,arguments);return n(this,r)}}var w=function(n){r(a,c);var i=k(a);function a(t){var r;return e(this,a),(r=i.call(this,t)).children=[],r.properties=f(r.props.include,r.props.ignore),r}return t(a,[{key:"getSnapshotBeforeUpdate",value:function(){return this.children.map((function(e){var t=null==e?void 0:e.elements[0];return t?{data:d(t),key:e.props.layoutKey}:null}))}},{key:"componentDidUpdate",value:function(e,t,r){for(var n=0,i=0;i<r.length;i++){var a=this.children[n];if(a&&a.elements[0]){var o=r[i];if(o&&a.props.layoutKey===o.key){var l=d(a.elements[0]);a.manager.play(v(l,o.data,this.properties),{composite:!0}),n++}}else n++}}},{key:"render",value:function(){var e=this;return this.childIndex=0,l.map(this.props.children,(function(t){if(!s(t)||!m.isInstance(t))return t;var r=e.childIndex++;return u(t,{ref:function(t){return e.children[r]=t},layoutKey:t.key})}))}}]),a}();function P(e){var t=e.children,r=e.className,n=e.style,i=e.duration;if(!y.string(t))return t;var a=t.split("");return o.createElement("div",{className:r,style:n},o.createElement(m,{whileViewport:!0,animate:{opacity:1,translate:{y:0},rotate:0,duration:.8},initial:{opacity:0,translate:{y:"100%"},rotate:10},stagger:(i-.8)/(a.length-1)},a.map((function(e,t){return o.createElement("span",{style:{display:"inline-block"},key:t},/\s/.test(e)?" ":e)}))))}function j(e){var t,r=e.children,n=e.color,i=e.duration,a=(null===(t=r.props)||void 0===t?void 0:t.children)||[];Array.isArray(a)||(a=[a]);var l=[o.createElement(m,{key:0,initial:{clip:{right:0}},animate:{clip:{left:1},duration:i/2}},o.createElement("div",{style:{position:"absolute",inset:0,backgroundColor:n}}))].concat(b(a));return o.createElement(m,{whileViewport:!0,animate:{clip:{right:0},duration:i/2},initial:{clip:{right:1}}},u(r,{},l))}function C(e){var t,r=e.children,n=e.amount,i=g(),a=p();return o.createElement(m,{ref:a,animate:{translate:i((function(e){if(void 0===t){var r,i=null===(r=a.current)||void 0===r?void 0:r.elements[0];i&&(t=Math.max(i.getBoundingClientRect().y+window.scrollY-window.innerHeight/2,0))}return{x:0,y:(e-(t||0))*n}}))}},r)}a(w,"defaultProps",{include:h,ignore:[]}),P.defaultProps={style:{},className:"",duration:1.6},j.defaultProps={color:"grey",duration:1.6},C.defaultProps={amount:.5};export{j as ColorWipe,w as LayoutGroup,C as Parallax,P as WriteOn};
