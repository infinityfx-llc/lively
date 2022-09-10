import{A as e}from"./animatable-7a4959b4.js";export{A as Animatable}from"./animatable-7a4959b4.js";import t from"@babel/runtime/helpers/extends";import r from"@babel/runtime/helpers/objectWithoutProperties";import n from"@babel/runtime/helpers/classCallCheck";import o from"@babel/runtime/helpers/createClass";import i from"@babel/runtime/helpers/inherits";import a from"@babel/runtime/helpers/possibleConstructorReturn";import l from"@babel/runtime/helpers/getPrototypeOf";import s from"@babel/runtime/helpers/defineProperty";import p,{Children as c,isValidElement as m,cloneElement as u,Component as f}from"react";import{M as b,P as h}from"./pop-c08aae69.js";import{p as v}from"./link-574b2ee7.js";import"./animation-a125d79c.js";import"@babel/runtime/helpers/slicedToArray";import"./events-9126e63b.js";import"@babel/runtime/helpers/typeof";var y=["levels","animations"];function O(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function j(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?O(Object(r),!0).forEach((function(t){s(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):O(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function d(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}();return function(){var r,n=l(e);if(t){var o=l(this).constructor;r=Reflect.construct(n,arguments,o)}else r=n.apply(this,arguments);return a(this,r)}}var P=function(a){i(s,f);var l=d(s);function s(e){var t;return n(this,s),(t=l.call(this,e)).levels=t.props.levels,t.animations=v(t.props.animations,t.levels),t}return o(s,[{key:"makeAnimatable",value:function(n){var o=this,i=arguments.length>1&&void 0!==arguments[1]?arguments[1]:1;if(i<1||c.count(n)<1)return n;var a=this.props;a.levels,a.animations;var l=r(a,y),s=this.animations[this.levels-i];return i===this.levels&&(l.ref=function(e){return o.animatable=e}),p.createElement(e,t({},l,{animate:s}),c.map(n,(function(e){return m(e)?u(e,{},o.makeAnimatable(e.props.children,i-1)):e})))}},{key:"play",value:function(e){var t,r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};null===(t=this.animatable)||void 0===t||t.play(e,j({},r))}},{key:"render",value:function(){return this.makeAnimatable(this.props.children,this.levels)}}]),s}();s(P,"defaultProps",{levels:1,animations:[b,h]});export{P as Animate};
