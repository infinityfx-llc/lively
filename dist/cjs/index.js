"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var e=require("./animatable-4affe044.js"),t=require("@babel/runtime/helpers/extends"),r=require("@babel/runtime/helpers/objectWithoutProperties"),n=require("@babel/runtime/helpers/classCallCheck"),i=require("@babel/runtime/helpers/createClass"),a=require("@babel/runtime/helpers/inherits"),l=require("@babel/runtime/helpers/possibleConstructorReturn"),u=require("@babel/runtime/helpers/getPrototypeOf"),o=require("@babel/runtime/helpers/defineProperty"),s=require("react"),c=require("./pop-2e6c3dc0.js"),f=require("./link-f18a1432.js");function p(e){return e&&"object"==typeof e&&"default"in e?e:{default:e}}require("./animation-41f6a9bd.js"),require("@babel/runtime/helpers/slicedToArray"),require("./events-55caa68e.js"),require("@babel/runtime/helpers/typeof");var b=p(t),m=p(r),h=p(n),d=p(i),v=p(a),y=p(l),O=p(u),j=p(o),q=p(s),P=["levels","animations"];function g(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function k(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?g(Object(r),!0).forEach((function(t){j.default(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):g(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function A(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}();return function(){var r,n=O.default(e);if(t){var i=O.default(this).constructor;r=Reflect.construct(n,arguments,i)}else r=n.apply(this,arguments);return y.default(this,r)}}var C=function(t){v.default(n,t);var r=A(n);function n(e){var t;return h.default(this,n),(t=r.call(this,e)).levels=t.props.levels,t.animations=f.padArray(t.props.animations,t.levels),t}return d.default(n,[{key:"makeAnimatable",value:function(t){var r=this,n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:1;if(n<1||s.Children.count(t)<1)return t;var i=this.props;i.levels,i.animations;var a=m.default(i,P),l=this.animations[this.levels-n];return n===this.levels&&(a.ref=function(e){return r.animatable=e}),q.default.createElement(e.Animatable,b.default({},a,{animate:l}),s.Children.map(t,(function(e){return s.isValidElement(e)?s.cloneElement(e,{},r.makeAnimatable(e.props.children,n-1)):e})))}},{key:"play",value:function(e){var t,r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};null===(t=this.animatable)||void 0===t||t.play(e,k({},r))}},{key:"render",value:function(){return this.makeAnimatable(this.props.children,this.levels)}}]),n}(s.Component);j.default(C,"defaultProps",{levels:1,animations:[c.Move,c.Pop]}),exports.Animatable=e.Animatable,exports.Animate=C;
