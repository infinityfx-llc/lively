import n from"@babel/runtime/helpers/typeof";import t from"@babel/runtime/helpers/slicedToArray";import r from"@babel/runtime/helpers/defineProperty";var e=["set","start","end"],o=["%","px","em","rem","vw","vh","vmin","vmax","deg","rad"],i={rotate:"deg",skew:"deg",scale:"%",clip:"%",opacity:null,zIndex:null,lineHeight:null,fontWeight:null,length:null,default:"px"},a=[["x","y"],["r","g","b","a"],["left","top","right","bottom"]],u={translate:{x:[0,"px"],y:[0,"px"]},scale:{x:[1,"%"],y:[1,"%"]},clip:{left:[0,"%"],top:[0,"%"],right:[0,"%"],bottom:[0,"%"]},r:[127,null],g:[127,null],b:[127,null],a:[255,null]},c=["translate","scale","skew","rotate"],l=["translate","scale","rotate","opacity","borderRadius","backgroundColor","color","zIndex","pointerEvents"],f={translate:function(n,t){return n+t},rotate:function(n,t){return n+t},scale:function(n,t){return n*t},default:function(n,t){return(n+t)/2}};function s(n,t){var r="undefined"!=typeof Symbol&&n[Symbol.iterator]||n["@@iterator"];if(!r){if(Array.isArray(n)||(r=function(n,t){if(!n)return;if("string"==typeof n)return d(n,t);var r=Object.prototype.toString.call(n).slice(8,-1);"Object"===r&&n.constructor&&(r=n.constructor.name);if("Map"===r||"Set"===r)return Array.from(n);if("Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r))return d(n,t)}(n))||t&&n&&"number"==typeof n.length){r&&(n=r);var e=0,o=function(){};return{s:o,n:function(){return e>=n.length?{done:!0}:{done:!1,value:n[e++]}},e:function(n){throw n},f:o}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var i,a=!0,u=!1;return{s:function(){r=r.call(n)},n:function(){var n=r.next();return a=n.done,n},e:function(n){u=!0,i=n},f:function(){try{a||null==r.return||r.return()}finally{if(u)throw i}}}}function d(n,t){(null==t||t>n.length)&&(t=n.length);for(var r=0,e=new Array(t);r<t;r++)e[r]=n[r];return e}var h=function(n,t){return n&&!t||!n&&t},y=function(n,t){return Object.keys(n).some((function(n){return t.includes(n)}))},b=function(n){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0,r=n.y,e=n.bottom,o=e-r;return{left:r>window.innerHeight+o*t,entered:r+o*t<window.innerHeight}},g=function(n){var t=n.getBoundingClientRect(),r=t.x,e=t.y,o=t.right,i=t.bottom;return!(o-r<1||i-e<1)&&(e<window.innerHeight&&i>0&&r<window.innerWidth&&o>0)},p={null:function(n){return null==n},array:function(n){return Array.isArray(n)},object:function(t){return!p.null(t)&&"object"===n(t)&&!p.array(t)},function:function(n){return n instanceof Function},string:function(n){return"string"==typeof n},bool:function(n){return"boolean"==typeof n},number:function(n){return"number"==typeof n},empty:function(n){return function(n,t){return Object.keys(n).length===t}(n,0)},rgb:function(n){return n.match(/^rgba?\(.*\)$/i)},hex:function(n){return n.match(/^#[0-9a-f]{3,8}$/i)},color:function(n){return p.object(n)&&"r"in n}},v=function(n){var t=new DOMMatrix(n),r=Math.sqrt(t.a*t.a+t.b*t.b)*Math.sign(t.a),e=Math.sqrt(t.c*t.c+t.d*t.d)*Math.sign(t.d),o=180*Math.atan2(t.d,t.c)/Math.PI-90,i=180*Math.atan2(t.b,t.a)/Math.PI;return{translate:{x:t.e,y:t.f},scale:{x:r,y:e},rotate:i,skew:{x:o,y:0}}},m=function(n,t){var r=getComputedStyle(n),e=v(r.transform);if(t in e)return C(e[t],t);var o=r[t];return p.rgb(o)?E(o):z(o)},w=function(n){var t,r=arguments.length>1&&void 0!==arguments[1]&&arguments[1],e=getComputedStyle(n),o=n.getBoundingClientRect(),i=o.x,a=o.y,u=o.width,c=o.height,f=(r?n.parentElement:document.body).getBoundingClientRect(),d={layout:{x:i=(i-f.x+u/2)/f.width,y:a=(a-f.y+c/2)/f.height,width:u,height:c,parentWidth:f.width,parentHeight:f.height}},h=s(l);try{for(h.s();!(t=h.n()).done;){var y=t.value;d[y]=e[y]}}catch(n){h.e(n)}finally{h.f()}return Object.assign(d,v(e.transform)),d},x=function(n,t){return new Array(t).fill(0).map((function(t,r){return r<n.length?n[r]:n[n.length-1]}))},j=function(n,t){return n.filter((function(n){return!t.includes(n)}))},O=function(n,t){var r,e=arguments.length>2&&void 0!==arguments[2]?arguments[2]:Object.keys(t),o=s(e);try{for(o.s();!(r=o.n()).done;){var i=r.value;p.null(t[i])||(n[i]=t[i])}}catch(n){o.e(n)}finally{o.f()}return n},P=function n(t,r,e){if(p.object(t)){var o={};for(var i in t)o[i]=n(t[i],r[i],e);return o}return p.number(t[0])&&p.number(r[0])?[e(t[0],r[0]),t[1]]:r},k=function(n,t){for(var r in t){var e=f[r]||f.default;n[r]=r in n?P(n[r],t[r],e):t[r]}},A=function(n){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:250;return function(){var r=Date.now();n.LivelyTimestamp-r<t||(n.LivelyTimestamp=r,n())}};function S(n,t){var r=Object.keys(n);if(Object.getOwnPropertySymbols){var e=Object.getOwnPropertySymbols(n);t&&(e=e.filter((function(t){return Object.getOwnPropertyDescriptor(n,t).enumerable}))),r.push.apply(r,e)}return r}function M(n){for(var t=1;t<arguments.length;t++){var e=null!=arguments[t]?arguments[t]:{};t%2?S(Object(e),!0).forEach((function(t){r(n,t,e[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(n,Object.getOwnPropertyDescriptors(e)):S(Object(e)).forEach((function(t){Object.defineProperty(n,t,Object.getOwnPropertyDescriptor(e,t))}))}return n}function I(n,t){var r="undefined"!=typeof Symbol&&n[Symbol.iterator]||n["@@iterator"];if(!r){if(Array.isArray(n)||(r=function(n,t){if(!n)return;if("string"==typeof n)return D(n,t);var r=Object.prototype.toString.call(n).slice(8,-1);"Object"===r&&n.constructor&&(r=n.constructor.name);if("Map"===r||"Set"===r)return Array.from(n);if("Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r))return D(n,t)}(n))||t&&n&&"number"==typeof n.length){r&&(n=r);var e=0,o=function(){};return{s:o,n:function(){return e>=n.length?{done:!0}:{done:!1,value:n[e++]}},e:function(n){throw n},f:o}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var i,a=!0,u=!1;return{s:function(){r=r.call(n)},n:function(){var n=r.next();return a=n.done,n},e:function(n){u=!0,i=n},f:function(){try{a||null==r.return||r.return()}finally{if(u)throw i}}}}function D(n,t){(null==t||t>n.length)&&(t=n.length);for(var r=0,e=new Array(t);r<t;r++)e[r]=n[r];return e}var C=function n(r,e){var o,i=arguments.length>2&&void 0!==arguments[2]&&arguments[2];if(p.null(r))return null;if("scale"!==e||i||p.object(r)||(r={x:r,y:r}),p.object(r)){var c,l=Object.keys(r),f=I(a);try{for(f.s();!(c=f.n()).done;){var s=c.value;if(y(r,s)){l=s;break}}}catch(n){f.e(n)}finally{f.f()}r=M({},r);var d,h=I(l);try{for(h.s();!(d=h.n()).done;){var b=d.value,g=e in u?u[e][b]:u[b];r[b]=b in r?n(r[b],e,!0):g}}catch(n){h.e(n)}finally{h.f()}return r}if(p.string(r)){if(p.hex(r))return H(r);if(p.rgb(r))return E(r);var v=z(r),m=t(v,2);r=m[0],"%"==(o=m[1])&&(r/=100)}return[r,o=p.number(r)?$.normalize(o,e):null]},H=function(n){var r=n.match(/^#([\da-f]{1,2})([\da-f]{1,2})([\da-f]{1,2})([\da-f]{2})?/i),e=t(r,5);e[0];var o=e[1],i=e[2],a=e[3],u=e[4],c=function(n){return[p.null(n)?255:parseInt(n.padStart(2,n),16),null]};return{r:c(o),g:c(i),b:c(a),a:c(u)}},E=function(n){var r=n.match(/^rgba?\((\d+)\D+(\d+)\D+(\d+)\D*(\d+)?\)/i),e=t(r,5);e[0];var o=e[1],i=e[2],a=e[3],u=e[4],c=function(n){return[p.null(n)?255:parseInt(n),null]};return{r:c(o),g:c(i),b:c(a),a:c(u)}},T=function(n,t){var r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:Object.keys(n);return r.map((function(t){return B(n[t])})).join(t)},W=function(n){var t=p.object(n)?n:{},r=t.x,e=void 0===r?.5:r,o=t.y,i=void 0===o?.5:o;if(p.string(n))switch(n){case"left":e=0;break;case"right":e=1;break;case"top":i=0;break;case"bottom":i=1}return{x:e,y:i}},z=function(n){var t=n.toString().match(/^([\d.]+)([^\d.]*)$/i);return t?[parseFloat(t[1]),t[2]||null]:[n,null]},B=function(n){return("%"==n[1]?100*n[0]:n[0])+(p.null(n[1])?"":n[1])},$={emtopx:function(n){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:document.body;return n*parseFloat(getComputedStyle(t).fontSize)},remtopx:function(n){return $.emtopx(n)},vwtopx:function(n){return n*window.innerWidth},vhtopx:function(n){return n*window.innerHeight},vmintopx:function(n){return n*Math.min(window.innerWidth,window.innerHeight)},vmaxtopx:function(n){return n*Math.max(window.innerWidth,window.innerHeight)},radtodeg:function(n){return 180*n/Math.PI},fromProperty:function(n){return n in i?i[n]:i.default},toBase:function(n,t,r){if(p.object(n)){var e={};for(var o in n)e[o]=$.toBase(n[o],t);return e}if(!p.number(n[0]))return n;var i=$.fromProperty(t);if(p.null(n[1])&&!p.null(i))return[n[0],i];var a=$["".concat(n[1],"to").concat(i)];return a?[a(n[0],r),i]:n},normalize:function(n,t){return o.includes(n)||p.null(n)&&t in i?n:$.fromProperty(t)}},R=function(n){return"inset(".concat(T(n," ",["top","right","bottom","left"]),")")},F={origin:["transformOrigin"],length:["strokeDashoffset"],clip:["clipPath","webkitClipPath"],transformOrigin:function(n){return"".concat(100*n.x,"% ").concat(100*n.y,"%")},strokeDashoffset:function(n){return 1-n[0]},clipPath:R,webkitClipPath:R},L={bind:function(n,t){n.origin=n.origin||n;var r=function(){for(var r,e=arguments.length,o=new Array(e),i=0;i<e;i++)o[i]=arguments[i];return(r=n.origin).call.apply(r,[t].concat(o))};return r.origin=n.origin,r},create:function(n){var t=L.bind((function(n){if(p.function(n)){var r=L.bind(t,{transform:n});return r.set=t.set,r.internal=t.internal,r}return this.transform(t.internal.value)}),{transform:function(n){return n}});return t.set=function(n){var r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0;t.internal.value=n,t.internal.duration=r,t.internal.t=null},t.internal={value:n,duration:0},t},isInstance:function(n){return p.function(n)&&p.function(n.set)}},U=L;export{F as A,u as D,U as L,f as M,e as P,c as T,$ as U,P as a,B as b,b as c,O as d,C as e,g as f,m as g,y as h,p as i,W as j,w as k,l,k as m,T as o,x as p,j as s,A as t,h as x};
