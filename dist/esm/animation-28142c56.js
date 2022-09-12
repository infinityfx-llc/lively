import t from"@babel/runtime/helpers/slicedToArray";import e from"@babel/runtime/helpers/defineProperty";import r from"@babel/runtime/helpers/objectWithoutProperties";import n from"@babel/runtime/helpers/classCallCheck";import i from"@babel/runtime/helpers/createClass";import a from"@babel/runtime/helpers/inherits";import o from"@babel/runtime/helpers/possibleConstructorReturn";import s from"@babel/runtime/helpers/getPrototypeOf";import{i as u,e as l,U as c,g as f,x as h,h as p,c as v,f as d,L as y,P as m}from"./link-6e5a534b.js";var b=function t(e,r,n,i){if(u.object(e)){var a={};for(var o in e)a[o]=t(e[o],r[o],n,i);return a}return[i(e[0],r[0],n),e[1]]},g=function(t,e,r){return u.number(t)&&u.number(e)?t*(1-r)+e*r:r>.5?e:t},O=function(t,e,r){return g(t,e,(1-Math.cos(r*Math.PI))/2)},j=Object.freeze({__proto__:null,interpolate:b,constant:function(t){return t},linear:g,ease:O,spring:function(t,e,r){return r=1-1*Math.exp(-3.6*r)*Math.cos(2.5*Math.pow(r,2)*Math.PI),g(t,e,r)}}),w=function(){function t(e){var r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},i=r.reverse,a=void 0!==i&&i,o=r.repeat,s=void 0===o?1:o,u=r.delay,l=void 0===u?0:u,c=r.alternate,f=void 0!==c&&c;n(this,t),this.indices={},this.clip=e,this.t=0,this.T=e.duration*s+l,this.reverse=a,this.delay=l,this.alternate=f}return i(t,[{key:"getInterpolatedValue",value:function(t,e,r,n){if(u.function(e))e=l(e(r,this.clip.duration),t),e=c.toBase(e,t,n);else{t in this.indices||(this.indices[t]=this.reverse?e.length-1:0);var i,a=this.reverse?-1:1,o=this.indices[t],s=e[o],h=e[o+a],p=s.set;if(this.reverse?h.time>r:h.time<r){this.indices[t]=o+=a;var v=["start","end"],d=v[+!this.reverse],y=v[+this.reverse];d in s||y in h?(p=d in s?s[d]:h[y],i=!0):(s=e[o],h=e[o+a])}if(u.null(p)&&(p=f(n,t)),p=c.toBase(p,t,n),i)e=p;else{var m=u.null(h.set)?f(n,t):h.set;m=c.toBase(m,t,n);var g=j[h.interpolate||this.clip.interpolate]||O;e=b(p,m,(r-s.time)/(h.time-s.time),g)}}return e}},{key:"get",value:function(t){var e=!(arguments.length>1&&void 0!==arguments[1])||arguments[1],r={},n=this.t>=this.T;if(this.t<this.delay||e&&!n&&!u.visible(t))return r;var i=this.t-this.delay,a=this.clip.duration,o=this.alternate&&Math.floor(i/a)%2==+!n;for(var s in i=n?a:i%a,i=h(this.reverse,o)?a-i:i,r.origin=this.clip.origin,this.clip.properties)r[s]=this.getInterpolatedValue(s,this.clip.properties[s],i,t);return r}},{key:"step",value:function(t){var e=this.t>=this.T;return this.t+=t,e}}]),t}();function P(t){var e=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(t){return!1}}();return function(){var r,n=s(t);if(e){var i=s(this).constructor;r=Reflect.construct(n,arguments,i)}else r=n.apply(this,arguments);return o(this,r)}}var k=function(t){a(r,w);var e=P(r);function r(){var t;return n(this,r),(t=e.call(this,{duration:1/0,properties:{},origin:{x:.5,y:.5}})).isEmpty=!0,t.cache={},t}return i(r,[{key:"add",value:function(t,e){this.clip.properties[t]=e,this.isEmpty=!1}},{key:"getInterpolatedValue",value:function(t,e,r,n){u.null(e.internal.t)&&(e.internal.t=r),e.internal.t===r&&(this.cache[t]={});var i=e.internal.duration?Math.min((r-e.internal.t)/e.internal.duration,1):1,a=this.cache[t]||{};if(a.t===i)return a.value;var o=c.toBase(l(e(r,this.clip.duration),t),t,n),s=f(n,t);s=c.toBase(s,t,n);var h=b(s,o,i,g);return this.cache[t]={value:h,t:i},h}}]),r}(),I=["duration","delay","repeat","alternate","interpolate","origin"];function M(t,e){var r="undefined"!=typeof Symbol&&t[Symbol.iterator]||t["@@iterator"];if(!r){if(Array.isArray(t)||(r=function(t,e){if(!t)return;if("string"==typeof t)return A(t,e);var r=Object.prototype.toString.call(t).slice(8,-1);"Object"===r&&t.constructor&&(r=t.constructor.name);if("Map"===r||"Set"===r)return Array.from(t);if("Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r))return A(t,e)}(t))||e&&t&&"number"==typeof t.length){r&&(t=r);var n=0,i=function(){};return{s:i,n:function(){return n>=t.length?{done:!0}:{done:!1,value:t[n++]}},e:function(t){throw t},f:i}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var a,o=!0,s=!1;return{s:function(){r=r.call(t)},n:function(){var t=r.next();return o=t.done,t},e:function(t){s=!0,a=t},f:function(){try{o||null==r.return||r.return()}finally{if(s)throw a}}}}function A(t,e){(null==e||e>t.length)&&(e=t.length);for(var r=0,n=new Array(e);r<e;r++)n[r]=t[r];return n}function x(t,e){var r=Object.keys(t);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(t);e&&(n=n.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),r.push.apply(r,n)}return r}function z(t){for(var r=1;r<arguments.length;r++){var n=null!=arguments[r]?arguments[r]:{};r%2?x(Object(n),!0).forEach((function(r){e(t,r,n[r])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(n)):x(Object(n)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(n,e))}))}return t}var B=function(){function e(){var i=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},a=i.duration,o=void 0===a?1:a,s=i.delay,l=i.repeat,c=i.alternate,f=i.interpolate,h=i.origin,p=void 0===h?{x:.5,y:.5}:h,v=r(i,I),y=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};n(this,e),this.duration=o,this.origin=d(p),this.channel=new k;var m=this.parse(v,y),b=t(m,2);this.properties=b[0],this.initials=b[1],this.isEmpty=u.empty(this.properties),this.interpolate=f,this.defaults={delay:s,repeat:l,alternate:c}}return i(e,[{key:"length",value:function(){return this.duration*(this.defaults.repeat||1)+(this.defaults.delay||0)}},{key:"parse",value:function(t,e){var r=this,n=function(n){var i=t[n];if(y.isInstance(i))return r.channel.add(n,i),delete t[n],"continue";if(u.function(i))return"continue";(i=u.array(i)?i:[i]).length<2?i.unshift(n in e?e[n]:null):e[n]=i[0];for(var a=i.map((function(t){return r.sanitize(t,n)})),o=0;o<a.length;o++)r.quantize(a,o);t[n]=a};for(var i in t)n(i);for(var a in e=z({},e))e[a]=l(e[a],a);return[t,e]}},{key:"sanitize",value:function(t,e){u.object(t)||(t={set:t}),p(t,m)||(t={set:t}),"set"in t||(t.set="start"in t?t.start:t.end),"time"in t&&t.time>this.duration&&delete t.time,t=z({},t);var r,n=M(m);try{for(n.s();!(r=n.n()).done;){var i=r.value;i in t&&(t[i]=l(t[i],e))}}catch(t){n.e(t)}finally{n.f()}return t}},{key:"quantize",value:function(t,e){var r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:e-1;if("time"in t[e])return t[e].time;if(0==e||e==t.length-1)return t[e].time=0==e?0:this.duration;var n=this.quantize(t,r,r);return t[e].time=n+(this.quantize(t,e+1,r)-n)*((e-r)/(e-r+1))}},{key:"play",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};return new w(this,v(t,this.defaults))}}]),e}(),S={create:function(e){var r=function t(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};return t.use=t.use.bind(t,e),t};return r.use=function(){var r=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},n=e(r),i=t(n,2),a=i[0],o=i[1];return new B(a,o)},r},isInstance:function(t){return u.function(t)&&u.function(t.use)}};export{S as A,B as C};