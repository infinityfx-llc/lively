"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var e=require("@babel/runtime/helpers/extends"),t=require("@babel/runtime/helpers/objectWithoutProperties"),r=require("@babel/runtime/helpers/classCallCheck"),n=require("@babel/runtime/helpers/createClass"),i=require("@babel/runtime/helpers/inherits"),a=require("@babel/runtime/helpers/possibleConstructorReturn"),l=require("@babel/runtime/helpers/getPrototypeOf"),o=require("@babel/runtime/helpers/defineProperty"),u=require("react"),s=require("./animatable-d009f7a4.js"),c=require("./pop-5f5570ea.js"),p=require("./animation-17c28276.js"),f=require("@babel/runtime/helpers/toConsumableArray");function m(e){return e&&"object"==typeof e&&"default"in e?e:{default:e}}require("@babel/runtime/helpers/slicedToArray"),require("@babel/runtime/helpers/asyncToGenerator"),require("@babel/runtime/helpers/typeof"),require("@babel/runtime/regenerator");var d=m(e),b=m(t),h=m(r),y=m(n),v=m(i),g=m(a),O=m(l),j=m(o),q=m(u),P=m(f),k=["levels","animations"];function A(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function E(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?A(Object(r),!0).forEach((function(t){j.default(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):A(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function w(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}();return function(){var r,n=O.default(e);if(t){var i=O.default(this).constructor;r=Reflect.construct(n,arguments,i)}else r=n.apply(this,arguments);return g.default(this,r)}}var C=function(e){v.default(r,e);var t=w(r);function r(e){var n;return h.default(this,r),(n=t.call(this,e)).levels=n.props.levels,n.animations=p.padArray(n.props.animations,n.levels),n}return y.default(r,[{key:"makeAnimatable",value:function(e){var t=this,r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:1;if(r<1||u.Children.count(e)<1)return e;var n=this.props;n.levels,n.animations;var i=b.default(n,k),a=this.animations[this.levels-r];return r===this.levels&&(i.ref=function(e){return t.animatable=e}),q.default.createElement(s.Animatable,d.default({animate:a},i),u.Children.map(e,(function(e){return u.isValidElement(e)?u.cloneElement(e,{},t.makeAnimatable(e.props.children,r-1)):e})))}},{key:"play",value:function(e){var t,r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};null===(t=this.animatable)||void 0===t||t.play(e,E({},r))}},{key:"shouldComponentUpdate",value:function(e){return e.animations===this.props.animations}},{key:"render",value:function(){return this.makeAnimatable(this.props.children,this.levels)}}]),r}(u.Component);function x(e){var t=e.children,r=e.className,n=e.style,i=e.duration;if("string"!=typeof t)return t;var a=t.split("");return q.default.createElement("div",{className:r,style:n},q.default.createElement(s.Animatable,{whileViewport:!0,animate:{opacity:1,position:{y:0},rotation:0,duration:.8},initial:{opacity:0,position:{y:"100%"},rotation:10},stagger:(i-.8)/(a.length-1)},a.map((function(e,t){return q.default.createElement("span",{style:{display:"inline-block"},key:t},/\s/.test(e)?" ":e)}))))}function R(e){var t,r=e.children,n=e.color,i=e.duration,a=(null===(t=r.props)||void 0===t?void 0:t.children)||[];Array.isArray(a)||(a=[a]);var l=[q.default.createElement(s.Animatable,{key:0,initial:{clip:{right:0}},animate:{clip:{left:1},duration:i/2}},q.default.createElement("div",{style:{position:"absolute",inset:0,backgroundColor:n}}))].concat(P.default(a));return q.default.createElement(s.Animatable,{whileViewport:!0,animate:{clip:{right:0},duration:i/2},initial:{clip:{right:1}}},u.cloneElement(r,{},l))}j.default(C,"defaultProps",{levels:1,stagger:.1,viewportMargin:.25,animations:[c.Move,c.Pop]}),x.defaultProps={style:{},className:"",duration:1.6},R.defaultProps={color:"grey",duration:1.6},exports.Animate=C,exports.ColorWipe=R,exports.WriteOn=x;
