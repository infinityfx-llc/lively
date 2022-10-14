"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var e=require("./animatable-9bb8f076.js"),r=require("@babel/runtime/helpers/extends"),t=require("@babel/runtime/helpers/objectWithoutProperties"),n=require("@babel/runtime/helpers/classCallCheck"),a=require("@babel/runtime/helpers/createClass"),i=require("@babel/runtime/helpers/inherits"),l=require("@babel/runtime/helpers/possibleConstructorReturn"),u=require("@babel/runtime/helpers/getPrototypeOf"),s=require("@babel/runtime/helpers/defineProperty"),o=require("react"),c=require("./pop-b6e5c61a.js"),f=require("./link-66cfde2c.js");function p(e){return e&&"object"==typeof e&&"default"in e?e:{default:e}}require("@babel/runtime/helpers/asyncToGenerator"),require("@babel/runtime/regenerator"),require("./animation-42f8a59c.js"),require("@babel/runtime/helpers/slicedToArray"),require("./events-5dde14ba.js"),require("@babel/runtime/helpers/typeof");var b=p(r),m=p(t),h=p(n),d=p(a),v=p(i),y=p(l),q=p(u),A=p(s),j=p(o),k=["levels","animations"];function C(e){var r=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}();return function(){var t,n=q.default(e);if(r){var a=q.default(this).constructor;t=Reflect.construct(n,arguments,a)}else t=n.apply(this,arguments);return y.default(this,t)}}var P=function(r){v.default(n,r);var t=C(n);function n(e){var r;return h.default(this,n),(r=t.call(this,e)).levels=r.props.levels,r.animations=f.padArray(r.props.animations,r.levels),r}return d.default(n,[{key:"makeAnimatable",value:function(r){var t=this,n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:1;if(n<1||o.Children.count(r)<1)return r;var a=this.props;a.levels,a.animations;var i=m.default(a,k),l=this.animations[this.levels-n];return n===this.levels&&(i.ref=function(e){return t.animatable=e}),j.default.createElement(e.Animatable,b.default({},i,{animate:l}),o.Children.map(r,(function(e){return o.isValidElement(e)?o.cloneElement(e,{},t.makeAnimatable(e.props.children,n-1)):e})))}},{key:"play",value:function(){var e;null===(e=this.animatable)||void 0===e||e.play.apply(e,arguments)}},{key:"render",value:function(){return this.makeAnimatable(this.props.children,this.levels)}}]),n}(o.Component);A.default(P,"defaultProps",{levels:1,animations:[c.Move,c.Pop]}),exports.Animatable=e.Animatable,exports.Animate=P;
