import e from"@babel/runtime/helpers/extends";import t from"@babel/runtime/helpers/objectWithoutProperties";import r from"@babel/runtime/helpers/classCallCheck";import n from"@babel/runtime/helpers/createClass";import i from"@babel/runtime/helpers/inherits";import o from"@babel/runtime/helpers/possibleConstructorReturn";import a from"@babel/runtime/helpers/getPrototypeOf";import l from"@babel/runtime/helpers/defineProperty";import s,{Children as p,isValidElement as c,cloneElement as u,Component as m}from"react";import{A as f}from"./animatable-5a5cc57a.js";import{M as b,P as h}from"./pop-44383c68.js";import{p as y}from"./animation-59aec53f.js";import v from"@babel/runtime/helpers/toConsumableArray";import"@babel/runtime/helpers/slicedToArray";import"@babel/runtime/helpers/asyncToGenerator";import"@babel/runtime/helpers/typeof";import"@babel/runtime/regenerator";var d=["levels","animations"];function g(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function O(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?g(Object(r),!0).forEach((function(t){l(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):g(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function P(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}();return function(){var r,n=a(e);if(t){var i=a(this).constructor;r=Reflect.construct(n,arguments,i)}else r=n.apply(this,arguments);return o(this,r)}}var j=function(o){i(l,m);var a=P(l);function l(e){var t;return r(this,l),(t=a.call(this,e)).levels=t.props.levels,t.animations=y(t.props.animations,t.levels),t}return n(l,[{key:"makeAnimatable",value:function(r){var n=this,i=arguments.length>1&&void 0!==arguments[1]?arguments[1]:1;if(i<1||p.count(r)<1)return r;var o=this.props;o.levels,o.animations;var a=t(o,d),l=this.animations[this.levels-i];return i===this.levels&&(a.ref=function(e){return n.animatable=e}),s.createElement(f,e({animate:l},a),p.map(r,(function(e){return c(e)?u(e,{},n.makeAnimatable(e.props.children,i-1)):e})))}},{key:"play",value:function(e){var t,r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};null===(t=this.animatable)||void 0===t||t.play(e,O({},r))}},{key:"shouldComponentUpdate",value:function(e){return e.animations===this.props.animations}},{key:"render",value:function(){return this.makeAnimatable(this.props.children,this.levels)}}]),l}();function k(e){var t=e.children,r=e.className,n=e.style,i=e.duration;if("string"!=typeof t)return t;var o=t.split("");return s.createElement("div",{className:r,style:n},s.createElement(f,{whileViewport:!0,animate:{opacity:1,position:{y:0},rotation:0,duration:.8},initial:{opacity:0,position:{y:"100%"},rotation:10},stagger:(i-.8)/(o.length-1)},o.map((function(e,t){return s.createElement("span",{style:{display:"inline-block"},key:t},/\s/.test(e)?" ":e)}))))}function w(e){var t,r=e.children,n=e.color,i=e.duration,o=(null===(t=r.props)||void 0===t?void 0:t.children)||[];Array.isArray(o)||(o=[o]);var a=[s.createElement(f,{key:0,initial:{clip:{right:0}},animate:{clip:{left:1},duration:i/2}},s.createElement("div",{style:{position:"absolute",inset:0,backgroundColor:n}}))].concat(v(o));return s.createElement(f,{whileViewport:!0,animate:{clip:{right:0},duration:i/2},initial:{clip:{right:1}}},u(r,{},a))}l(j,"defaultProps",{levels:1,stagger:.1,viewportMargin:.25,animations:[b,h]}),k.defaultProps={style:{},className:"",duration:1.6},w.defaultProps={color:"grey",duration:1.6};export{j as Animate,w as ColorWipe,k as WriteOn};
