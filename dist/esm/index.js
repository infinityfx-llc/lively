import{A as e}from"./animatable-9057c824.js";export{A as Animatable}from"./animatable-9057c824.js";import t from"@babel/runtime/helpers/extends";import r from"@babel/runtime/helpers/objectWithoutProperties";import n from"@babel/runtime/helpers/classCallCheck";import i from"@babel/runtime/helpers/createClass";import a from"@babel/runtime/helpers/inherits";import o from"@babel/runtime/helpers/possibleConstructorReturn";import l from"@babel/runtime/helpers/getPrototypeOf";import s from"@babel/runtime/helpers/defineProperty";import m,{Children as p,isValidElement as u,cloneElement as c,Component as f}from"react";import{M as b,P as h}from"./pop-18547158.js";import{p as v}from"./link-d312db50.js";import"./animation-917bbc34.js";import"@babel/runtime/helpers/slicedToArray";import"./events-6da12fc3.js";import"@babel/runtime/helpers/typeof";var y=["levels","animations"];function d(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}();return function(){var r,n=l(e);if(t){var i=l(this).constructor;r=Reflect.construct(n,arguments,i)}else r=n.apply(this,arguments);return o(this,r)}}var k=function(o){a(s,f);var l=d(s);function s(e){var t;return n(this,s),(t=l.call(this,e)).levels=t.props.levels,t.animations=v(t.props.animations,t.levels),t}return i(s,[{key:"makeAnimatable",value:function(n){var i=this,a=arguments.length>1&&void 0!==arguments[1]?arguments[1]:1;if(a<1||p.count(n)<1)return n;var o=this.props;o.levels,o.animations;var l=r(o,y),s=this.animations[this.levels-a];return a===this.levels&&(l.ref=function(e){return i.animatable=e}),m.createElement(e,t({},l,{animate:s}),p.map(n,(function(e){return u(e)?c(e,{},i.makeAnimatable(e.props.children,a-1)):e})))}},{key:"play",value:function(){var e;null===(e=this.animatable)||void 0===e||e.play.apply(e,arguments)}},{key:"render",value:function(){return this.makeAnimatable(this.props.children,this.levels)}}]),s}();s(k,"defaultProps",{levels:1,animations:[b,h]});export{k as Animate};
