"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var t=require("@babel/runtime/helpers/classCallCheck"),e=require("@babel/runtime/helpers/createClass"),n=require("@babel/runtime/helpers/inherits"),r=require("@babel/runtime/helpers/possibleConstructorReturn"),i=require("@babel/runtime/helpers/getPrototypeOf"),a=require("@babel/runtime/helpers/defineProperty"),o=require("react"),s=require("@babel/runtime/helpers/slicedToArray"),u=require("@babel/runtime/helpers/objectWithoutProperties"),l=require("./events-bb999128.js");function c(t){return t&&"object"==typeof t&&"default"in t?t:{default:t}}require("@babel/runtime/helpers/typeof");var h=c(t),f=c(e),p=c(n),v=c(r),d=c(i),y=c(a),m=c(s),g=c(u),b=["set","start","end"],w=["%","px","em","rem","vw","vh","vmin","vmax","deg","rad"],k=["opacity","active","interact","zIndex","lineHeight","fontWeight","length"],x=[["x","y"],["r","g","b","a"],["left","top","right","bottom"]],j=["translate","scale","rotate","skew"],O={translate:{x:[0,"px"],y:[0,"px"]},scale:{x:[100,"%"],y:[100,"%"]},clip:{left:[0,"%"],top:[0,"%"],right:[0,"%"],bottom:[0,"%"]},r:[127,null],g:[127,null],b:[127,null],a:[255,null]},A=function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:Object.keys(t);return e.map((function(e){return t[e].join("")})).join(", ")},S=function(t){var e=l.is.object(t)?t:{x:.5,y:.5},n=e.x,r=e.y;if(l.is.string(t))switch(t){case"left":n=0;break;case"right":n=1;break;case"top":r=0;break;case"bottom":r=1}return"".concat(100*n,"% ").concat(100*r,"%")},I={emtopx:function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:document.body;return t*parseFloat(getComputedStyle(e).fontSize)},remtopx:function(t){return I.emtopx(t)},vwtopx:function(t){return t*window.innerWidth},vhtopx:function(t){return t*window.innerHeight},vmintopx:function(t){return t*Math.min(window.innerWidth,window.innerHeight)},vmaxtopx:function(t){return t*Math.max(window.innerWidth,window.innerHeight)},radtodeg:function(t){return 180*t/Math.PI},fromProperty:function(t){return["rotate","skew"].includes(t)?"deg":["clip","scale"].includes(t)?"%":k.includes(t)?null:"px"},toBase:function(t,e,n){if(l.is.object(t)){var r={};for(var i in t)r[i]=I.toBase(t[i],e);return r}var a=I.fromProperty(e),o="".concat(t[1],"to").concat(a);return l.is.null(t[1])&&!l.is.null(a)?[t[0],a]:o in I?[I[o](t[0],n),a]:t},normalize:function(t,e){return l.is.null(t)&&k.includes(e)||w.includes(t)?t:I.fromProperty(e)}},P=function t(e,n,r,i){if(l.is.object(e)){var a={};for(var o in e)a[o]=t(e[o],n[o],r,i);return a}return[i(e[0],n[0],r),e[1]]},E=function(t,e,n){return l.is.number(t)&&l.is.number(e)?t*(1-n)+e*n:n>.5?e:t},M=Object.freeze({__proto__:null,interpolate:P,constant:function(t){return t},linear:E,ease:function(t,e,n){return E(t,e,(1-Math.cos(n*Math.PI))/2)},spring:function(t,e,n){return n=1-1*Math.exp(-3.6*n)*Math.cos(2.5*Math.pow(n,2)*Math.PI),E(t,e,n)}}),z=function(){function t(e){var n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},r=n.reverse,i=void 0!==r&&r,a=n.repeat,o=void 0===a?1:a,s=n.delay,u=void 0===s?0:s,l=n.alternate,c=void 0!==l&&l;h.default(this,t),this.indices={},this.clip=e,this.t=0,this.T=e.duration*o+u,this.reverse=i,this.delay=u,this.alternate=c}return f.default(t,[{key:"get",value:function(t){var e=this.t-this.delay,n=this.alternate&&Math.floor(e/this.clip.duration)%2==1;e%=this.clip.duration,e=l.xor(this.reverse,n)?this.clip.duration-e:e;var r={};if(this.t>=this.delay)for(var i in this.clip.properties){var a=this.clip.properties[i];if(l.is.function(a))a=this.clip.convert(a(e,this.clip.duration),i),a=I.toBase(a,i,t);else{i in this.indices||(this.indices[i]=this.reverse?a.length-1:0);var o=this.reverse?-1:1,s=this.indices[i],u=a[s],c=a[s+o],h=u.set,f=void 0;if(this.reverse?c.time>=e:c.time<=e){this.indices[i]=s+=o;var p=["start","end"],v=p[+!this.reverse],d=p[+this.reverse];v in u||d in c?(h=v in u?u[v]:c[d],f=!0):(u=a[s],c=a[s+o])}if(l.is.null(h)&&(h=l.getProperty(t,i)),h=I.toBase(h,i,t),f)a=I.toBase(h,i,t);else{var y=l.is.null(c.set)?l.getProperty(t,i):c.set;y=I.toBase(y,i,t);var m=M[c.interpolate]||E;a=P(h,y,(e-u.time)/(c.time-u.time),m)}}r[i]=a}return r}},{key:"step",value:function(t){return this.t+=t,this.t>=this.T}}]),t}();function q(t){var e=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(t){return!1}}();return function(){var n,r=d.default(t);if(e){var i=d.default(this).constructor;n=Reflect.construct(r,arguments,i)}else n=r.apply(this,arguments);return v.default(this,n)}}var L=function(t){p.default(n,t);var e=q(n);function n(t){return h.default(this,n),e.call(this,{duration:1/0,properties:{},convert:t})}return f.default(n,[{key:"add",value:function(t,e){this.clip.properties[t]=e}}]),n}(z),B=["duration","delay","repeat","alternate","origin"];function C(t,e){var n="undefined"!=typeof Symbol&&t[Symbol.iterator]||t["@@iterator"];if(!n){if(Array.isArray(t)||(n=function(t,e){if(!t)return;if("string"==typeof t)return V(t,e);var n=Object.prototype.toString.call(t).slice(8,-1);"Object"===n&&t.constructor&&(n=t.constructor.name);if("Map"===n||"Set"===n)return Array.from(t);if("Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return V(t,e)}(t))||e&&t&&"number"==typeof t.length){n&&(t=n);var r=0,i=function(){};return{s:i,n:function(){return r>=t.length?{done:!0}:{done:!1,value:t[r++]}},e:function(t){throw t},f:i}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var a,o=!0,s=!1;return{s:function(){n=n.call(t)},n:function(){var t=n.next();return o=t.done,t},e:function(t){s=!0,a=t},f:function(){try{o||null==n.return||n.return()}finally{if(s)throw a}}}}function V(t,e){(null==e||e>t.length)&&(e=t.length);for(var n=0,r=new Array(e);n<e;n++)r[n]=t[n];return r}function D(t,e){var n=Object.keys(t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(t);e&&(r=r.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),n.push.apply(n,r)}return n}function R(t){for(var e=1;e<arguments.length;e++){var n=null!=arguments[e]?arguments[e]:{};e%2?D(Object(n),!0).forEach((function(e){y.default(t,e,n[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(n)):D(Object(n)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(n,e))}))}return t}var _=function(){function t(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},n=e.duration,r=void 0===n?1:n,i=e.delay,a=e.repeat,o=e.alternate,s=e.origin,u=void 0===s?{x:.5,y:.5}:s,c=g.default(e,B),f=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};h.default(this,t),this.duration=r,this.origin=S(u),this.initial=f,this.initials=R({},f),this.channel=new L(this.convert.bind(this)),this.properties=this.parse(c),this.isEmpty=l.is.empty(this.properties),this.defaults={delay:i,repeat:a,alternate:o}}return f.default(t,[{key:"length",value:function(){return this.duration*(this.defaults.repeat||1)+(this.defaults.delay||0)}},{key:"parse",value:function(t){var e=this,n=function(n){var r=t[n];if(l.Link.isInstance(r))return e.channel.add(n,r),delete t[n],"continue";if(l.is.function(r))return"continue";(r=l.is.array(r)?r:[r]).length<2?r.unshift(n in e.initial?e.initial[n]:null):e.initials[n]=r[0];for(var i=r.map((function(t){return e.sanitize(t,n)})),a=0;a<i.length;a++)e.quantize(i,a);t[n]=i};for(var r in t)n(r);for(var i in this.initials)this.initials[i]=this.convert(this.initials[i],i);return t}},{key:"sanitize",value:function(t,e){l.is.object(t)||(t={set:t}),l.hasSomeKey(t,b)||(t={set:t}),"set"in t||(t.set="start"in t?t.start:t.end),"time"in t&&t.time>this.duration&&delete t.time,t=R({},t);var n,r=C(b);try{for(r.s();!(n=r.n()).done;){var i=n.value;i in t&&(t[i]=this.convert(t[i],e))}}catch(t){r.e(t)}finally{r.f()}return t}},{key:"quantize",value:function(t,e){var n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:e-1;if("time"in t[e])return t[e].time;if(0==e||e==t.length-1)return t[e].time=0==e?0:this.duration;var r=this.quantize(t,n,n);return t[e].time=r+(this.quantize(t,e+1,n)-r)*((e-n)/(e-n+1))}},{key:"convert",value:function(t,e){if(l.is.null(t))return e in this.initial?this.convert(this.initial[e],e):null;if(l.is.object(t)){var n,r=Object.keys(t),i=C(x);try{for(i.s();!(n=i.n()).done;){var a=n.value;if(l.hasSomeKey(t,a)){r=a;break}}}catch(t){i.e(t)}finally{i.f()}t=R({},t);var o,s=C(r);try{for(s.s();!(o=s.n()).done;){var u=o.value,c=e in O?O[e][u]:O[u];t[u]=u in t?this.convert(t[u]):c}}catch(t){s.e(t)}finally{s.f()}return t}var h;if(l.is.string(t)){if(t.match(/^#[0-9a-f]{3,8}$/i))return function(t){var e=t.match(/^#([\da-f]{1,2})([\da-f]{1,2})([\da-f]{1,2})([\da-f]{2})?/i),n=m.default(e,5);n[0];var r=n[1],i=n[2],a=n[3],o=n[4];return{r:parseInt(r.padStart(2,r),16),g:parseInt(i.padStart(2,i),16),b:parseInt(a.padStart(2,a),16),a:void 0!==o?parseInt(o,16):255}}(t);if(t.match(/^rgba?\(.*\)$/i))return function(t){var e=t.match(/^rgba?\((\d+)\D+(\d+)\D+(\d+)\D*(\d+)?\)/i),n=m.default(e,5);n[0];var r=n[1],i=n[2],a=n[3],o=n[4];return{r:parseInt(r),g:parseInt(i),b:parseInt(a),a:void 0!==o?parseInt(o):255}}(t);var f=function(t){var e=t.toString().match(/^([\d.]+)([^\d.]*)$/i);return e?[parseFloat(e[1]),e[2]]:[t,null]}(t),p=m.default(f,2);if(t=p[0],!(h=p[1]))return[t,h]}return[t,h=I.normalize(h,e)]}},{key:"play",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};return new z(this,l.mergeObjects(t,this.defaults))}}]),t}();function T(t,e){var n="undefined"!=typeof Symbol&&t[Symbol.iterator]||t["@@iterator"];if(!n){if(Array.isArray(t)||(n=function(t,e){if(!t)return;if("string"==typeof t)return U(t,e);var n=Object.prototype.toString.call(t).slice(8,-1);"Object"===n&&t.constructor&&(n=t.constructor.name);if("Map"===n||"Set"===n)return Array.from(t);if("Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return U(t,e)}(t))||e&&t&&"number"==typeof t.length){n&&(t=n);var r=0,i=function(){};return{s:i,n:function(){return r>=t.length?{done:!0}:{done:!1,value:t[r++]}},e:function(t){throw t},f:i}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var a,o=!0,s=!1;return{s:function(){n=n.call(t)},n:function(){var t=n.next();return o=t.done,t},e:function(t){s=!0,a=t},f:function(){try{o||null==n.return||n.return()}finally{if(s)throw a}}}}function U(t,e){(null==e||e>t.length)&&(e=t.length);for(var n=0,r=new Array(e);n<e;n++)r[n]=t[n];return r}var $=function(){function t(){h.default(this,t),this.t=Date.now(),this.managers=[],this.step()}return f.default(t,[{key:"step",value:function(){var t,e=Date.now(),n=T(this.managers);try{for(n.s();!(t=n.n()).done;){t.value.step((e-this.t)/1e3)}}catch(t){n.e(t)}finally{n.f()}this.t=e,requestAnimationFrame(this.step.bind(this))}},{key:"add",value:function(t){this.managers.push(t)}},{key:"remove",value:function(t){this.managers.splice(this.managers.indexOf(t),1)}}],[{key:"get",value:function(){return window.Lively||(window.Lively=new t),window.Lively}}]),t}(),H=function(){function t(e){var n=!(arguments.length>1&&void 0!==arguments[1])||arguments[1];h.default(this,t),this.element=e,this.tracks=[],this.queue=[],this.playing=!0,this.culling=n}return f.default(t,[{key:"purge",value:function(){this.element.style={},this.element.style.strokeDasharray=1}},{key:"clear",value:function(){this.tracks=[],this.queue=[]}},{key:"add",value:function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},n=e.immediate,r=void 0!==n&&n,i=e.composite,a=void 0===i||i;r&&this.clear(),a||!this.tracks.length?this.tracks.push(t):this.queue.push(t)}},{key:"remove",value:function(t){this.tracks.splice(this.tracks.indexOf(t),1),!this.tracks.length&&this.queue.length&&this.tracks.push(this.queue.shift())}},{key:"step",value:function(t){if(this.playing){for(var e={},n=0;n<this.tracks.length+1;n++){var r=this.tracks[n]||this.channel;!r||this.culling&&!l.is.visible(this.element)||l.mergeProperties(e,r.get(this.element)),r.step(t)&&this.remove(r)}this.apply(this.element,e)}}},{key:"apply",value:function(t,e){if(!l.is.empty(e)){var n=[];for(var r in e){var i=e[r];"length"===r?t.style.strokeDashoffset=1-i[0]:"active"===r?t.style.display=i[0]?"":"none":"interact"===r?t.style.pointerEvents=i[0]?"all":"none":"clip"===r?(t.style.clipPath="inset(".concat(A(i,["top","right","bottom","left"]),")"),t.style.webkitClipPath=t.style.clipPath):j.includes(r)?(i=l.is.object(i)?"".concat(r,"(").concat(A(i,["x","y"]),")"):"".concat(r,"(").concat(i.join(""),")"),n.push(i)):l.is.object(i)&&"r"in i?t.style[r]="rgba(".concat(i.r[0],", ").concat(i.g[0],", ").concat(i.b[0],", ").concat(i.a[0],")"):t.style[r]=l.is.null(i[1])?i[0]:i[0]+i[1]}n.length&&(t.style.transform=n.join(" "))}}},{key:"initialize",value:function(t){this.apply(this.element,t.initials),this.channel=t.channel}}]),t}();function W(t,e){var n="undefined"!=typeof Symbol&&t[Symbol.iterator]||t["@@iterator"];if(!n){if(Array.isArray(t)||(n=function(t,e){if(!t)return;if("string"==typeof t)return F(t,e);var n=Object.prototype.toString.call(t).slice(8,-1);"Object"===n&&t.constructor&&(n=t.constructor.name);if("Map"===n||"Set"===n)return Array.from(t);if("Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return F(t,e)}(t))||e&&t&&"number"==typeof t.length){n&&(t=n);var r=0,i=function(){};return{s:i,n:function(){return r>=t.length?{done:!0}:{done:!1,value:t[r++]}},e:function(t){throw t},f:i}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var a,o=!0,s=!1;return{s:function(){n=n.call(t)},n:function(){var t=n.next();return o=t.done,t},e:function(t){s=!0,a=t},f:function(){try{o||null==n.return||n.return()}finally{if(s)throw a}}}}function F(t,e){(null==e||e>t.length)&&(e=t.length);for(var n=0,r=new Array(e);n<e;n++)r[n]=t[n];return r}var K=function(){function t(e,n){h.default(this,t),this.targets=[],this.stagger=e,this.useCulling=n}return f.default(t,[{key:"register",value:function(){$.get().add(this)}},{key:"destroy",value:function(){this.targets=[],$.get().remove(this)}},{key:"purge",value:function(){var t,e=W(this.targets);try{for(e.s();!(t=e.n()).done;){t.value.purge()}}catch(t){e.e(t)}finally{e.f()}}},{key:"clear",value:function(){var t,e=W(this.targets);try{for(e.s();!(t=e.n()).done;){t.value.clear()}}catch(t){e.e(t)}finally{e.f()}}},{key:"set",value:function(t){var e=this;this.targets=t.map((function(t){return new H(t,e.useCulling)}))}},{key:"play",value:function(t,e){for(var n=0;n<this.targets.length;n++)e.delay=(e.delay||0)+n*this.stagger,t.isEmpty||this.targets[n].add(t.play(e),e)}},{key:"initialize",value:function(t){var e,n=W(this.targets);try{for(n.s();!(e=n.n()).done;){e.value.initialize(t)}}catch(t){n.e(t)}finally{n.f()}}},{key:"step",value:function(t){var e,n=W(this.targets);try{for(n.s();!(e=n.n()).done;){e.value.step(t)}}catch(t){n.e(t)}finally{n.f()}}}]),t}();function N(t,e){var n="undefined"!=typeof Symbol&&t[Symbol.iterator]||t["@@iterator"];if(!n){if(Array.isArray(t)||(n=function(t,e){if(!t)return;if("string"==typeof t)return X(t,e);var n=Object.prototype.toString.call(t).slice(8,-1);"Object"===n&&t.constructor&&(n=t.constructor.name);if("Map"===n||"Set"===n)return Array.from(t);if("Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return X(t,e)}(t))||e&&t&&"number"==typeof t.length){n&&(t=n);var r=0,i=function(){};return{s:i,n:function(){return r>=t.length?{done:!0}:{done:!1,value:t[r++]}},e:function(t){throw t},f:i}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var a,o=!0,s=!1;return{s:function(){n=n.call(t)},n:function(){var t=n.next();return o=t.done,t},e:function(t){s=!0,a=t},f:function(){try{o||null==n.return||n.return()}finally{if(s)throw a}}}}function X(t,e){(null==e||e>t.length)&&(e=t.length);for(var n=0,r=new Array(e);n<e;n++)r[n]=t[n];return r}function G(t){var e=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(t){return!1}}();return function(){var n,r=d.default(t);if(e){var i=d.default(this).constructor;n=Reflect.construct(r,arguments,i)}else n=r.apply(this,arguments);return v.default(this,n)}}var J=function(t){p.default(n,t);var e=G(n);function n(t){var r;for(var i in h.default(this,n),(r=e.call(this,t)).animations={default:r.parse(r.props.animate)},r.props.animations)r.animations[i]=r.parse(r.props.animations[i]);return r.children=[],r.elements=[],r.manager=new K(r.props.stagger,r.props.lazy),r}return f.default(n,[{key:"parse",value:function(t){return l.is.object(t)?new _(t,this.props.initial):null}},{key:"update",value:function(){this.manager.purge(),this.manager.initialize(this.animations.default)}},{key:"componentDidMount",value:function(){var t=this;this.resizeEventListener=l.debounce(this.update.bind(this)),l.addEventListener("resize",this.resizeEventListener),this.scrollEventListener=l.throttle(this.onScroll.bind(this)),l.addEventListener("scroll",this.scrollEventListener),this.eventListener=this.onEvent.bind(this),l.onAny(n.events,this.elements,this.eventListener),this.manager.set(this.elements),this.manager.register(),this.update(),document.fonts.ready.then((function(){t.update(),t.manager.clear(),t.inViewport=!1,t.props.group||(t.play(t.props.onMount),t.onScroll())}))}},{key:"componentWillUnmount",value:function(){l.removeEventListener("resize",this.resizeEventListener),l.removeEventListener("scroll",this.scrollEventListener),l.offAny(n.events,this.elements,this.eventListener),this.manager.destroy()}},{key:"dispatch",value:function(t){l.is.function(this.props[t])&&this.props[t]()}},{key:"onEvent",value:function(t){switch(t.type){case"click":this.play(this.props.onClick);break;case"mouseenter":this.hover||(this.hover=!0,this.play(this.props.whileHover));break;case"mouseleave":this.hover&&(this.hover=!1,this.play(this.props.whileHover,{reverse:!0}));break;case"focus":this.focus||(this.focus=!0,this.play(this.props.whileFocus));break;case"blur":this.focus&&(this.focus=!1,this.play(this.props.whileFocus,{reverse:!0}))}}},{key:"getBoundingBox",value:function(){var t,e={x:Number.MAX_VALUE,y:Number.MAX_VALUE,right:0,bottom:0},n=N(this.elements.length?this.elements:this.children);try{for(n.s();!(t=n.n()).done;){var r=t.value,i=this.elements.length?r.getBoundingClientRect():r.getBoundingBox();e.y=Math.min(i.y,e.y),e.x=Math.min(i.x,e.x),e.right=Math.max(i.right,e.right),e.bottom=Math.max(i.bottom,e.bottom)}}catch(t){n.e(t)}finally{n.f()}return e}},{key:"onScroll",value:function(){if(this.props.whileViewport){var t=l.is.inViewport(this.getBoundingBox(),this.props.viewportMargin),e=t.entered,n=t.left;e&&!this.inViewport&&(this.inViewport=!0,this.play(this.props.whileViewport),this.dispatch("onEnterViewport")),n&&this.inViewport&&(this.inViewport=!1,this.play(this.props.whileViewport,{reverse:!0,immediate:!0}),this.dispatch("onLeaveViewport"))}}},{key:"play",value:function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},n=e.reverse,r=void 0!==n&&n,i=e.composite,a=void 0!==i&&i,o=e.immediate,s=void 0!==o&&o,u=e.delay,c=void 0===u?0:u,h=arguments.length>2&&void 0!==arguments[2]&&arguments[2];if(!(!t||this.props.disabled||this.props.group>0&&!h)){l.is.string(t)||(t="default"),this.dispatch("onAnimationStart");var f,p=this.animations[t],v=p.length()+c,d=0,y=N(this.children);try{for(y.s();!(f=y.n()).done;){var m=f.value;d=Math.max(d,m.play(t,{reverse:r,immediate:s,delay:m.props.group*v},!0))}}catch(t){y.e(t)}finally{y.f()}return this.manager.play(p,{reverse:r,composite:a,immediate:s,delay:r?d:c}),v+(r?d:0)}}},{key:"pause",value:function(){}},{key:"stop",value:function(){}},{key:"prerender",value:function(t){var e=this,r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0,i=arguments.length>2&&void 0!==arguments[2]?arguments[2]:0;return o.Children.map(t,(function(t,a){if(!o.isValidElement(t))return t;var s={pathLength:1};t:if(n.isInstance(t)){if(e.props.group>0||t.props.noCascade)break t;s.group=++r;var u=e.childIndex++;s.ref=function(t){return e.children[u]=t},l.mergeObjects(s,e.props,["animate","initial","animations","stagger"])}else i||(s.ref=function(t){return e.elements[a]=t});return o.cloneElement(t,s,e.prerender(t.props.children,r,i+1))}))}},{key:"render",value:function(){return this.childIndex=0,this.prerender(this.props.children)}}],[{key:"isInstance",value:function(t){return t.type===n||t.type.prototype instanceof n}}]),n}(o.Component);y.default(J,"events",["click","mouseenter","mouseleave","focus","blur"]),y.default(J,"defaultProps",{group:0,stagger:.1,viewportMargin:.75,lazy:!0,animate:{},animations:{}}),exports.Animatable=J;
