import e from"@babel/runtime/helpers/classCallCheck";import t from"@babel/runtime/helpers/createClass";import r from"@babel/runtime/helpers/get";import n from"@babel/runtime/helpers/inherits";import i from"@babel/runtime/helpers/possibleConstructorReturn";import o from"@babel/runtime/helpers/getPrototypeOf";import a from"@babel/runtime/helpers/defineProperty";import{A as l}from"./animatable-9057c824.js";import u,{isValidElement as c,Children as s,cloneElement as p,Component as f,useRef as h}from"react";import{s as d,k as m,i as y,l as v}from"./link-d312db50.js";import{C as b,c as g}from"./animation-917bbc34.js";import O from"@babel/runtime/helpers/toConsumableArray";import{u as w}from"./scroll-c1b912fb.js";import"./events-6da12fc3.js";import"@babel/runtime/helpers/typeof";import"@babel/runtime/helpers/slicedToArray";import"@babel/runtime/helpers/objectWithoutProperties";function j(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function P(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?j(Object(r),!0).forEach((function(t){a(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):j(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function k(e,t){var r="undefined"!=typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(!r){if(Array.isArray(e)||(r=function(e,t){if(!e)return;if("string"==typeof e)return x(e,t);var r=Object.prototype.toString.call(e).slice(8,-1);"Object"===r&&e.constructor&&(r=e.constructor.name);if("Map"===r||"Set"===r)return Array.from(e);if("Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r))return x(e,t)}(e))||t&&e&&"number"==typeof e.length){r&&(e=r);var n=0,i=function(){};return{s:i,n:function(){return n>=e.length?{done:!0}:{done:!1,value:e[n++]}},e:function(e){throw e},f:i}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var o,a=!0,l=!1;return{s:function(){r=r.call(e)},n:function(){var e=r.next();return a=e.done,e},e:function(e){l=!0,o=e},f:function(){try{a||null==r.return||r.return()}finally{if(l)throw o}}}}function x(e,t){(null==t||t>e.length)&&(t=e.length);for(var r=0,n=new Array(t);r<t;r++)n[r]=e[r];return n}function E(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}();return function(){var r,n=o(e);if(t){var a=o(this).constructor;r=Reflect.construct(n,arguments,a)}else r=n.apply(this,arguments);return i(this,r)}}var R={},A=function(i){n(u,l);var a=E(u);function u(t){var r;return e(this,u),(r=a.call(this,t)).animations={default:new b({},{opacity:+t.active,pointerEvents:t.active?"":"none"}),unmorph:new b({},{opacity:0,pointerEvents:"none"})},r.properties=d(r.props.include,r.props.exclude),r.uuid=(t.id||0).toString()+(t.index||0)+t.group,r}return t(u,[{key:"shouldComponentUpdate",value:function(e){return this.props.active!==e.active&&(this.uuid in R?R[this.uuid].push(this):R[this.uuid]=[this]),this.props.active!==e.active}},{key:"getSnapshotBeforeUpdate",value:function(e){if(this.props.active!==e.active&&this.props.active){var t,r=k(R[this.uuid]);try{for(r.s();!(t=r.n()).done;){var n=t.value;if(n!==this)return m(n.elements[0],this.props.group)}}catch(e){r.e(e)}finally{r.f()}}return null}},{key:"componentDidUpdate",value:function(e,t,n){if(r(o(u.prototype),"componentDidUpdate",this).call(this),R[this.uuid]=[],n){var i=m(this.elements[0],this.props.group);i.opacity=1,i.pointerEvents="",this.manager.play(g(i,n,this.properties,this.props.duration),{composite:!0})}else this.manager.initialize(this.animations.unmorph)}},{key:"render",value:function(){var e=this.props.children;if(y.array(e)){if(e.length>1)return e;e=e[0]}return c(e)?r(o(u.prototype),"render",this).call(this):e}}]),u}();function C(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}();return function(){var r,n=o(e);if(t){var a=o(this).constructor;r=Reflect.construct(n,arguments,a)}else r=n.apply(this,arguments);return i(this,r)}}a(A,"cascadingProps",["id","duration"]),a(A,"defaultProps",P(P({},l.defaultProps),{},{cascade:0,active:!1,include:v,exclude:[]}));var S=function(r){n(o,f);var i=C(o);function o(t){var r;return e(this,o),(r=i.call(this,t)).children=[],r.properties=d(r.props.include,r.props.exclude),r}return t(o,[{key:"getSnapshotBeforeUpdate",value:function(){return this.children.map((function(e){var t=null==e?void 0:e.elements[0];return t?{data:m(t),key:e.props.layoutKey}:null}))}},{key:"componentDidUpdate",value:function(e,t,r){for(var n=0,i=0;n<r.length;n++,i++){var o=this.children[i];if(o&&o.elements[0]){var a=r[n];if(a&&o.props.layoutKey===a.key){var l=m(o.elements[0]);o.manager.play(g(l,a.data,this.properties,this.props.duration),{composite:!0})}else i--}}}},{key:"render",value:function(){var e=this;return this.childIndex=0,s.map(this.props.children,(function(t){if(!c(t)||!l.isInstance(t))return t;var r=e.childIndex++;return p(t,{ref:function(t){return e.children[r]=t},layoutKey:t.key})}))}}]),o}();function B(e){var t=e.children,r=e.className,n=e.style,i=e.duration;if(!y.string(t))return t;var o=t.split("");return u.createElement("div",{className:r,style:n},u.createElement(l,{whileViewport:!0,animate:{opacity:1,translate:{y:0},rotate:0,duration:.8},initial:{opacity:0,translate:{y:"100%"},rotate:10},stagger:(i-.8)/(o.length-1)},o.map((function(e,t){return u.createElement("span",{style:{display:"inline-block"},key:t},/\s/.test(e)?" ":e)}))))}function D(e){var t,r=e.children,n=e.color,i=e.duration,o=(null===(t=r.props)||void 0===t?void 0:t.children)||[];Array.isArray(o)||(o=[o]);var a=[u.createElement(l,{key:0,initial:{clip:{right:0}},animate:{clip:{left:1},duration:i/2}},u.createElement("div",{style:{position:"absolute",inset:0,backgroundColor:n}}))].concat(O(o));return u.createElement(l,{whileViewport:!0,animate:{clip:{right:0},duration:i/2},initial:{clip:{right:1}}},p(r,{},a))}function U(e){var t,r=e.children,n=e.amount,i=w(),o=h();return u.createElement(l,{ref:o,animate:{translate:i((function(e){if(void 0===t){var r,i=null===(r=o.current)||void 0===r?void 0:r.elements[0];i&&(t=Math.max(i.getBoundingClientRect().y+window.scrollY-window.innerHeight/2,0))}return{x:0,y:(e-(t||0))*n}}))}},r)}a(S,"defaultProps",{include:v,exclude:[]}),B.defaultProps={style:{},className:"",duration:1.6},D.defaultProps={color:"grey",duration:1.6},U.defaultProps={amount:.5};export{D as ColorWipe,S as LayoutGroup,A as Morph,U as Parallax,B as WriteOn};
