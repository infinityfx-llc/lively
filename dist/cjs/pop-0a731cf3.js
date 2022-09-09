"use strict";var t=require("@babel/runtime/helpers/defineProperty"),e=require("@babel/runtime/helpers/objectWithoutProperties"),r=require("@babel/runtime/helpers/slicedToArray"),n=require("@babel/runtime/helpers/classCallCheck"),i=require("@babel/runtime/helpers/createClass"),a=require("@babel/runtime/helpers/inherits"),o=require("@babel/runtime/helpers/possibleConstructorReturn"),s=require("@babel/runtime/helpers/getPrototypeOf"),u=require("./link-78b3358a.js");function c(t){return t&&"object"==typeof t&&"default"in t?t:{default:t}}var l=c(t),f=c(e),h=c(r),p=c(n),v=c(i),d=c(a),y=c(o),b=c(s),O=function t(e,r,n,i){if(u.is.object(e)){var a={};for(var o in e)a[o]=t(e[o],r[o],n,i);return a}return[i(e[0],r[0],n),e[1]]},g=function(t,e,r){return u.is.number(t)&&u.is.number(e)?t*(1-r)+e*r:r>.5?e:t},m=Object.freeze({__proto__:null,interpolate:O,constant:function(t){return t},linear:g,ease:function(t,e,r){return g(t,e,(1-Math.cos(r*Math.PI))/2)},spring:function(t,e,r){return r=1-1*Math.exp(-3.6*r)*Math.cos(2.5*Math.pow(r,2)*Math.PI),g(t,e,r)}}),j=function(){function t(e){var r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},n=r.reverse,i=void 0!==n&&n,a=r.repeat,o=void 0===a?1:a,s=r.delay,u=void 0===s?0:s,c=r.alternate,l=void 0!==c&&c;p.default(this,t),this.indices={},this.clip=e,this.t=0,this.T=e.duration*o+u,this.reverse=i,this.delay=u,this.alternate=l}return v.default(t,[{key:"getInterpolatedValue",value:function(t,e,r,n){if(u.is.function(e))e=this.clip.convert(e(r,this.clip.duration),t),e=u.Units.toBase(e,t,n);else{t in this.indices||(this.indices[t]=this.reverse?e.length-1:0);var i,a=this.reverse?-1:1,o=this.indices[t],s=e[o],c=e[o+a],l=s.set;if(this.reverse?c.time>=r:c.time<=r){this.indices[t]=o+=a;var f=["start","end"],h=f[+!this.reverse],p=f[+this.reverse];h in s||p in c?(l=h in s?s[h]:c[p],i=!0):(s=e[o],c=e[o+a])}if(u.is.null(l)&&(l=u.getProperty(n,t)),l=u.Units.toBase(l,t,n),i)e=l;else{var v=u.is.null(c.set)?u.getProperty(n,t):c.set;v=u.Units.toBase(v,t,n);var d=m[c.interpolate]||g;e=O(l,v,(r-s.time)/(c.time-s.time),d)}}return e}},{key:"get",value:function(t){var e=this.t-this.delay,r=this.alternate&&Math.floor(e/this.clip.duration)%2==1;e%=this.clip.duration,e=u.xor(this.reverse,r)?this.clip.duration-e:e;var n={};if(this.t>=this.delay)for(var i in n.origin=this.clip.origin,this.clip.properties)n[i]=this.getInterpolatedValue(i,this.clip.properties[i],e,t);return n}},{key:"step",value:function(t){return this.t+=t,this.t>=this.T}}]),t}();function P(t){var e=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(t){return!1}}();return function(){var r,n=b.default(t);if(e){var i=b.default(this).constructor;r=Reflect.construct(n,arguments,i)}else r=n.apply(this,arguments);return y.default(this,r)}}var w=function(t){d.default(r,t);var e=P(r);function r(t){var n;return p.default(this,r),(n=e.call(this,{duration:1/0,properties:{},convert:t,origin:{x:.5,y:.5}})).cache={},n}return v.default(r,[{key:"add",value:function(t,e){this.clip.properties[t]=e}},{key:"getInterpolatedValue",value:function(t,e,r,n){u.is.null(e.internal.t)&&(e.internal.t=r),e.internal.t===r&&(this.cache[t]={});var i=0===e.internal.duration?1:Math.min((r-e.internal.t)/e.internal.duration,1),a=this.cache[t]||{};if(a.t===i)return a.value;var o=u.Units.toBase(this.clip.convert(e(r,this.clip.duration),t),t,n),s=u.getProperty(n,t);s=u.Units.toBase(s,t,n);var c=O(s,o,i,g);return this.cache[t]={value:c,t:i},c}}]),r}(j),S=["duration","delay","repeat","alternate","origin"];function k(t,e){var r="undefined"!=typeof Symbol&&t[Symbol.iterator]||t["@@iterator"];if(!r){if(Array.isArray(t)||(r=function(t,e){if(!t)return;if("string"==typeof t)return x(t,e);var r=Object.prototype.toString.call(t).slice(8,-1);"Object"===r&&t.constructor&&(r=t.constructor.name);if("Map"===r||"Set"===r)return Array.from(t);if("Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r))return x(t,e)}(t))||e&&t&&"number"==typeof t.length){r&&(t=r);var n=0,i=function(){};return{s:i,n:function(){return n>=t.length?{done:!0}:{done:!1,value:t[n++]}},e:function(t){throw t},f:i}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var a,o=!0,s=!1;return{s:function(){r=r.call(t)},n:function(){var t=r.next();return o=t.done,t},e:function(t){s=!0,a=t},f:function(){try{o||null==r.return||r.return()}finally{if(s)throw a}}}}function x(t,e){(null==e||e>t.length)&&(e=t.length);for(var r=0,n=new Array(e);r<e;r++)n[r]=t[r];return n}function A(t,e){var r=Object.keys(t);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(t);e&&(n=n.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),r.push.apply(r,n)}return r}function D(t){for(var e=1;e<arguments.length;e++){var r=null!=arguments[e]?arguments[e]:{};e%2?A(Object(r),!0).forEach((function(e){l.default(t,e,r[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(r)):A(Object(r)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(r,e))}))}return t}var T=function(){function t(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},r=e.duration,n=void 0===r?1:r,i=e.delay,a=e.repeat,o=e.alternate,s=e.origin,c=void 0===s?{x:.5,y:.5}:s,l=f.default(e,S),h=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};p.default(this,t),this.duration=n,this.origin=u.originToStr(c),this.initial=h,this.initials=D({},h),this.channel=new w(this.convert.bind(this)),this.properties=this.parse(l),this.isEmpty=u.is.empty(this.properties),this.defaults={delay:i,repeat:a,alternate:o}}return v.default(t,[{key:"length",value:function(){return this.duration*(this.defaults.repeat||1)+(this.defaults.delay||0)}},{key:"parse",value:function(t){var e=this,r=function(r){var n=t[r];if(u.Link.isInstance(n))return e.channel.add(r,n),delete t[r],"continue";if(u.is.function(n))return"continue";(n=u.is.array(n)?n:[n]).length<2?n.unshift(r in e.initial?e.initial[r]:null):e.initials[r]=n[0];for(var i=n.map((function(t){return e.sanitize(t,r)})),a=0;a<i.length;a++)e.quantize(i,a);t[r]=i};for(var n in t)r(n);for(var i in this.initials)this.initials[i]=this.convert(this.initials[i],i);return t}},{key:"sanitize",value:function(t,e){u.is.object(t)||(t={set:t}),u.hasSomeKey(t,u.POSITIONS)||(t={set:t}),"set"in t||(t.set="start"in t?t.start:t.end),"time"in t&&t.time>this.duration&&delete t.time,t=D({},t);var r,n=k(u.POSITIONS);try{for(n.s();!(r=n.n()).done;){var i=r.value;i in t&&(t[i]=this.convert(t[i],e))}}catch(t){n.e(t)}finally{n.f()}return t}},{key:"quantize",value:function(t,e){var r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:e-1;if("time"in t[e])return t[e].time;if(0==e||e==t.length-1)return t[e].time=0==e?0:this.duration;var n=this.quantize(t,r,r);return t[e].time=n+(this.quantize(t,e+1,r)-n)*((e-r)/(e-r+1))}},{key:"convert",value:function(t,e){if(u.is.null(t))return e in this.initial?this.convert(this.initial[e],e):null;if(u.is.object(t)){var r,n=Object.keys(t),i=k(u.PARSABLE_OBJECTS);try{for(i.s();!(r=i.n()).done;){var a=r.value;if(u.hasSomeKey(t,a)){n=a;break}}}catch(t){i.e(t)}finally{i.f()}t=D({},t);var o,s=k(n);try{for(s.s();!(o=s.n()).done;){var c=o.value,l=e in u.DEFAULTS?u.DEFAULTS[e][c]:u.DEFAULTS[c];t[c]=c in t?this.convert(t[c]):l}}catch(t){s.e(t)}finally{s.f()}return t}var f;if(u.is.string(t)){if(t.match(/^#[0-9a-f]{3,8}$/i))return u.hexToRgba(t);if(t.match(/^rgba?\(.*\)$/i))return u.strToRgba(t);var p=u.styleToArr(t),v=h.default(p,2);if(t=v[0],!(f=v[1]))return[t,f]}return[t,f=u.Units.normalize(f,e)]}},{key:"play",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};return new j(this,u.mergeObjects(t,this.defaults))}}]),t}(),q={create:function(t){var e=function t(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};return t.use=t.use.bind(t,e),t};return e.use=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},r=t(e),n=h.default(r,2),i=n[0],a=n[1];return new T(i,a)},e},isAnimation:function(t){return t instanceof Function&&"use"in t}},E=["direction"];function I(t,e){var r=Object.keys(t);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(t);e&&(n=n.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),r.push.apply(r,n)}return r}function M(t){for(var e=1;e<arguments.length;e++){var r=null!=arguments[e]?arguments[e]:{};e%2?I(Object(r),!0).forEach((function(e){l.default(t,e,r[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(r)):I(Object(r)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(r,e))}))}return t}var U=q.create((function(t){var e=t.direction,r=void 0===e?"up":e,n=f.default(t,E),i="0px",a="20px";switch(r){case"down":a="-20px";break;case"left":i="20px",a="0px";break;case"right":i="-20px",a="0px"}return[M({position:{x:0,y:0},opacity:1,duration:.5},n),{position:{x:i,y:a},opacity:0}]}));function B(t,e){var r=Object.keys(t);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(t);e&&(n=n.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),r.push.apply(r,n)}return r}function R(t){for(var e=1;e<arguments.length;e++){var r=null!=arguments[e]?arguments[e]:{};e%2?B(Object(r),!0).forEach((function(e){l.default(t,e,r[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(r)):B(Object(r)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(r,e))}))}return t}var z=q.create((function(t){return[R({opacity:1,scale:1,duration:.25},t),{opacity:0,scale:.85}]}));exports.Animation=q,exports.Clip=T,exports.Move=U,exports.Pop=z;
