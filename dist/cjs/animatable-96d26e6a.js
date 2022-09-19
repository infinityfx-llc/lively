"use strict";var e=require("@babel/runtime/helpers/classCallCheck"),t=require("@babel/runtime/helpers/createClass"),r=require("@babel/runtime/helpers/inherits"),n=require("@babel/runtime/helpers/possibleConstructorReturn"),i=require("@babel/runtime/helpers/getPrototypeOf"),o=require("@babel/runtime/helpers/defineProperty"),a=require("react"),s=require("./animation-ebe42adf.js"),l=require("./link-27893881.js"),u=require("./events-d2682977.js");function c(e){return e&&"object"==typeof e&&"default"in e?e:{default:e}}var h=c(e),f=c(t),p=c(r),y=c(n),d=c(i),v=c(o);function m(e,t){var r="undefined"!=typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(!r){if(Array.isArray(e)||(r=function(e,t){if(!e)return;if("string"==typeof e)return g(e,t);var r=Object.prototype.toString.call(e).slice(8,-1);"Object"===r&&e.constructor&&(r=e.constructor.name);if("Map"===r||"Set"===r)return Array.from(e);if("Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r))return g(e,t)}(e))||t&&e&&"number"==typeof e.length){r&&(e=r);var n=0,i=function(){};return{s:i,n:function(){return n>=e.length?{done:!0}:{done:!1,value:e[n++]}},e:function(e){throw e},f:i}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var o,a=!0,s=!1;return{s:function(){r=r.call(e)},n:function(){var e=r.next();return a=e.done,e},e:function(e){s=!0,o=e},f:function(){try{a||null==r.return||r.return()}finally{if(s)throw o}}}}function g(e,t){(null==t||t>e.length)&&(t=e.length);for(var r=0,n=new Array(t);r<t;r++)n[r]=e[r];return n}var b=function(){function e(){h.default(this,e),this.t=Date.now(),this.managers=[],this.step()}return f.default(e,[{key:"step",value:function(){var e,t=Date.now(),r=m(this.managers);try{for(r.s();!(e=r.n()).done;){e.value.step((t-this.t)/1e3)}}catch(e){r.e(e)}finally{r.f()}this.t=t,requestAnimationFrame(this.step.bind(this))}},{key:"add",value:function(e){var t=Math.max(this.managers.findIndex((function(t){return t.priority>=e.priority})),0);this.managers.splice(t,0,e)}},{key:"remove",value:function(e){this.managers.splice(this.managers.indexOf(e),1)}}],[{key:"get",value:function(){return window.Lively||(window.Lively=new e),window.Lively}}]),e}();function w(e,t){var r="undefined"!=typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(!r){if(Array.isArray(e)||(r=function(e,t){if(!e)return;if("string"==typeof e)return k(e,t);var r=Object.prototype.toString.call(e).slice(8,-1);"Object"===r&&e.constructor&&(r=e.constructor.name);if("Map"===r||"Set"===r)return Array.from(e);if("Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r))return k(e,t)}(e))||t&&e&&"number"==typeof e.length){r&&(e=r);var n=0,i=function(){};return{s:i,n:function(){return n>=e.length?{done:!0}:{done:!1,value:e[n++]}},e:function(e){throw e},f:i}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var o,a=!0,s=!1;return{s:function(){r=r.call(e)},n:function(){var e=r.next();return a=e.done,e},e:function(e){s=!0,o=e},f:function(){try{a||null==r.return||r.return()}finally{if(s)throw o}}}}function k(e,t){(null==t||t>e.length)&&(t=e.length);for(var r=0,n=new Array(t);r<t;r++)n[r]=e[r];return n}var O=function(){function e(t,r,n){h.default(this,e),this.element=t,this.tracks=[],this.queue=[],this.playing=!0,this.culling=r,this.layout=n,this.transforms=["translate","scale","skew","rotate"]}return f.default(e,[{key:"purge",value:function(){if(!("cache"in this.element)){this.element.cache={strokeDasharray:1,borderRadius:l.getProperty(this.element,"borderRadius")};for(var e=0;e<this.element.style.length;e++){var t=this.element.style[e];this.element.cache[t]=this.element.style[t]}}for(var r in this.element.style={},this.element.cache)this.element.style[r]=this.element.cache[r]}},{key:"clear",value:function(){this.tracks=[],this.queue=[]}},{key:"add",value:function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},r=t.immediate,n=void 0!==r&&r,i=t.composite,o=void 0===i||i;n&&this.clear(),o||!this.tracks.length?this.tracks.push(e):this.queue.push(e)}},{key:"remove",value:function(e){this.tracks.splice(this.tracks.indexOf(e),1),!this.tracks.length&&this.queue.length&&this.tracks.push(this.queue.shift())}},{key:"step",value:function(e){if(this.playing){for(var t=this.element.correction?{scale:l.DEFAULT_OBJECTS.scale}:{},r=this.tracks.length+ +!this.channel.isEmpty,n=0;n<r;n++){var i=this.tracks[n]||this.channel;l.mergeProperties(t,i.get(this.element,this.culling)),i.step(e)&&this.remove(i)}this.apply(this.element,t)}}},{key:"apply",value:function(e,t){if(!l.is.empty(t)){var r=[];for(var n in t){var i=t[n];if("scale"==n){if(this.layout){var o,a={x:[1/i.x[0],i.x[1]],y:[1/i.y[0],i.y[1]]},s=w(e.children);try{for(s.s();!(o=s.n()).done;){o.value.correction=a}}catch(e){s.e(e)}finally{s.f()}var u=t.borderRadius||e.cache.borderRadius;delete t.borderRadius,e.style.borderRadius="".concat(u[0]/i.x[0]).concat(u[1]," / ").concat(u[0]/i.y[0]).concat(u[1])}e.correction&&(i=l.merge(i,e.correction,l.MERGE_FUNCTIONS.scale))}var c=this.transforms.indexOf(n);c>=0?r[c]="".concat(n,"(").concat(l.is.object(i)?l.objToStr(i,", ",["x","y"]):l.arrToStyle(i),")"):(n=l.Aliases[n]||n,l.is.color(i)?e.style[n]="rgba(".concat(i.r[0],", ").concat(i.g[0],", ").concat(i.b[0],", ").concat(i.a[0],")"):e.style[n]=n in l.Aliases?l.Aliases[n](i):l.arrToStyle(i))}(r=r.filter((function(e){return!!e}))).length&&(e.style.transform=r.join(" "))}}},{key:"initialize",value:function(e){this.apply(this.element,e.initials),this.channel=e.channel}}]),e}();function j(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function A(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?j(Object(r),!0).forEach((function(t){v.default(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):j(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function S(e,t){var r="undefined"!=typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(!r){if(Array.isArray(e)||(r=function(e,t){if(!e)return;if("string"==typeof e)return x(e,t);var r=Object.prototype.toString.call(e).slice(8,-1);"Object"===r&&e.constructor&&(r=e.constructor.name);if("Map"===r||"Set"===r)return Array.from(e);if("Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r))return x(e,t)}(e))||t&&e&&"number"==typeof e.length){r&&(e=r);var n=0,i=function(){};return{s:i,n:function(){return n>=e.length?{done:!0}:{done:!1,value:e[n++]}},e:function(e){throw e},f:i}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var o,a=!0,s=!1;return{s:function(){r=r.call(e)},n:function(){var e=r.next();return a=e.done,e},e:function(e){s=!0,o=e},f:function(){try{a||null==r.return||r.return()}finally{if(s)throw o}}}}function x(e,t){(null==t||t>e.length)&&(t=e.length);for(var r=0,n=new Array(t);r<t;r++)n[r]=e[r];return n}var E=function(){function e(t){var r=t.priority,n=void 0===r?0:r,i=t.stagger,o=void 0===i?.1:i,a=t.culling,s=void 0===a||a,l=t.noDeform,u=void 0!==l&&l,c=t.paused,f=void 0!==c&&c;h.default(this,e),this.targets=[],this.priority=n,this.stagger=o,this.culling=s,this.noDeform=u,this.paused=f}return f.default(e,[{key:"register",value:function(){b.get().add(this)}},{key:"destroy",value:function(){this.targets=[],b.get().remove(this)}},{key:"purge",value:function(){var e,t=S(this.targets);try{for(t.s();!(e=t.n()).done;){e.value.purge()}}catch(e){t.e(e)}finally{t.f()}}},{key:"clear",value:function(){var e,t=S(this.targets);try{for(t.s();!(e=t.n()).done;){e.value.clear()}}catch(e){t.e(e)}finally{t.f()}}},{key:"set",value:function(e){var t=this;this.targets=e.map((function(e){return new O(e,t.culling,t.noDeform)}))}},{key:"play",value:function(e,t){if(!e.isEmpty)for(var r=0;r<this.targets.length;r++){var n=A(A({},t),{},{delay:(t.delay||0)+r*this.stagger});this.targets[r].add(e.play(n),t)}}},{key:"initialize",value:function(e){var t,r=S(this.targets);try{for(r.s();!(t=r.n()).done;){t.value.initialize(e)}}catch(e){r.e(e)}finally{r.f()}}},{key:"step",value:function(e){if(!this.paused){var t,r=S(this.targets);try{for(r.s();!(t=r.n()).done;){t.value.step(e)}}catch(e){r.e(e)}finally{r.f()}}}}]),e}();function P(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function I(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?P(Object(r),!0).forEach((function(t){v.default(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):P(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function D(e,t){var r="undefined"!=typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(!r){if(Array.isArray(e)||(r=function(e,t){if(!e)return;if("string"==typeof e)return M(e,t);var r=Object.prototype.toString.call(e).slice(8,-1);"Object"===r&&e.constructor&&(r=e.constructor.name);if("Map"===r||"Set"===r)return Array.from(e);if("Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r))return M(e,t)}(e))||t&&e&&"number"==typeof e.length){r&&(e=r);var n=0,i=function(){};return{s:i,n:function(){return n>=e.length?{done:!0}:{done:!1,value:e[n++]}},e:function(e){throw e},f:i}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var o,a=!0,s=!1;return{s:function(){r=r.call(e)},n:function(){var e=r.next();return a=e.done,e},e:function(e){s=!0,o=e},f:function(){try{a||null==r.return||r.return()}finally{if(s)throw o}}}}function M(e,t){(null==t||t>e.length)&&(t=e.length);for(var r=0,n=new Array(t);r<t;r++)n[r]=e[r];return n}function q(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}();return function(){var r,n=d.default(e);if(t){var i=d.default(this).constructor;r=Reflect.construct(n,arguments,i)}else r=n.apply(this,arguments);return y.default(this,r)}}var C=function(e){p.default(r,e);var t=q(r);function r(e){var n;for(var i in h.default(this,r),(n=t.call(this,e)).animations={default:n.parse(n.props.animate||{})},n.props.animations||{})n.animations[i]=n.parse(n.props.animations[i]);return n.children=[],n.elements=[],n.stagger=n.props.stagger||.1,n.manager=new E({priority:n.props.group,stagger:n.stagger,culling:n.props.lazy,noDeform:n.props.noDeform,paused:n.props.paused}),n}return f.default(r,[{key:"parse",value:function(e){return s.Animation.isInstance(e)?e.use():l.is.object(e)?new s.Clip(e,this.props.initial):null}},{key:"update",value:function(){this.manager.clear(),this.manager.purge(),this.manager.initialize(this.animations.default)}},{key:"componentDidMount",value:function(){var e=this;this.scrollEventListener=l.throttle(this.onScroll.bind(this)),u.addEventListener("scroll",this.scrollEventListener),this.eventListener=this.onEvent.bind(this),u.onAny(r.events,this.elements,this.eventListener),this.manager.set(this.elements),this.manager.register(),this.update(),document.fonts.ready.then((function(){e.update(),clearTimeout(e.timeout),e.inViewport=!1,e.props.group||(e.play(e.props.onMount),e.onScroll())}))}},{key:"componentWillUnmount",value:function(){u.removeEventListener("scroll",this.scrollEventListener),u.offAny(r.events,this.elements,this.eventListener),this.manager.destroy()}},{key:"componentDidUpdate",value:function(){this.manager.paused=this.props.paused;var e,t=D(this.children);try{for(t.s();!(e=t.n()).done;){e.value.manager.paused=this.props.paused}}catch(e){t.e(e)}finally{t.f()}}},{key:"dispatch",value:function(e){l.is.function(this.props[e])&&this.props[e]()}},{key:"onEvent",value:function(e){switch(e.type){case"click":this.play(this.props.onClick);break;case"mouseenter":this.hover||(this.hover=!0,this.play(this.props.whileHover));break;case"mouseleave":this.hover&&(this.hover=!1,this.play(this.props.whileHover,{reverse:!0}));break;case"focus":this.focus||(this.focus=!0,this.play(this.props.whileFocus));break;case"blur":this.focus&&(this.focus=!1,this.play(this.props.whileFocus,{reverse:!0}))}}},{key:"getBoundingBox",value:function(){var e,t={x:Number.MAX_VALUE,y:Number.MAX_VALUE,right:0,bottom:0},r=D(this.elements.length?this.elements:this.children);try{for(r.s();!(e=r.n()).done;){var n=e.value,i=this.elements.length?n.getBoundingClientRect():n.getBoundingBox();t.y=Math.min(i.y,t.y),t.x=Math.min(i.x,t.x),t.right=Math.max(i.right,t.right),t.bottom=Math.max(i.bottom,t.bottom)}}catch(e){r.e(e)}finally{r.f()}return t}},{key:"onScroll",value:function(){if(this.props.whileViewport){var e=l.inViewport(this.getBoundingBox(),this.props.viewportMargin),t=e.entered,r=e.left;t&&!this.inViewport&&(this.inViewport=!0,this.play(this.props.whileViewport),this.dispatch("onEnterViewport")),r&&this.inViewport&&(this.inViewport=!1,this.play(this.props.whileViewport,{reverse:!0,immediate:!0}),this.dispatch("onLeaveViewport"))}}},{key:"play",value:function(e){var t=this,r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},n=r.reverse,i=void 0!==n&&n,o=r.composite,a=void 0!==o&&o,s=r.immediate,u=void 0!==s&&s,c=r.delay,h=void 0===c?0:c,f=r.callback,p=arguments.length>2&&void 0!==arguments[2]&&arguments[2];if(!(!e||this.props.disabled||this.props.group>0&&!p)){l.is.string(e)||(e="default"),this.dispatch("onAnimationStart");var y,d=this.animations[e],v=d.length(),m=0,g=D(this.children);try{for(g.s();!(y=g.n()).done;){var b=y.value;m=Math.max(m,b.play(e,{reverse:i,immediate:u,delay:h+v},!0))}}catch(e){g.e(e)}finally{g.f()}return this.manager.play(d,{reverse:i,composite:a,immediate:u,delay:i?m:h}),u&&clearTimeout(this.timeout),this.props.group||(this.timeout=setTimeout((function(){t.dispatch("onAnimationEnd"),l.is.function(f)&&f()}),1e3*(m+v))),v+(i?m:h)}}},{key:"stop",value:function(){this.manager.clear()}},{key:"prerender",value:function(e){var t=this,n=!(arguments.length>1&&void 0!==arguments[1])||arguments[1],i=!(arguments.length>2&&void 0!==arguments[2])||arguments[2];return a.Children.map(e,(function(e){if(!a.isValidElement(e))return e;var o={pathLength:1},s=t.elementIndex++;if(n&&(o.ref=function(e){return t.elements[s]=e}),r.isInstance(e)&&i&&!e.props.noCascade){var u=t.childIndex++;i=!1,o.group=t.props.group+1,o.ref=function(e){return t.children[u]=e},t.props.group||(o.active=t.props.active),l.mergeObjects(o,I(I({},t.props),e.props),t.constructor.cascadingProps)}return a.cloneElement(e,o,t.prerender(e.props.children,!1,i))}))}},{key:"render",value:function(){return this.elementIndex=this.childIndex=0,this.prerender(this.props.children)}}],[{key:"isInstance",value:function(e){return e.type===r||e.type.prototype instanceof r}}]),r}(a.Component);v.default(C,"events",["click","mouseenter","mouseleave","focus","blur"]),v.default(C,"cascadingProps",["animate","initial","animations","stagger"]),v.default(C,"defaultProps",{group:0,viewportMargin:.75,lazy:!0,paused:!1}),exports.Animatable=C;
