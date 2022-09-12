import n from"@babel/runtime/helpers/typeof";import t from"@babel/runtime/helpers/slicedToArray";import r from"@babel/runtime/helpers/defineProperty";var e=["set","start","end"],i=["%","px","em","rem","vw","vh","vmin","vmax","deg","rad"],o=["opacity","zIndex","lineHeight","fontWeight","length"],a=[["x","y"],["r","g","b","a"],["left","top","right","bottom"]],u=["translate","scale","skew","rotate"],c={translate:{x:[0,"px"],y:[0,"px"]},scale:{x:[1,"%"],y:[1,"%"]},clip:{left:[0,"%"],top:[0,"%"],right:[0,"%"],bottom:[0,"%"]},r:[127,null],g:[127,null],b:[127,null],a:[255,null]};function f(n,t){var r="undefined"!=typeof Symbol&&n[Symbol.iterator]||n["@@iterator"];if(!r){if(Array.isArray(n)||(r=function(n,t){if(!n)return;if("string"==typeof n)return l(n,t);var r=Object.prototype.toString.call(n).slice(8,-1);"Object"===r&&n.constructor&&(r=n.constructor.name);if("Map"===r||"Set"===r)return Array.from(n);if("Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r))return l(n,t)}(n))||t&&n&&"number"==typeof n.length){r&&(n=r);var e=0,i=function(){};return{s:i,n:function(){return e>=n.length?{done:!0}:{done:!1,value:n[e++]}},e:function(n){throw n},f:i}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var o,a=!0,u=!1;return{s:function(){r=r.call(n)},n:function(){var n=r.next();return a=n.done,n},e:function(n){u=!0,o=n},f:function(){try{a||null==r.return||r.return()}finally{if(u)throw o}}}}function l(n,t){(null==t||t>n.length)&&(t=n.length);for(var r=0,e=new Array(t);r<t;r++)e[r]=n[r];return e}var s=function(n,t){return n&&!t||!n&&t},d=function(n,t){return Object.keys(n).some((function(n){return t.includes(n)}))},v={null:function(n){return null==n},array:function(n){return Array.isArray(n)},object:function(t){return!v.null(t)&&"object"===n(t)&&!v.array(t)},function:function(n){return n instanceof Function},string:function(n){return"string"==typeof n},bool:function(n){return"boolean"==typeof n},number:function(n){return"number"==typeof n},empty:function(n){return function(n,t){return Object.keys(n).length===t}(n,0)},inViewport:function(n){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0,r=n.y,e=n.bottom,i=e-r;return{left:r>window.innerHeight+i*t,entered:r+i*t<window.innerHeight}},visible:function(n){var t=n.getBoundingClientRect(),r=t.x,e=t.y,i=t.right,o=t.bottom;return!(i-r<1||o-e<1)&&(e<window.innerHeight&&o>0&&r<window.innerWidth&&i>0)},rgb:function(n){return n.match(/^rgba?\(.*\)$/i)},hex:function(n){return n.match(/^#[0-9a-f]{3,8}$/i)},color:function(n){return v.object(n)&&"r"in n}},b=function(n,t){var r=getComputedStyle(n);if(u.includes(t)){var e=new DOMMatrix(r.transform);switch(t){case"translate":return{x:[e.e,"px"],y:[e.f,"px"]};case"scale":return{x:[100*Math.sqrt(e.a*e.a+e.b*e.b)*Math.sign(e.a),"%"],y:[100*Math.sqrt(e.c*e.c+e.d*e.d)*Math.sign(e.c),"%"]};case"rotate":case"skew":var i=180*Math.atan2(e.d,e.c)/Math.PI-90,o=180*Math.atan2(e.b,e.a)/Math.PI;return"rotate"===t?[o,"deg"]:{x:[i,"deg"],y:[0,"deg"]}}}var a=r[t];return v.rgb(a)?M(a):T(a)},y=function(n,t){return new Array(t).fill(0).map((function(t,r){return r<n.length?n[r]:n[n.length-1]}))},h=function(n,t){var r,e=arguments.length>2&&void 0!==arguments[2]?arguments[2]:Object.keys(t),i=f(e);try{for(i.s();!(r=i.n()).done;){var o=r.value;v.null(t[o])||(n[o]=t[o])}}catch(n){i.e(n)}finally{i.f()}return n},p={translate:function(n,t){return n+t},rotate:function(n,t){return n+t},scale:function(n,t){return n*t},default:function(n,t){return(n+t)/2}},m=function n(t,r,e){if(v.object(t)){var i={};for(var o in t)i[o]=n(t[o],r[o],e);return i}return v.number(t[0])&&v.number(r[0])?[e(t[0],r[0]),t[1]]:r},g=function(n,t){for(var r in t){var e=p[r]||p.default;n[r]=r in n?m(n[r],t[r],e):t[r]}},w=function(n){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:250;return function(){clearTimeout(n.LivelyTimeout),n.LivelyTimeout=setTimeout(n,t)}},x=function(n){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:250;return function(){var r=Date.now();n.LivelyTimestamp-r<t||(n.LivelyTimestamp=r,n())}};function j(n,t){var r=Object.keys(n);if(Object.getOwnPropertySymbols){var e=Object.getOwnPropertySymbols(n);t&&(e=e.filter((function(t){return Object.getOwnPropertyDescriptor(n,t).enumerable}))),r.push.apply(r,e)}return r}function O(n){for(var t=1;t<arguments.length;t++){var e=null!=arguments[t]?arguments[t]:{};t%2?j(Object(e),!0).forEach((function(t){r(n,t,e[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(n,Object.getOwnPropertyDescriptors(e)):j(Object(e)).forEach((function(t){Object.defineProperty(n,t,Object.getOwnPropertyDescriptor(e,t))}))}return n}function P(n,t){var r="undefined"!=typeof Symbol&&n[Symbol.iterator]||n["@@iterator"];if(!r){if(Array.isArray(n)||(r=function(n,t){if(!n)return;if("string"==typeof n)return A(n,t);var r=Object.prototype.toString.call(n).slice(8,-1);"Object"===r&&n.constructor&&(r=n.constructor.name);if("Map"===r||"Set"===r)return Array.from(n);if("Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r))return A(n,t)}(n))||t&&n&&"number"==typeof n.length){r&&(n=r);var e=0,i=function(){};return{s:i,n:function(){return e>=n.length?{done:!0}:{done:!1,value:n[e++]}},e:function(n){throw n},f:i}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var o,a=!0,u=!1;return{s:function(){r=r.call(n)},n:function(){var n=r.next();return a=n.done,n},e:function(n){u=!0,o=n},f:function(){try{a||null==r.return||r.return()}finally{if(u)throw o}}}}function A(n,t){(null==t||t>n.length)&&(t=n.length);for(var r=0,e=new Array(t);r<t;r++)e[r]=n[r];return e}var k=function n(r,e){var i,o=arguments.length>2&&void 0!==arguments[2]&&arguments[2];if(v.null(r))return null;if("scale"!==e||o||v.object(r)||(r={x:r,y:r}),v.object(r)){var u,f=Object.keys(r),l=P(a);try{for(l.s();!(u=l.n()).done;){var s=u.value;if(d(r,s)){f=s;break}}}catch(n){l.e(n)}finally{l.f()}r=O({},r);var b,y=P(f);try{for(y.s();!(b=y.n()).done;){var h=b.value,p=e in c?c[e][h]:c[h];r[h]=h in r?n(r[h],e,!0):p}}catch(n){y.e(n)}finally{y.f()}return r}if(v.string(r)){if(v.hex(r))return S(r);if(v.rgb(r))return M(r);var m=T(r),g=t(m,2);r=g[0],"%"==(i=g[1])&&(r/=100)}return[r,i=v.number(r)?H.normalize(i,e):null]},S=function(n){var r=n.match(/^#([\da-f]{1,2})([\da-f]{1,2})([\da-f]{1,2})([\da-f]{2})?/i),e=t(r,5);e[0];var i=e[1],o=e[2],a=e[3],u=e[4],c=function(n){return[v.null(n)?255:parseInt(n.padStart(2,n),16),null]};return{r:c(i),g:c(o),b:c(a),a:c(u)}},M=function(n){var r=n.match(/^rgba?\((\d+)\D+(\d+)\D+(\d+)\D*(\d+)?\)/i),e=t(r,5);e[0];var i=e[1],o=e[2],a=e[3],u=e[4],c=function(n){return[v.null(n)?255:parseInt(n),null]};return{r:c(i),g:c(o),b:c(a),a:c(u)}},I=function(n,t){var r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:Object.keys(n);return r.map((function(t){return C(n[t])})).join(t)},D=function(n){var t=v.object(n)?n:{},r=t.x,e=void 0===r?.5:r,i=t.y,o=void 0===i?.5:i;if(v.string(n))switch(n){case"left":e=0;break;case"right":e=1;break;case"top":o=0;break;case"bottom":o=1}return{x:e,y:o}},T=function(n){var t=n.toString().match(/^([\d.]+)([^\d.]*)$/i);return t?[parseFloat(t[1]),t[2]||null]:[n,null]},C=function(n){return("%"==n[1]?100*n[0]:n[0])+(v.null(n[1])?"":n[1])},H={emtopx:function(n){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:document.body;return n*parseFloat(getComputedStyle(t).fontSize)},remtopx:function(n){return H.emtopx(n)},vwtopx:function(n){return n*window.innerWidth},vhtopx:function(n){return n*window.innerHeight},vmintopx:function(n){return n*Math.min(window.innerWidth,window.innerHeight)},vmaxtopx:function(n){return n*Math.max(window.innerWidth,window.innerHeight)},radtodeg:function(n){return 180*n/Math.PI},fromProperty:function(n){return["rotate","skew"].includes(n)?"deg":["clip","scale"].includes(n)?"%":o.includes(n)?null:"px"},toBase:function(n,t,r){if(v.object(n)){var e={};for(var i in n)e[i]=H.toBase(n[i],t);return e}if(!v.number(n[0]))return n;var o=H.fromProperty(t);if(v.null(n[1])&&!v.null(o))return[n[0],o];var a=H["".concat(n[1],"to").concat(o)];return a?[a(n[0],r),o]:n},normalize:function(n,t){return v.null(n)&&o.includes(t)||i.includes(n)?n:H.fromProperty(t)}},L={origin:["transformOrigin"],length:["strokeDashoffset"],clip:["clipPath","webkitClipPath"],transformOrigin:function(n){return"".concat(100*n.x,"% ").concat(100*n.y,"%")},strokeDashoffset:function(n){return 1-n[0]},clipPath:function(n){return"inset(".concat(I(n," ",["top","right","bottom","left"]),")")},webkitClipPath:function(n){return L.clipPath(n)}},W={bind:function(n,t){n.origin=n.origin||n;var r=function(){for(var r,e=arguments.length,i=new Array(e),o=0;o<e;o++)i[o]=arguments[o];return(r=n.origin).call.apply(r,[t].concat(i))};return r.origin=n.origin,r},create:function(n){var t=W.bind((function(n){if(v.function(n)){var r=W.bind(t,{transform:n});return r.set=t.set,r.internal=t.internal,r}return this.transform(t.internal.value)}),{transform:function(n){return n}});return t.set=function(n){var r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0;t.internal.value=n,t.internal.duration=r,t.internal.t=null},t.internal={value:n,duration:0},t},isInstance:function(n){return v.function(n)&&v.function(n.set)}},$=W;export{L as A,c as D,$ as L,e as P,u as T,H as U,m as a,C as b,h as c,w as d,k as e,D as f,b as g,d as h,v as i,g as m,I as o,y as p,T as s,x as t,s as x};
