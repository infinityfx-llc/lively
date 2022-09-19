"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var e=require("@babel/runtime/helpers/classCallCheck"),t=require("@babel/runtime/helpers/createClass"),r=require("@babel/runtime/helpers/get"),n=require("@babel/runtime/helpers/inherits"),i=require("@babel/runtime/helpers/possibleConstructorReturn"),a=require("@babel/runtime/helpers/getPrototypeOf"),o=require("@babel/runtime/helpers/defineProperty"),u=require("./animatable-96d26e6a.js"),l=require("react"),s=require("./link-27893881.js"),c=require("./animation-ebe42adf.js"),p=require("@babel/runtime/helpers/toConsumableArray"),f=require("./scroll-22eb6b9a.js");function d(e){return e&&"object"==typeof e&&"default"in e?e:{default:e}}require("./events-d2682977.js"),require("@babel/runtime/helpers/typeof"),require("@babel/runtime/helpers/slicedToArray"),require("@babel/runtime/helpers/objectWithoutProperties");var h=d(e),y=d(t),m=d(r),v=d(n),b=d(i),g=d(a),O=d(o),P=d(l),j=d(p);function w(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function E(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?w(Object(r),!0).forEach((function(t){O.default(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):w(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function A(e,t){var r="undefined"!=typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(!r){if(Array.isArray(e)||(r=function(e,t){if(!e)return;if("string"==typeof e)return R(e,t);var r=Object.prototype.toString.call(e).slice(8,-1);"Object"===r&&e.constructor&&(r=e.constructor.name);if("Map"===r||"Set"===r)return Array.from(e);if("Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r))return R(e,t)}(e))||t&&e&&"number"==typeof e.length){r&&(e=r);var n=0,i=function(){};return{s:i,n:function(){return n>=e.length?{done:!0}:{done:!1,value:e[n++]}},e:function(e){throw e},f:i}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var a,o=!0,u=!1;return{s:function(){r=r.call(e)},n:function(){var e=r.next();return o=e.done,e},e:function(e){u=!0,a=e},f:function(){try{o||null==r.return||r.return()}finally{if(u)throw a}}}}function R(e,t){(null==t||t>e.length)&&(t=e.length);for(var r=0,n=new Array(t);r<t;r++)n[r]=e[r];return n}function x(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}();return function(){var r,n=g.default(e);if(t){var i=g.default(this).constructor;r=Reflect.construct(n,arguments,i)}else r=n.apply(this,arguments);return b.default(this,r)}}var k={},q=function(e){v.default(r,e);var t=x(r);function r(e){var n;return h.default(this,r),(n=t.call(this,e)).animations={default:new c.Clip({},{opacity:+e.active,pointerEvents:e.active?"":"none"}),unmorph:new c.Clip({},{opacity:0,pointerEvents:"none"})},n.properties=s.subArray(n.props.include,n.props.exclude),n.uuid=(e.id||0)+e.group.toString(),n}return y.default(r,[{key:"shouldComponentUpdate",value:function(e){return this.props.active!==e.active&&(this.uuid in k?k[this.uuid].push(this):k[this.uuid]=[this]),this.props.active!==e.active}},{key:"getSnapshotBeforeUpdate",value:function(e){if(this.props.active!==e.active&&this.props.active){var t,r=A(k[this.uuid]);try{for(r.s();!(t=r.n()).done;){var n=t.value;if(n!==this)return s.getSnapshot(n.elements[0],this.props.group)}}catch(e){r.e(e)}finally{r.f()}}return null}},{key:"componentDidUpdate",value:function(e,t,n){if(m.default(g.default(r.prototype),"componentDidUpdate",this).call(this),k[this.uuid]=[],n){var i=s.getSnapshot(this.elements[0],this.props.group);i.opacity=1,i.pointerEvents="",this.manager.play(c.computeMorph(i,n,this.properties,this.props.duration),{composite:!0})}else this.manager.initialize(this.animations.unmorph)}},{key:"render",value:function(){var e=this.props.children;if(s.is.array(e)){if(e.length>1)return e;e=e[0]}return l.isValidElement(e)?m.default(g.default(r.prototype),"render",this).call(this):e}}]),r}(u.Animatable);function S(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}();return function(){var r,n=g.default(e);if(t){var i=g.default(this).constructor;r=Reflect.construct(n,arguments,i)}else r=n.apply(this,arguments);return b.default(this,r)}}O.default(q,"cascadingProps",["id","duration"]),O.default(q,"defaultProps",E(E({},u.Animatable.defaultProps),{},{active:!1,include:s.MORPH_PROPERTIES,exclude:[]}));var C=function(e){v.default(r,e);var t=S(r);function r(e){var n;return h.default(this,r),(n=t.call(this,e)).children=[],n.properties=s.subArray(n.props.include,n.props.exclude),n}return y.default(r,[{key:"getSnapshotBeforeUpdate",value:function(){return this.children.map((function(e){var t=null==e?void 0:e.elements[0];return t?{data:s.getSnapshot(t),key:e.props.layoutKey}:null}))}},{key:"componentDidUpdate",value:function(e,t,r){for(var n=0,i=0;n<r.length;n++,i++){var a=this.children[i];if(a&&a.elements[0]){var o=r[n];if(o&&a.props.layoutKey===o.key){var u=s.getSnapshot(a.elements[0]);a.manager.play(c.computeMorph(u,o.data,this.properties,this.props.duration),{composite:!0})}else i--}}}},{key:"render",value:function(){var e=this;return this.childIndex=0,l.Children.map(this.props.children,(function(t){if(!l.isValidElement(t)||!u.Animatable.isInstance(t))return t;var r=e.childIndex++;return l.cloneElement(t,{ref:function(t){return e.children[r]=t},layoutKey:t.key})}))}}]),r}(l.Component);function I(e){var t=e.children,r=e.className,n=e.style,i=e.duration;if(!s.is.string(t))return t;var a=t.split("");return P.default.createElement("div",{className:r,style:n},P.default.createElement(u.Animatable,{whileViewport:!0,animate:{opacity:1,translate:{y:0},rotate:0,duration:.8},initial:{opacity:0,translate:{y:"100%"},rotate:10},stagger:(i-.8)/(a.length-1)},a.map((function(e,t){return P.default.createElement("span",{style:{display:"inline-block"},key:t},/\s/.test(e)?" ":e)}))))}function M(e){var t,r=e.children,n=e.color,i=e.duration,a=(null===(t=r.props)||void 0===t?void 0:t.children)||[];Array.isArray(a)||(a=[a]);var o=[P.default.createElement(u.Animatable,{key:0,initial:{clip:{right:0}},animate:{clip:{left:1},duration:i/2}},P.default.createElement("div",{style:{position:"absolute",inset:0,backgroundColor:n}}))].concat(j.default(a));return P.default.createElement(u.Animatable,{whileViewport:!0,animate:{clip:{right:0},duration:i/2},initial:{clip:{right:1}}},l.cloneElement(r,{},o))}function B(e){var t,r=e.children,n=e.amount,i=f.useScroll(),a=l.useRef();return P.default.createElement(u.Animatable,{ref:a,animate:{translate:i((function(e){if(void 0===t){var r,i=null===(r=a.current)||void 0===r?void 0:r.elements[0];i&&(t=Math.max(i.getBoundingClientRect().y+window.scrollY-window.innerHeight/2,0))}return{x:0,y:(e-(t||0))*n}}))}},r)}O.default(C,"defaultProps",{include:s.MORPH_PROPERTIES,exclude:[]}),I.defaultProps={style:{},className:"",duration:1.6},M.defaultProps={color:"grey",duration:1.6},B.defaultProps={amount:.5},exports.ColorWipe=M,exports.LayoutGroup=C,exports.Morph=q,exports.Parallax=B,exports.WriteOn=I;
