import e from"@babel/runtime/helpers/extends";import t from"@babel/runtime/helpers/objectWithoutProperties";import r from"@babel/runtime/helpers/classCallCheck";import n from"@babel/runtime/helpers/createClass";import i from"@babel/runtime/helpers/inherits";import o from"@babel/runtime/helpers/possibleConstructorReturn";import a from"@babel/runtime/helpers/getPrototypeOf";import l from"@babel/runtime/helpers/defineProperty";import s,{Children as c,isValidElement as p,cloneElement as u,Component as m,useRef as f}from"react";import{A as b}from"./animatable-0f9adc1c.js";import{M as h,P as y}from"./pop-ee3fdaef.js";import{p as v}from"./helper-6ed90764.js";import d from"@babel/runtime/helpers/toConsumableArray";import{u as g}from"./scroll-84c1f46b.js";import"@babel/runtime/helpers/typeof";import"@babel/runtime/helpers/slicedToArray";import"@babel/runtime/helpers/asyncToGenerator";import"@babel/runtime/regenerator";import"./animation-9ea0228d.js";import"./link-67981677.js";var O=["levels","animations"];function j(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function P(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?j(Object(r),!0).forEach((function(t){l(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):j(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function w(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}();return function(){var r,n=a(e);if(t){var i=a(this).constructor;r=Reflect.construct(n,arguments,i)}else r=n.apply(this,arguments);return o(this,r)}}var k=function(o){i(l,m);var a=w(l);function l(e){var t;return r(this,l),(t=a.call(this,e)).levels=t.props.levels,t.animations=v(t.props.animations,t.levels),t}return n(l,[{key:"makeAnimatable",value:function(r){var n=this,i=arguments.length>1&&void 0!==arguments[1]?arguments[1]:1;if(i<1||c.count(r)<1)return r;var o=this.props;o.levels,o.animations;var a=t(o,O),l=this.animations[this.levels-i];return i===this.levels&&(a.ref=function(e){return n.animatable=e}),s.createElement(b,e({animate:l},a),c.map(r,(function(e){return p(e)?u(e,{},n.makeAnimatable(e.props.children,i-1)):e})))}},{key:"play",value:function(e){var t,r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};null===(t=this.animatable)||void 0===t||t.play(e,P({},r))}},{key:"render",value:function(){return this.makeAnimatable(this.props.children,this.levels)}}]),l}();function E(e){var t=e.children,r=e.className,n=e.style,i=e.duration;if("string"!=typeof t)return t;var o=t.split("");return s.createElement("div",{className:r,style:n},s.createElement(b,{whileViewport:!0,animate:{opacity:1,position:{y:0},rotation:0,duration:.8},initial:{opacity:0,position:{y:"100%"},rotation:10},stagger:(i-.8)/(o.length-1)},o.map((function(e,t){return s.createElement("span",{style:{display:"inline-block"},key:t},/\s/.test(e)?" ":e)}))))}function A(e){var t,r=e.children,n=e.color,i=e.duration,o=(null===(t=r.props)||void 0===t?void 0:t.children)||[];Array.isArray(o)||(o=[o]);var a=[s.createElement(b,{key:0,initial:{clip:{right:0}},animate:{clip:{left:1},duration:i/2}},s.createElement("div",{style:{position:"absolute",inset:0,backgroundColor:n}}))].concat(d(o));return s.createElement(b,{whileViewport:!0,animate:{clip:{right:0},duration:i/2},initial:{clip:{right:1}}},u(r,{},a))}function C(e){var t,r=e.children,n=e.amount,i=g(),o=f();return s.createElement(b,{ref:o,animate:{position:i((function(e){if(void 0===t){var r,i=null===(r=o.current)||void 0===r?void 0:r.elements[0];i&&(t=Math.max(i.getBoundingClientRect().y+window.scrollY-window.innerHeight/2,0))}return{x:0,y:(e-(t||0))*n}}))}},r)}l(k,"defaultProps",{levels:1,stagger:.1,viewportMargin:.25,animations:[h,y]}),E.defaultProps={style:{},className:"",duration:1.6},A.defaultProps={color:"grey",duration:1.6},C.defaultProps={amount:.5};export{k as Animate,A as ColorWipe,C as Parallax,E as WriteOn};
