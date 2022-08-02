"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var e=require("@babel/runtime/helpers/extends"),t=require("@babel/runtime/helpers/objectWithoutProperties"),r=require("@babel/runtime/helpers/classCallCheck"),n=require("@babel/runtime/helpers/createClass"),i=require("@babel/runtime/helpers/inherits"),a=require("@babel/runtime/helpers/possibleConstructorReturn"),l=require("@babel/runtime/helpers/getPrototypeOf"),o=require("@babel/runtime/helpers/defineProperty"),u=require("react"),s=require("./animatable-af96fb98.js"),c=require("./pop-241f383a.js"),p=require("./helper-dfb168a5.js"),f=require("@babel/runtime/helpers/toConsumableArray"),d=require("./scroll-fd4c118f.js");function m(e){return e&&"object"==typeof e&&"default"in e?e:{default:e}}require("@babel/runtime/helpers/typeof"),require("@babel/runtime/helpers/slicedToArray"),require("@babel/runtime/helpers/asyncToGenerator"),require("@babel/runtime/regenerator"),require("./animation-c1347465.js"),require("./link-884ecbbe.js");var b=m(e),h=m(t),y=m(r),v=m(n),g=m(i),O=m(a),j=m(l),q=m(o),P=m(u),w=m(f),A=["levels","animations"];function k(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function E(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?k(Object(r),!0).forEach((function(t){q.default(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):k(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function C(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}();return function(){var r,n=j.default(e);if(t){var i=j.default(this).constructor;r=Reflect.construct(n,arguments,i)}else r=n.apply(this,arguments);return O.default(this,r)}}var x=function(e){g.default(r,e);var t=C(r);function r(e){var n;return y.default(this,r),(n=t.call(this,e)).levels=n.props.levels,n.animations=p.padArray(n.props.animations,n.levels),n}return v.default(r,[{key:"makeAnimatable",value:function(e){var t=this,r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:1;if(r<1||u.Children.count(e)<1)return e;var n=this.props;n.levels,n.animations;var i=h.default(n,A),a=this.animations[this.levels-r];return r===this.levels&&(i.ref=function(e){return t.animatable=e}),P.default.createElement(s.Animatable,b.default({animate:a},i),u.Children.map(e,(function(e){return u.isValidElement(e)?u.cloneElement(e,{},t.makeAnimatable(e.props.children,r-1)):e})))}},{key:"play",value:function(e){var t,r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};null===(t=this.animatable)||void 0===t||t.play(e,E({},r))}},{key:"render",value:function(){return this.makeAnimatable(this.props.children,this.levels)}}]),r}(u.Component);function R(e){var t=e.children,r=e.className,n=e.style,i=e.duration;if("string"!=typeof t)return t;var a=t.split("");return P.default.createElement("div",{className:r,style:n},P.default.createElement(s.Animatable,{whileViewport:!0,animate:{opacity:1,position:{y:0},rotation:0,duration:.8},initial:{opacity:0,position:{y:"100%"},rotation:10},stagger:(i-.8)/(a.length-1)},a.map((function(e,t){return P.default.createElement("span",{style:{display:"inline-block"},key:t},/\s/.test(e)?" ":e)}))))}function D(e){var t,r=e.children,n=e.color,i=e.duration,a=(null===(t=r.props)||void 0===t?void 0:t.children)||[];Array.isArray(a)||(a=[a]);var l=[P.default.createElement(s.Animatable,{key:0,initial:{clip:{right:0}},animate:{clip:{left:1},duration:i/2}},P.default.createElement("div",{style:{position:"absolute",inset:0,backgroundColor:n}}))].concat(w.default(a));return P.default.createElement(s.Animatable,{whileViewport:!0,animate:{clip:{right:0},duration:i/2},initial:{clip:{right:1}}},u.cloneElement(r,{},l))}function M(e){var t,r=e.children,n=e.amount,i=d.useScroll(),a=u.useRef();return P.default.createElement(s.Animatable,{ref:a,animate:{position:i((function(e){if(void 0===t){var r,i=null===(r=a.current)||void 0===r?void 0:r.elements[0];i&&(t=Math.max(i.getBoundingClientRect().y+window.scrollY-window.innerHeight/2,0))}return{x:0,y:(e-(t||0))*n}}))}},r)}q.default(x,"defaultProps",{levels:1,stagger:.1,viewportMargin:.25,animations:[c.Move,c.Pop]}),R.defaultProps={style:{},className:"",duration:1.6},D.defaultProps={color:"grey",duration:1.6},M.defaultProps={amount:.5},exports.Animate=x,exports.ColorWipe=D,exports.Parallax=M,exports.WriteOn=R;
