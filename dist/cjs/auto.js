"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var e=require("@babel/runtime/helpers/classCallCheck"),t=require("@babel/runtime/helpers/createClass"),r=require("@babel/runtime/helpers/inherits"),n=require("@babel/runtime/helpers/possibleConstructorReturn"),i=require("@babel/runtime/helpers/getPrototypeOf"),a=require("@babel/runtime/helpers/defineProperty"),l=require("react"),u=require("./animatable-8307de1c.js"),o=require("./link-dbd7263b.js"),s=require("./animation-40126e7b.js"),c=require("@babel/runtime/helpers/toConsumableArray"),p=require("./scroll-40beab10.js");function d(e){return e&&"object"==typeof e&&"default"in e?e:{default:e}}require("./events-4b569c62.js"),require("@babel/runtime/helpers/typeof"),require("@babel/runtime/helpers/slicedToArray"),require("@babel/runtime/helpers/objectWithoutProperties");var f=d(e),h=d(t),m=d(r),y=d(n),b=d(i),v=d(a),g=d(l),q=d(c);function P(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}();return function(){var r,n=b.default(e);if(t){var i=b.default(this).constructor;r=Reflect.construct(n,arguments,i)}else r=n.apply(this,arguments);return y.default(this,r)}}var k=function(e){m.default(r,e);var t=P(r);function r(e){var n;return f.default(this,r),(n=t.call(this,e)).children=[],n.properties=o.subArray(n.props.include,n.props.ignore),n}return h.default(r,[{key:"getSnapshotBeforeUpdate",value:function(){return this.children.map((function(e){var t=null==e?void 0:e.elements[0];return t?{data:o.getSnapshot(t),key:e.props.layoutKey}:null}))}},{key:"componentDidUpdate",value:function(e,t,r){for(var n=0,i=0;i<r.length;i++){var a=this.children[n];if(a&&a.elements[0]){var l=r[i];if(l&&a.props.layoutKey===l.key){var u=o.getSnapshot(a.elements[0]);a.manager.play(s.computeMorph(u,l.data,this.properties),{composite:!0}),n++}}else n++}}},{key:"render",value:function(){var e=this;return this.childIndex=0,l.Children.map(this.props.children,(function(t){if(!l.isValidElement(t)||!u.Animatable.isInstance(t))return t;var r=e.childIndex++;return l.cloneElement(t,{ref:function(t){return e.children[r]=t},layoutKey:t.key})}))}}]),r}(l.Component);function E(e){var t=e.children,r=e.className,n=e.style,i=e.duration;if(!o.is.string(t))return t;var a=t.split("");return g.default.createElement("div",{className:r,style:n},g.default.createElement(u.Animatable,{whileViewport:!0,animate:{opacity:1,translate:{y:0},rotate:0,duration:.8},initial:{opacity:0,translate:{y:"100%"},rotate:10},stagger:(i-.8)/(a.length-1)},a.map((function(e,t){return g.default.createElement("span",{style:{display:"inline-block"},key:t},/\s/.test(e)?" ":e)}))))}function x(e){var t,r=e.children,n=e.color,i=e.duration,a=(null===(t=r.props)||void 0===t?void 0:t.children)||[];Array.isArray(a)||(a=[a]);var o=[g.default.createElement(u.Animatable,{key:0,initial:{clip:{right:0}},animate:{clip:{left:1},duration:i/2}},g.default.createElement("div",{style:{position:"absolute",inset:0,backgroundColor:n}}))].concat(q.default(a));return g.default.createElement(u.Animatable,{whileViewport:!0,animate:{clip:{right:0},duration:i/2},initial:{clip:{right:1}}},l.cloneElement(r,{},o))}function R(e){var t,r=e.children,n=e.amount,i=p.useScroll(),a=l.useRef();return g.default.createElement(u.Animatable,{ref:a,animate:{translate:i((function(e){if(void 0===t){var r,i=null===(r=a.current)||void 0===r?void 0:r.elements[0];i&&(t=Math.max(i.getBoundingClientRect().y+window.scrollY-window.innerHeight/2,0))}return{x:0,y:(e-(t||0))*n}}))}},r)}v.default(k,"defaultProps",{include:o.MORPH_PROPERTIES,ignore:[]}),E.defaultProps={style:{},className:"",duration:1.6},x.defaultProps={color:"grey",duration:1.6},R.defaultProps={amount:.5},exports.ColorWipe=x,exports.LayoutGroup=k,exports.Parallax=R,exports.WriteOn=E;
