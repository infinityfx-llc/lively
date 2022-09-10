"use strict";var t=require("@babel/runtime/helpers/typeof"),n=require("@babel/runtime/helpers/slicedToArray");function r(t){return t&&"object"==typeof t&&"default"in t?t:{default:t}}var e=r(t),o=r(n),i=["%","px","em","rem","vw","vh","vmin","vmax","deg","rad"],a=["opacity","active","interact","zIndex","lineHeight","fontWeight","length"],u=["translate","scale","skew","rotate"];function c(t,n){var r="undefined"!=typeof Symbol&&t[Symbol.iterator]||t["@@iterator"];if(!r){if(Array.isArray(t)||(r=function(t,n){if(!t)return;if("string"==typeof t)return l(t,n);var r=Object.prototype.toString.call(t).slice(8,-1);"Object"===r&&t.constructor&&(r=t.constructor.name);if("Map"===r||"Set"===r)return Array.from(t);if("Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r))return l(t,n)}(t))||n&&t&&"number"==typeof t.length){r&&(t=r);var e=0,o=function(){};return{s:o,n:function(){return e>=t.length?{done:!0}:{done:!1,value:t[e++]}},e:function(t){throw t},f:o}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var i,a=!0,u=!1;return{s:function(){r=r.call(t)},n:function(){var t=r.next();return a=t.done,t},e:function(t){u=!0,i=t},f:function(){try{a||null==r.return||r.return()}finally{if(u)throw i}}}}function l(t,n){(null==n||n>t.length)&&(n=t.length);for(var r=0,e=new Array(n);r<n;r++)e[r]=t[r];return e}var f={null:function(t){return null==t},array:function(t){return Array.isArray(t)},object:function(t){return!f.null(t)&&"object"===e.default(t)&&!f.array(t)},function:function(t){return t instanceof Function},string:function(t){return"string"==typeof t},bool:function(t){return"boolean"==typeof t},number:function(t){return"number"==typeof t},empty:function(t){return function(t,n){return Object.keys(t).length===n}(t,0)},inViewport:function(t){var n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0,r=t.y,e=t.bottom,o=e-r;return{left:r>window.innerHeight+o*n,entered:r+o*n<window.innerHeight}},visible:function(t){var n=t.getBoundingClientRect(),r=n.x,e=n.y,o=n.right,i=n.bottom;return!(o-r<1||i-e<1)&&(e<window.innerHeight&&i>0&&r<window.innerWidth&&o>0)},rgb:function(t){return t.match(/^rgba?\(.*\)$/i)},hex:function(t){return t.match(/^#[0-9a-f]{3,8}$/i)}},s=function t(n,r){var e=arguments.length>2&&void 0!==arguments[2]&&arguments[2];if(f.object(n)){var o={};for(var i in n)o[i]=t(n[i],r[i]);return o}return[(n[0]+r[0])/(+e+1),n[1]]},d=function(t){var n=t.match(/^rgba?\((\d+)\D+(\d+)\D+(\d+)\D*(\d+)?\)/i),r=o.default(n,5);r[0];var e=r[1],i=r[2],a=r[3],u=r[4],c=function(t){return[f.null(t)?255:parseInt(t),null]};return{r:c(e),g:c(i),b:c(a),a:c(u)}},p=function(t){var n=t.toString().match(/^([\d.]+)([^\d.]*)$/i);return n?[parseFloat(n[1]),n[2]]:[t,null]},v={emtopx:function(t){var n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:document.body;return t*parseFloat(getComputedStyle(n).fontSize)},remtopx:function(t){return v.emtopx(t)},vwtopx:function(t){return t*window.innerWidth},vhtopx:function(t){return t*window.innerHeight},vmintopx:function(t){return t*Math.min(window.innerWidth,window.innerHeight)},vmaxtopx:function(t){return t*Math.max(window.innerWidth,window.innerHeight)},radtodeg:function(t){return 180*t/Math.PI},fromProperty:function(t){return["rotate","skew"].includes(t)?"deg":["clip","scale"].includes(t)?"%":a.includes(t)?null:"px"},toBase:function(t,n,r){if(f.object(t)){var e={};for(var o in t)e[o]=v.toBase(t[o],n);return e}var i=v.fromProperty(n),a="".concat(t[1],"to").concat(i);return f.null(t[1])&&!f.null(i)?[t[0],i]:a in v?[v[a](t[0],r),i]:t},normalize:function(t,n){return f.null(t)&&a.includes(n)||i.includes(t)?t:v.fromProperty(n)}},g={bind:function(t,n){t.origin=t.origin||t;var r=function(){for(var r,e=arguments.length,o=new Array(e),i=0;i<e;i++)o[i]=arguments[i];return(r=t.origin).call.apply(r,[n].concat(o))};return r.origin=t.origin,r},create:function(t){var n=g.bind((function(t){if(f.function(t)){var r=g.bind(n,{transform:t});return r.set=n.set,r.internal=n.internal,r}return this.transform(n.internal.value)}),{transform:function(t){return t}});return n.set=function(t){var r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0;n.internal.value=t,n.internal.duration=r,n.internal.t=null},n.internal={value:t,duration:0},n},isInstance:function(t){return f.function(t)&&f.function(t.set)}},h=g;exports.DEFAULTS={translate:{x:[0,"px"],y:[0,"px"]},scale:{x:[100,"%"],y:[100,"%"]},clip:{left:[0,"%"],top:[0,"%"],right:[0,"%"],bottom:[0,"%"]},r:[127,null],g:[127,null],b:[127,null],a:[255,null]},exports.Link=h,exports.PARSABLE_OBJECTS=[["x","y"],["r","g","b","a"],["left","top","right","bottom"]],exports.POSITIONS=["set","start","end"],exports.TRANSFORMS=u,exports.Units=v,exports.debounce=function(t){var n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:250;return function(){clearTimeout(t.LivelyTimeout),t.LivelyTimeout=setTimeout(t,n)}},exports.getProperty=function(t,n){var r=getComputedStyle(t);if(u.includes(n)){var e=new DOMMatrix(r.transform);switch(n){case"translate":return{x:[e.e,"px"],y:[e.f,"px"]};case"scale":return{x:[100*Math.sqrt(e.a*e.a+e.b*e.b)*Math.sign(e.a),"%"],y:[100*Math.sqrt(e.c*e.c+e.d*e.d)*Math.sign(e.c),"%"]};case"rotate":case"skew":var o=180*Math.atan2(e.d,e.c)/Math.PI-90,i=180*Math.atan2(e.b,e.a)/Math.PI;return"rotate"===n?[i,"deg"]:{x:[o,"deg"],y:[0,"deg"]}}}var a=r[n];return f.rgb(a)?d(a):p(a)},exports.hasSomeKey=function(t,n){return Object.keys(t).some((function(t){return n.includes(t)}))},exports.hexToRgba=function(t){var n=t.match(/^#([\da-f]{1,2})([\da-f]{1,2})([\da-f]{1,2})([\da-f]{2})?/i),r=o.default(n,5);r[0];var e=r[1],i=r[2],a=r[3],u=r[4],c=function(t){return[f.null(t)?255:parseInt(t.padStart(2,t),16),null]};return{r:c(e),g:c(i),b:c(a),a:c(u)}},exports.is=f,exports.mergeObjects=function(t,n){var r,e=arguments.length>2&&void 0!==arguments[2]?arguments[2]:Object.keys(n),o=c(e);try{for(o.s();!(r=o.n()).done;){var i=r.value;f.null(n[i])||(t[i]=n[i])}}catch(t){o.e(t)}finally{o.f()}return t},exports.mergeProperties=function(t,n){for(var r in n)t[r]=r in t?s(t[r],n[r],"origin"===r):n[r]},exports.objToStr=function(t,n){var r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:Object.keys(t);return r.map((function(n){return t[n].join("")})).join(n)},exports.originToStr=function(t){var n=f.object(t)?t:{},r=n.x,e=void 0===r?.5:r,o=n.y,i=void 0===o?.5:o;if(f.string(t))switch(t){case"left":e=0;break;case"right":e=1;break;case"top":i=0;break;case"bottom":i=1}return{x:e,y:i}},exports.padArray=function(t,n){return new Array(n).fill(0).map((function(n,r){return r<t.length?t[r]:t[t.length-1]}))},exports.strToRgba=d,exports.styleToArr=p,exports.throttle=function(t){var n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:250;return function(){var r=Date.now();t.LivelyTimestamp-r<n||(t.LivelyTimestamp=r,t())}},exports.xor=function(t,n){return t&&!n||!t&&n};
