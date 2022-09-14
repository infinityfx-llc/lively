"use strict";var t=require("@babel/runtime/helpers/slicedToArray"),e=require("@babel/runtime/helpers/defineProperty"),r=require("@babel/runtime/helpers/objectWithoutProperties"),n=require("@babel/runtime/helpers/classCallCheck"),i=require("@babel/runtime/helpers/createClass"),a=require("@babel/runtime/helpers/inherits"),o=require("@babel/runtime/helpers/possibleConstructorReturn"),u=require("@babel/runtime/helpers/getPrototypeOf"),s=require("./link-dbd7263b.js");function l(t){return t&&"object"==typeof t&&"default"in t?t:{default:t}}var c=l(t),f=l(e),h=l(r),p=l(n),v=l(i),d=l(a),y=l(o),b=l(u);function m(t,e){var r="undefined"!=typeof Symbol&&t[Symbol.iterator]||t["@@iterator"];if(!r){if(Array.isArray(t)||(r=function(t,e){if(!t)return;if("string"==typeof t)return g(t,e);var r=Object.prototype.toString.call(t).slice(8,-1);"Object"===r&&t.constructor&&(r=t.constructor.name);if("Map"===r||"Set"===r)return Array.from(t);if("Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r))return g(t,e)}(t))||e&&t&&"number"==typeof t.length){r&&(t=r);var n=0,i=function(){};return{s:i,n:function(){return n>=t.length?{done:!0}:{done:!1,value:t[n++]}},e:function(t){throw t},f:i}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var a,o=!0,u=!1;return{s:function(){r=r.call(t)},n:function(){var t=r.next();return o=t.done,t},e:function(t){u=!0,a=t},f:function(){try{o||null==r.return||r.return()}finally{if(u)throw a}}}}function g(t,e){(null==e||e>t.length)&&(e=t.length);for(var r=0,n=new Array(e);r<e;r++)n[r]=t[r];return n}var O=function t(e,r,n,i){if(s.is.object(e)){var a={};for(var o in e)a[o]=t(e[o],r[o],n,i);return a}return[i(e[0],r[0],n),e[1]]},j=function(t,e,r){return s.is.number(t)&&s.is.number(e)?t*(1-r)+e*r:r>.5?e:t},w=function(t,e,r){return j(t,e,(1-Math.cos(r*Math.PI))/2)},P=function(t,e,r){var n,i=arguments.length>3&&void 0!==arguments[3]?arguments[3]:1,a={duration:i,origin:{x:0,y:0}},o={},u=m(r);try{for(u.s();!(n=u.n()).done;){var s=n.value;"scale"==s?(a.scale={x:1,y:1},o.scale={x:1+(e.layout.width-t.layout.width)/t.layout.width,y:1+(e.layout.height-t.layout.height)/t.layout.height}):"translate"==s?(a.translate={x:0,y:0},o.translate={x:e.layout.x-t.layout.x,y:e.layout.y-t.layout.y}):(a[s]=t[s],o[s]=e[s])}}catch(t){u.e(t)}finally{u.f()}return new B(a,o)},S=Object.freeze({__proto__:null,interpolate:O,constant:function(t){return t},linear:j,ease:w,spring:function(t,e,r){return r=1-1*Math.exp(-3.6*r)*Math.cos(2.5*Math.pow(r,2)*Math.PI),j(t,e,r)},computeMorph:P}),x=function(){function t(e){var r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},n=r.reverse,i=void 0!==n&&n,a=r.repeat,o=void 0===a?1:a,u=r.delay,s=void 0===u?0:u,l=r.alternate,c=void 0!==l&&l;p.default(this,t),this.indices={},this.clip=e,this.t=0,this.T=e.duration*o+s,this.reverse=i,this.delay=s,this.alternate=c}return v.default(t,[{key:"getInterpolatedValue",value:function(t,e,r,n){if(s.is.function(e))e=s.convert(e(r,this.clip.duration),t),e=s.Units.toBase(e,t,n);else{t in this.indices||(this.indices[t]=this.reverse?e.length-1:0);var i,a=this.reverse?-1:1,o=this.indices[t],u=e[o],l=e[o+a],c=u.set;if(this.reverse?l.time>r:l.time<r){this.indices[t]=o+=a;var f=["start","end"],h=f[+!this.reverse],p=f[+this.reverse];h in u||p in l?(c=h in u?u[h]:l[p],i=!0):(u=e[o],l=e[o+a])}if(s.is.null(c)&&(c=s.getProperty(n,t)),c=s.Units.toBase(c,t,n),i)e=c;else{var v=s.is.null(l.set)?s.getProperty(n,t):l.set;v=s.Units.toBase(v,t,n);var d=S[l.interpolate||this.clip.interpolate]||w;e=O(c,v,(r-u.time)/(l.time-u.time),d)}}return e}},{key:"get",value:function(t){var e=!(arguments.length>1&&void 0!==arguments[1])||arguments[1],r={},n=this.t>=this.T;if(this.t<this.delay||e&&!n&&!s.is.visible(t))return r;var i=this.t-this.delay,a=this.clip.duration,o=this.alternate&&Math.floor(i/a)%2==+!n;for(var u in i=n?a:i%a,i=s.xor(this.reverse,o)?a-i:i,r.origin=this.clip.origin,this.clip.properties)r[u]=this.getInterpolatedValue(u,this.clip.properties[u],i,t);return r}},{key:"step",value:function(t){var e=this.t>=this.T;return this.t+=t,e}}]),t}();function I(t){var e=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(t){return!1}}();return function(){var r,n=b.default(t);if(e){var i=b.default(this).constructor;r=Reflect.construct(n,arguments,i)}else r=n.apply(this,arguments);return y.default(this,r)}}var k=function(t){d.default(r,t);var e=I(r);function r(){var t;return p.default(this,r),(t=e.call(this,{duration:1/0,properties:{},origin:{x:.5,y:.5}})).isEmpty=!0,t.cache={},t}return v.default(r,[{key:"add",value:function(t,e){this.clip.properties[t]=e,this.isEmpty=!1}},{key:"getInterpolatedValue",value:function(t,e,r,n){s.is.null(e.internal.t)&&(e.internal.t=r),e.internal.t===r&&(this.cache[t]={});var i=e.internal.duration?Math.min((r-e.internal.t)/e.internal.duration,1):1,a=this.cache[t]||{};if(a.t===i)return a.value;var o=s.Units.toBase(s.convert(e(r,this.clip.duration),t),t,n),u=s.getProperty(n,t);u=s.Units.toBase(u,t,n);var l=O(u,o,i,j);return this.cache[t]={value:l,t:i},l}}]),r}(x),A=["duration","delay","repeat","alternate","interpolate","origin"];function q(t,e){var r="undefined"!=typeof Symbol&&t[Symbol.iterator]||t["@@iterator"];if(!r){if(Array.isArray(t)||(r=function(t,e){if(!t)return;if("string"==typeof t)return M(t,e);var r=Object.prototype.toString.call(t).slice(8,-1);"Object"===r&&t.constructor&&(r=t.constructor.name);if("Map"===r||"Set"===r)return Array.from(t);if("Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r))return M(t,e)}(t))||e&&t&&"number"==typeof t.length){r&&(t=r);var n=0,i=function(){};return{s:i,n:function(){return n>=t.length?{done:!0}:{done:!1,value:t[n++]}},e:function(t){throw t},f:i}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var a,o=!0,u=!1;return{s:function(){r=r.call(t)},n:function(){var t=r.next();return o=t.done,t},e:function(t){u=!0,a=t},f:function(){try{o||null==r.return||r.return()}finally{if(u)throw a}}}}function M(t,e){(null==e||e>t.length)&&(e=t.length);for(var r=0,n=new Array(e);r<e;r++)n[r]=t[r];return n}function T(t,e){var r=Object.keys(t);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(t);e&&(n=n.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),r.push.apply(r,n)}return r}function z(t){for(var e=1;e<arguments.length;e++){var r=null!=arguments[e]?arguments[e]:{};e%2?T(Object(r),!0).forEach((function(e){f.default(t,e,r[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(r)):T(Object(r)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(r,e))}))}return t}var B=function(){function t(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},r=e.duration,n=void 0===r?1:r,i=e.delay,a=e.repeat,o=e.alternate,u=e.interpolate,l=e.origin,f=void 0===l?{x:.5,y:.5}:l,v=h.default(e,A),d=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};p.default(this,t),this.duration=n,this.origin=s.originToStr(f),this.channel=new k;var y=this.parse(v,d),b=c.default(y,2);this.properties=b[0],this.initials=b[1],this.isEmpty=s.is.empty(this.properties),this.interpolate=u,this.defaults={delay:i,repeat:a,alternate:o}}return v.default(t,[{key:"length",value:function(){return this.duration*(this.defaults.repeat||1)+(this.defaults.delay||0)}},{key:"parse",value:function(t,e){var r=this,n=function(n){var i=t[n];if(s.Link.isInstance(i))return r.channel.add(n,i),delete t[n],"continue";if(s.is.function(i))return"continue";(i=s.is.array(i)?i:[i]).length<2?i.unshift(n in e?e[n]:null):e[n]=i[0];for(var a=i.map((function(t){return r.sanitize(t,n)})),o=0;o<a.length;o++)r.quantize(a,o);t[n]=a};for(var i in t)n(i);for(var a in e=z({},e))e[a]=s.convert(e[a],a);return[t,e]}},{key:"sanitize",value:function(t,e){s.is.object(t)||(t={set:t}),s.hasSomeKey(t,s.POSITIONS)||(t={set:t}),"set"in t||(t.set="start"in t?t.start:t.end),"time"in t&&t.time>this.duration&&delete t.time,t=z({},t);var r,n=q(s.POSITIONS);try{for(n.s();!(r=n.n()).done;){var i=r.value;i in t&&(t[i]=s.convert(t[i],e))}}catch(t){n.e(t)}finally{n.f()}return t}},{key:"quantize",value:function(t,e){var r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:e-1;if("time"in t[e])return t[e].time;if(0==e||e==t.length-1)return t[e].time=0==e?0:this.duration;var n=this.quantize(t,r,r);return t[e].time=n+(this.quantize(t,e+1,r)-n)*((e-r)/(e-r+1))}},{key:"play",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};return new x(this,s.mergeObjects(t,this.defaults))}}]),t}(),C={create:function(t){var e=function t(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};return t.use=t.use.bind(t,e),t};return e.use=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},r=t(e),n=c.default(r,2),i=n[0],a=n[1];return new B(i,a)},e},isInstance:function(t){return s.is.function(t)&&s.is.function(t.use)}};exports.Animation=C,exports.Clip=B,exports.computeMorph=P;
