"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var e=require("react"),r=require("./animatable-a91f1a70.js"),t=require("./link-1fcb35b9.js"),i=require("@babel/runtime/helpers/toConsumableArray"),a=require("./scroll-694df9ab.js");function l(e){return e&&"object"==typeof e&&"default"in e?e:{default:e}}require("@babel/runtime/helpers/classCallCheck"),require("@babel/runtime/helpers/createClass"),require("@babel/runtime/helpers/inherits"),require("@babel/runtime/helpers/possibleConstructorReturn"),require("@babel/runtime/helpers/getPrototypeOf"),require("@babel/runtime/helpers/defineProperty"),require("./animation-0991e102.js"),require("@babel/runtime/helpers/slicedToArray"),require("@babel/runtime/helpers/objectWithoutProperties"),require("./events-79e2d541.js"),require("@babel/runtime/helpers/typeof");var n=l(e),u=l(i);function o(e){var i=e.children,a=e.className,l=e.style,u=e.duration;if(!t.is.string(i))return i;var o=i.split("");return n.default.createElement("div",{className:a,style:l},n.default.createElement(r.Animatable,{whileViewport:!0,animate:{opacity:1,translate:{y:0},rotate:0,duration:.8},initial:{opacity:0,translate:{y:"100%"},rotate:10},stagger:(u-.8)/(o.length-1)},o.map((function(e,r){return n.default.createElement("span",{style:{display:"inline-block"},key:r},/\s/.test(e)?" ":e)}))))}function s(t){var i,a=t.children,l=t.color,o=t.duration,s=(null===(i=a.props)||void 0===i?void 0:i.children)||[];Array.isArray(s)||(s=[s]);var c=[n.default.createElement(r.Animatable,{key:0,initial:{clip:{right:0}},animate:{clip:{left:1},duration:o/2}},n.default.createElement("div",{style:{position:"absolute",inset:0,backgroundColor:l}}))].concat(u.default(s));return n.default.createElement(r.Animatable,{whileViewport:!0,animate:{clip:{right:0},duration:o/2},initial:{clip:{right:1}}},e.cloneElement(a,{},c))}function c(t){var i,l=t.children,u=t.amount,o=a.useScroll(),s=e.useRef();return n.default.createElement(r.Animatable,{ref:s,animate:{translate:o((function(e){if(void 0===i){var r,t=null===(r=s.current)||void 0===r?void 0:r.elements[0];t&&(i=Math.max(t.getBoundingClientRect().y+window.scrollY-window.innerHeight/2,0))}return{x:0,y:(e-(i||0))*u}}))}},l)}o.defaultProps={style:{},className:"",duration:1.6},s.defaultProps={color:"grey",duration:1.6},c.defaultProps={amount:.5},exports.ColorWipe=s,exports.Parallax=c,exports.WriteOn=o;
