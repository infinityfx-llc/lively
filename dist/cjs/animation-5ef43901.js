"use strict";var t=require("@babel/runtime/helpers/slicedToArray"),e=require("@babel/runtime/helpers/objectWithoutProperties"),i=require("@babel/runtime/helpers/classCallCheck"),n=require("@babel/runtime/helpers/createClass"),r=require("./helper-dfb168a5.js"),a=require("@babel/runtime/helpers/asyncToGenerator"),o=require("@babel/runtime/regenerator");function s(t){return t&&"object"==typeof t&&"default"in t?t:{default:t}}var u=s(t),l=s(e),c=s(i),h=s(n),d=s(a),f=s(o),y={opacity:1,scale:{x:1,y:1},position:{x:0,y:0},rotation:0,clip:{left:0,top:0,right:0,bottom:0},borderRadius:0,padding:0,fontSize:"1rem",backgroundColor:{r:127,g:127,b:127,a:255},color:{r:127,g:127,b:127,a:255},active:!0,interact:!0,zIndex:0};function v(t,e){var i="undefined"!=typeof Symbol&&t[Symbol.iterator]||t["@@iterator"];if(!i){if(Array.isArray(t)||(i=function(t,e){if(!t)return;if("string"==typeof t)return p(t,e);var i=Object.prototype.toString.call(t).slice(8,-1);"Object"===i&&t.constructor&&(i=t.constructor.name);if("Map"===i||"Set"===i)return Array.from(t);if("Arguments"===i||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(i))return p(t,e)}(t))||e&&t&&"number"==typeof t.length){i&&(t=i);var n=0,r=function(){};return{s:r,n:function(){return n>=t.length?{done:!0}:{done:!1,value:t[n++]}},e:function(t){throw t},f:r}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var a,o=!0,s=!1;return{s:function(){i=i.call(t)},n:function(){var t=i.next();return o=t.done,t},e:function(t){s=!0,a=t},f:function(){try{o||null==i.return||i.return()}finally{if(s)throw a}}}}function p(t,e){(null==e||e>t.length)&&(e=t.length);for(var i=0,n=new Array(e);i<e;i++)n[i]=t[i];return n}var g=function(t){var e=t.match(/^#([\da-f]{1,2})([\da-f]{1,2})([\da-f]{1,2})([\da-f]{2})?/i),i=u.default(e,5);i[0];var n=i[1],r=i[2],a=i[3],o=i[4];return{r:parseInt(n.padStart(2,n),16),g:parseInt(r.padStart(2,r),16),b:parseInt(a.padStart(2,a),16),a:void 0!==o?parseInt(o,16):255}},m=function(t){var e=t.match(/^rgba?\((\d+)\D+(\d+)\D+(\d+)\D*(\d+)?\)/i),i=u.default(e,5);i[0];var n=i[1],r=i[2],a=i[3],o=i[4];return{r:parseInt(n),g:parseInt(r),b:parseInt(a),a:void 0!==o?parseInt(o):255}},b=function(t){var e=.5,i=.5;if(r.isObject(t))e=t.x,i=t.y;else if("string"==typeof t)switch(t){case"left":e=0;break;case"right":e=1;break;case"top":i=0;break;case"bottom":i=1}else e=i=t;return"".concat(100*e,"% ").concat(100*i,"%")},k=function t(e,i){var n=arguments.length>2&&void 0!==arguments[2]&&arguments[2];if("string"==typeof i){if(i.match(/^#[0-9a-f]{3,8}$/i))return g(i);if(i.match(/^rgba?\(.*\)$/i))return m(i);var a=(i.match(/[^0-9\.]*$/i)||["px"])[0];return i=parseFloat(i),isNaN(i)?y[e]:("%"===a&&(i/=100),a?[i,a]:i)}if(r.isObject(i)){var o=Object.keys(i),s=i;("x"in i||"y"in i)&&(o=["x","y"]),("r"in i||"g"in i||"b"in i||"a"in i)&&(o=["r","g","b","a"]),("left"in i||"right"in i||"top"in i||"bottom"in i)&&(o=["left","right","top","bottom"]),i={};var u,l=v(o);try{for(l.s();!(u=l.n()).done;){var c=u.value;i[c]=t(e,s[c],c)}}catch(t){l.e(t)}finally{l.f()}}if(void 0!==i)return i;var h=y[e];return n in h?h[n]:h},x=function(t,e){return Array.isArray(t)&&(e=t[1],t=t[0]),t*("%"===e?100:1)+e},L=function(t){return Array.isArray(t)&&(t="px"===t[1]?t[0]+"px":t[0]),t},A=function t(e,i,n){if(r.isObject(e)){var a={};for(var o in e)a[o]=t(e[o],r.isObject(i)?i[o]:i,n);return a}var s;if(Array.isArray(e)&&(s=e[1],e=e[0]),Array.isArray(i)&&(s=i[1],i=i[0]),"number"!=typeof e||"number"!=typeof i)return n>.5?i:e;var u=e*(1-n)+i*n;return s?[u,s]:u},q=function(t,e,i){if(t.length===i)return t[e];var n=e*((t.length-1)/(i-1)),r=Math.floor(n);return r===t.length-1?t[r]:A(t[r],t[r+1],n-r)},w=function(){function t(){c.default(this,t),this.queue=[],this.tick()}var e;return h.default(t,[{key:"uuid",value:function(){return Math.floor(1e6*Math.random()).toString(16).padStart("0",6)}},{key:"tick",value:(e=d.default(f.default.mark((function t(){var e,i,n;return f.default.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:e=Date.now(),i=0;case 2:if(!(i<this.queue.length+1)){t.next=13;break}if(n=this.queue[i],!(this.queue.length===i||n.timestamp>e)){t.next=7;break}return this.queue.splice(0,i),t.abrupt("break",13);case 7:n.callback(),delete n.cancel,delete n.store[n.id+n.timestamp];case 10:i++,t.next=2;break;case 13:requestAnimationFrame(this.tick.bind(this));case 14:case"end":return t.stop()}}),t,this)}))),function(){return e.apply(this,arguments)})},{key:"search",value:function(t){for(var e,i,n=0,r=this.queue.length-1;n<=r;)if(e=n+r>>>1,(i=this.queue[e].timestamp-t.timestamp)<0)n=e+1;else{if(!(i>0))return e;r=e-1}return n}},{key:"insert",value:function(t){var e=this.search(t);this.queue.splice(e,0,t)}},{key:"cancel",value:function(t){for(var e=this.search(t);e>0&&this.queue[e].timestamp>=t.timestamp;)e--;for(;e<this.queue.length&&this.queue[e].timestamp<=t.timestamp;){if(this.queue[e].id===t.id){this.queue.splice(e,1);break}e++}delete t.cancel}},{key:"delay",value:function(t,e){var i=this,n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{};if(t instanceof Function){var r={timestamp:Date.now()+1e3*e,id:this.uuid(),cancel:function(){return i.cancel(r)},callback:t,store:n};return this.insert(r),n[r.id+r.timestamp]=r,r}}}],[{key:"get",value:function(){return r.livelyProperty("AnimationQueue",new t),window.Lively.AnimationQueue}},{key:"cancelAll",value:function(t){for(var e in t)t[e].cancel(),delete t[e]}},{key:"delay",value:function(t,e,i){return this.get().delay(t,e,i)}},{key:"sleep",value:function(){var t=this,e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:1;return new Promise((function(i){t.delay(i,e)}))}}]),t}(),S=["duration","interpolate","origin","useLayout"],I=function(){function t(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},i=e.duration,n=void 0===i?0:i,r=e.interpolate,a=void 0===r?"ease":r,o=e.origin,s=void 0===o?{x:.5,y:.5}:o,u=e.useLayout,h=void 0!==u&&u,d=l.default(e,S);c.default(this,t),this.style=d,this.start={},this.end={},this.duration=n,this.interpolate="spring"===a?"cubic-bezier(0.65, 0.34, 0.7, 1.42)":a,this.origin=b(s),this.useLayout=h}return h.default(t,[{key:"addProperty",value:function(t,e){if(!r.isObject(e)||!("start"in e||"end"in e||"set"in e))return this.style[t]=e;"start"in e&&(this.start[t]=e.start),"end"in e&&(this.end[t]=e.end),"set"in e&&(this.style[t]=e.set)}},{key:"compile",value:function(){return this.style=this.interpret(this.style),this.start=this.interpret(this.start),this.end=this.interpret(this.end),this}},{key:"interpret",value:function(t){if(!Object.keys(t).length)return null;var e={transform:""};for(var i in t){var n=t[i];if(n instanceof Function){if(null===(n=n()))continue;n=k(i,n)}switch(i){case"position":e.transform+="translate(".concat(x(n.x,"px"),", ").concat(x(n.y,"px"),") ");break;case"scale":if("number"==typeof n&&(n={x:n,y:n}),this.useLayout){e.width=L(n.x),e.height=L(n.y);break}e.transform+="scale(".concat(x(n.x,"%"),", ").concat(x(n.y,"%"),") ");break;case"rotation":e.transform+="rotate(".concat(x(n,"deg"),") ");break;case"clip":e.clipPath="inset(".concat(x(n.top,"%")," ").concat(x(n.right,"%")," ").concat(x(n.bottom,"%")," ").concat(x(n.left,"%"),")"),e.webkitClipPath=e.clipPath;break;case"borderRadius":case"padding":case"fontSize":e[i]=x(n,"px");break;case"backgroundColor":case"color":e[i]="rgba(".concat(n.r,", ").concat(n.g,", ").concat(n.b,", ").concat(n.a,")");break;case"interact":e.pointerEvents=n?"all":"none";break;case"opacity":case"active":case"zIndex":e[i]=n}}return e}},{key:"initial",value:function(t){t.style.transitionTimingFunction=this.interpolate,t.style.transformOrigin=this.origin,this.apply(t,{duration:0})}},{key:"apply",value:function(e){var i=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},n=i.duration,r=void 0===n?this.duration:n,a=i.reverse,o=void 0!==a&&a,s=t.setStyle.bind(t,e,this.style,r);this[o?"end":"start"]?(t.setStyle(e,this[o?"end":"start"],0),w.delay(s,.001)):s(),this[o?"start":"end"]&&w.delay(t.setStyle.bind(t,e,this[o?"start":"end"],0),r,e.Lively.timeouts)}},{key:"update",value:function(e){e.style.transitionTimingFunction=this.interpolate,e.style.transformOrigin=this.origin;var i=this.interpret(this.style);t.setStyle(e,i,this.duration)}}],[{key:"setStyle",value:function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},i=arguments.length>2&&void 0!==arguments[2]?arguments[2]:0;for(var n in t.style.transitionDuration="".concat(i,"s"),e)"width"!==n?"height"!==n?"padding"===n&&(e.width||e.height)||"start"===n||"end"===n||(t.style[n]=e[n]):this.setLength(t,e,"height","paddingTop","paddingBottom"):this.setLength(t,e,"width","paddingLeft","paddingRight")}},{key:"setLength",value:function(t,e,i,n,r){var a=t.Lively.initials[i],o=parseInt(t.Lively.initials[n]),s=parseInt(t.Lively.initials[r]),u=e[i],l=e.padding?1:o/(0===s?1e-6:s);"string"==typeof u&&(u="calc(".concat(u," / ").concat(a,")"));var c=e.padding?e.padding:o+s+"px";t.style[i]="max(calc(".concat(a," * ").concat(u," - ").concat("border-box"!==t.style.boxSizing?"0px":c,"), 0px)");var h="calc(min(calc(".concat(a," * ").concat(u,"), ").concat(c,") * ");t.style[n]=h+.5*l,t.style[r]=h+1/(0===l?1e-6:l)*.5}}]),t}(),j=["delay","duration","repeat"],O=["interpolate","origin","useLayout"],P=function(){function t(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},i=e.delay,n=void 0===i?0:i,r=e.duration,a=void 0===r?1:r,o=e.repeat,s=void 0===o?1:o,u=l.default(e,j),h=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};c.default(this,t),this.length=0,this.delay=n,this.duration=a,this.repeat=s,this.keyframes=this.parse(u,h)}return h.default(t,[{key:"initial",value:function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:this.keyframes[0];e&&e.initial(t)}},{key:"restore",value:function(t){var e,i,n=arguments.length>1&&void 0!==arguments[1]&&arguments[1];(n||null!==(e=t.Lively)&&void 0!==e&&e.keyframe)&&this.initial(t,null===(i=t.Lively)||void 0===i?void 0:i.keyframe)}},{key:"parse",value:function(t,e){var i=this,n=t.interpolate,r=t.origin,a=t.useLayout,o=l.default(t,O),s=function(t){Array.isArray(o[t])||(o[t]=[o[t]]),o[t].length<2&&o[t].unshift(t in e?e[t]:y[t]),o[t]=o[t].map((function(e){return k(t,e)})),i.length=Math.max(o[t].length,i.length)};for(var u in o)s(u);return new Array(this.length).fill(0).map((function(t,e){var s=new I({interpolate:n,origin:r,useLayout:a,duration:i.duration/(i.length-1)});for(var u in o)u in y&&s.addProperty(u,q(o[u],e,i.length));return s.compile()}))}},{key:"start",value:function(t){var e=this,i=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},n=i.immediate,r=void 0!==n&&n,a=i.reverse,o=void 0!==a&&a,s=i.repeat,u=void 0===s?this.repeat:s;!t.Lively.animating||r?(this.initial(t,o?this.keyframes[this.length-1]:this.keyframes[0]),t.Lively.index=1,t.Lively.animating=!0,requestAnimationFrame((function(){return e.getNext(t,o,u)}))):t.Lively.queue.push([this,{reverse:o,repeat:u}])}},{key:"play",value:function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},i=e.delay,n=void 0===i?0:i,r=e.immediate,a=void 0!==r&&r,o=e.reverse,s=void 0!==o&&o;if(t.style&&this.length){a&&(t.Lively.queue=[],w.cancelAll(t.Lively.timeouts));var u=this.start.bind(this,t,{immediate:a,reverse:s});this.delay||n?w.delay(u,this.delay+n,t.Lively.timeouts):u()}}},{key:"getNext",value:function(t){var e=this,i=arguments.length>1&&void 0!==arguments[1]&&arguments[1],n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:1;if(t.Lively.index===this.length){t.Lively.animating=!1;var r=t.Lively.queue.shift()||[],a=u.default(r,2),o=a[0],s=a[1];return o?o.start(t,s):void(n>1&&this.start(t,{reverse:i,repeat:n-1}))}var l=t.Lively.index;i&&(l=this.length-1-l),this.keyframes[l].apply(t,{reverse:i}),t.Lively.keyframe=this.keyframes[l],t.Lively.index++,w.delay((function(){return e.getNext(t,i,n)}),this.duration/(this.length-1),t.Lively.timeouts)}}]),t}();exports.Animation=P,exports.AnimationQueue=w,exports.Keyframe=I;
