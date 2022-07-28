import t from"@babel/runtime/helpers/slicedToArray";import e from"@babel/runtime/helpers/objectWithoutProperties";import i from"@babel/runtime/helpers/classCallCheck";import n from"@babel/runtime/helpers/createClass";import r from"@babel/runtime/helpers/defineProperty";import a from"@babel/runtime/helpers/asyncToGenerator";import o from"@babel/runtime/regenerator";import s from"@babel/runtime/helpers/typeof";var l=function(t,e){var i=arguments.length>2&&void 0!==arguments[2]?arguments[2]:window;"Lively"in i||(i.Lively={}),t in i.Lively||(i.Lively[t]=e)},u=function(t){return t&&"object"===s(t)&&!Array.isArray(t)},c=function(t,e){return new Array(e).fill(0).map((function(e,i){return i<t.length?t[i]:t[t.length-1]}))},d=function(e){var i=e.match(/^#([\da-f]{1,2})([\da-f]{1,2})([\da-f]{1,2})([\da-f]{2})?/i),n=t(i,5);n[0];var r=n[1],a=n[2],o=n[3],s=n[4];return{r:parseInt(r.padStart(2,r),16),g:parseInt(a.padStart(2,a),16),b:parseInt(o.padStart(2,o),16),a:void 0!==s?parseInt(s,16):255}},h=function(e){var i=e.match(/^rgba?\((\d+)\D+(\d+)\D+(\d+)\D*(\d+)?\)/i),n=t(i,5);n[0];var r=n[1],a=n[2],o=n[3],s=n[4];return{r:parseInt(r),g:parseInt(a),b:parseInt(o),a:void 0!==s?parseInt(s):255}},y=function(t,e){if(e instanceof Function){l("Events",{}),t in window.Lively.Events||(window.Lively.Events[t]={unique:0},window.addEventListener(t,(function(e){Object.values(window.Lively.Events[t]).forEach((function(t){t instanceof Function&&t(e)}))})));var i=window.Lively.Events[t];e.Lively={ListenerID:i.unique},i[i.unique++]=e}},v=function(t,e){var i,n;"undefined"!=typeof window&&null!==(i=window.Lively)&&void 0!==i&&null!==(n=i.Events)&&void 0!==n&&n[t]&&null!=e&&e.Lively&&"ListenerID"in e.Lively&&delete window.Lively.Events[t][e.Lively.ListenerID]},f=function(t){l("queue",[],t),l("timeouts",{},t),t.Lively.style||(t.Lively.style=function(t){for(var e={},i=0;i<t.style.length;i++)e[t.style[i]]=t.style[t.style[i]];return e}(t),t.Lively.style.transitionProperty="transform, opacity, clip-path, border-radius, font-size, background-color, color, width, height, padding",t.Lively.style.willChange="transform"),function(t,e){for(var i in t.style={},e)t.style[i]=e[i]}(t,t.Lively.style);var e=getComputedStyle(t),i=e.paddingLeft,n=e.paddingRight,r=e.paddingTop,a=e.paddingBottom,o=e.backgroundColor,s=e.color,u=e.borderRadius,c=e.padding,d=e.fontSize,h=e.zIndex,y=t.getBoundingClientRect(),v=y.x,f=y.y,p=y.width,g=y.height;t.Lively.initials={x:v,y:f,paddingLeft:i,paddingRight:n,paddingTop:r,paddingBottom:a,backgroundColor:o,color:s,fontSize:d,zIndex:"auto"===h?0:parseInt(h),width:p+"px",height:g+"px",borderRadius:u.split(" ")[0],padding:c.split(" ")[0]}},p=function(){function t(){i(this,t),this.queue=[],this.tick()}var e;return n(t,[{key:"uuid",value:function(){return Math.floor(1e6*Math.random()).toString(16).padStart("0",6)}},{key:"tick",value:(e=a(o.mark((function t(){var e,i,n;return o.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:e=Date.now(),i=0;case 2:if(!(i<this.queue.length+1)){t.next=13;break}if(n=this.queue[i],!(this.queue.length===i||n.timestamp>e)){t.next=7;break}return this.queue.splice(0,i),t.abrupt("break",13);case 7:n.callback(),delete n.cancel,delete n.store[n.id+n.timestamp];case 10:i++,t.next=2;break;case 13:requestAnimationFrame(this.tick.bind(this));case 14:case"end":return t.stop()}}),t,this)}))),function(){return e.apply(this,arguments)})},{key:"search",value:function(t){for(var e,i,n=0,r=this.queue.length-1;n<=r;)if(e=n+r>>>1,(i=this.queue[e].timestamp-t.timestamp)<0)n=e+1;else{if(!(i>0))return e;r=e-1}return n}},{key:"insert",value:function(t){var e=this.search(t);this.queue.splice(e,0,t)}},{key:"cancel",value:function(t){for(var e=this.search(t);e>0&&this.queue[e].timestamp>=t.timestamp;)e--;for(;e<this.queue.length&&this.queue[e].timestamp<=t.timestamp;){if(this.queue[e].id===t.id){this.queue.splice(e,1);break}e++}delete t.cancel}},{key:"delay",value:function(t,e){var i=this,n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{};if(t instanceof Function){var r={timestamp:Date.now()+1e3*e,id:this.uuid(),cancel:function(){return i.cancel(r)},callback:t,store:n};return this.insert(r),n[r.id+r.timestamp]=r,r}}}],[{key:"get",value:function(){return l("AnimationQueue",new t),window.Lively.AnimationQueue}},{key:"cancelAll",value:function(t){for(var e in t)t[e].cancel(),delete t[e]}},{key:"delay",value:function(t,e,i){return this.get().delay(t,e,i)}},{key:"sleep",value:function(){var t=this,e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:1;return new Promise((function(i){t.delay(i,e)}))}}]),t}(),g=["delay","duration","repeat","interpolate","origin","useLayout"];function m(t,e){var i="undefined"!=typeof Symbol&&t[Symbol.iterator]||t["@@iterator"];if(!i){if(Array.isArray(t)||(i=function(t,e){if(!t)return;if("string"==typeof t)return b(t,e);var i=Object.prototype.toString.call(t).slice(8,-1);"Object"===i&&t.constructor&&(i=t.constructor.name);if("Map"===i||"Set"===i)return Array.from(t);if("Arguments"===i||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(i))return b(t,e)}(t))||e&&t&&"number"==typeof t.length){i&&(t=i);var n=0,r=function(){};return{s:r,n:function(){return n>=t.length?{done:!0}:{done:!1,value:t[n++]}},e:function(t){throw t},f:r}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var a,o=!0,s=!1;return{s:function(){i=i.call(t)},n:function(){var t=i.next();return o=t.done,t},e:function(t){s=!0,a=t},f:function(){try{o||null==i.return||i.return()}finally{if(s)throw a}}}}function b(t,e){(null==e||e>t.length)&&(e=t.length);for(var i=0,n=new Array(e);i<e;i++)n[i]=t[i];return n}var k=function(){function r(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},n=t.delay,a=void 0===n?0:n,o=t.duration,s=void 0===o?1:o,l=t.repeat,u=void 0===l?1:l,c=t.interpolate,d=void 0===c?"ease":c,h=t.origin,y=void 0===h?{x:.5,y:.5}:h,v=t.useLayout,f=void 0!==v&&v,p=e(t,g),m=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};i(this,r),this.length=0,this.useLayout=f,this.keyframes=this.getKeyframes(p,m),this.delay=a,this.duration=s,this.delta=s/(this.length-1),this.interpolation="spring"===d?"cubic-bezier(0.65, 0.34, 0.7, 1.42)":d,this.origin=this.originToStyle(y),this.repeat=u}return n(r,[{key:"originToStyle",value:function(t){var e=.5,i=.5;if(u(t))e=t.x,i=t.y;else if("string"==typeof t)switch(t){case"left":e=0;break;case"right":e=1;break;case"top":i=0;break;case"bottom":i=1}else e=i=t;return"".concat(100*e,"% ").concat(100*i,"%")}},{key:"getKeyframes",value:function(t){var e=this,i=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},n=function(n){var a=n in i?i[n]:r.initials[n];Array.isArray(t[n])||(t[n]=[t[n]]),t[n].length<2&&t[n].unshift(a),t[n]=t[n].map((function(t){return e.sanitize(n,t)})),e.length=Math.max(t[n].length,e.length)};for(var a in t)n(a);return new Array(this.length).fill(0).map((function(i,n){var a={start:{},end:{}};for(var o in t)if(o in r.initials){var s=e.interpolateKeyframe(t[o],n,e.length);u(s)&&("start"in s||"end"in s||"set"in s)?("start"in s&&(a.start[o]=s.start),"end"in s&&(a.end[o]=s.end),"set"in s&&(a[o]=s.set)):a[o]=s}return e.keyframeToStyle(a)}))}},{key:"sanitize",value:function(t,e){var i=arguments.length>2&&void 0!==arguments[2]&&arguments[2];if("string"==typeof e){if(e.match(/^#[0-9a-f]{3,8}$/i))return d(e);if(e.match(/^rgba?\(.*\)$/i))return h(e);var n=parseFloat(e),a=(e.match(/[^0-9\.]*$/i)||["px"])[0];return isNaN(n)?r.initials[t]:("%"===a&&(n/=100),a?[n,a]:n)}if(u(e)){var o=Object.keys(e),s=e;("x"in e||"y"in e)&&(o=["x","y"]),("r"in e||"g"in e||"b"in e||"a"in e)&&(o=["r","g","b","a"]),("left"in e||"right"in e||"top"in e||"bottom"in e)&&(o=["left","right","top","bottom"]),e={};var l,c=m(o);try{for(c.s();!(l=c.n()).done;){var y=l.value;e[y]=this.sanitize(t,s[y],y)}}catch(t){c.e(t)}finally{c.f()}}if(void 0!==e)return e;var v=r.initials[t];return i in v?v[i]:v}},{key:"interpolate",value:function(t,e,i){if(u(t)){for(var n={},r=0,a=Object.keys(t);r<a.length;r++){var o=a[r];n[o]=this.interpolate(t[o],u(e)?e[o]:e,i)}return n}var s=!1;if(Array.isArray(t)&&(s=t[1],t=t[0]),Array.isArray(e)&&(s=e[1],e=e[0]),"number"!=typeof t||"number"!=typeof e)return i>.5?e:t;var l=t*(1-i)+e*i;return s?[l,s]:l}},{key:"interpolateKeyframe",value:function(t,e,i){if(t.length===i)return t[e];var n=e*((t.length-1)/(i-1)),r=Math.floor(n),a=t[r];return r===t.length-1?a:this.interpolate(a,t[r+1],n-r)}},{key:"toString",value:function(t,e){return Array.isArray(t)&&(e=t[1],t=t[0]),t*("%"===e?100:1)+e}},{key:"toLength",value:function(t){return Array.isArray(t)&&(t="px"===t[1]?t[0]+"px":t[0]),t}},{key:"keyframeToStyle",value:function(e){for(var i={transform:""},n=0,r=Object.entries(e);n<r.length;n++){var a=t(r[n],2),o=a[0],s=a[1];switch(o){case"start":case"end":Object.keys(s).length&&(i[o]=this.keyframeToStyle(s));break;case"position":i.transform+="translate(".concat(this.toString(s.x,"px"),", ").concat(this.toString(s.y,"px"),") ");break;case"scale":if("number"==typeof s&&(s={x:s,y:s}),this.useLayout){i.width=this.toLength(s.x),i.height=this.toLength(s.y);break}i.transform+="scale(".concat(this.toString(s.x,"%"),", ").concat(this.toString(s.y,"%"),") ");break;case"rotation":i.transform+="rotate(".concat(this.toString(s,"deg"),") ");break;case"clip":i.clipPath="inset(".concat(this.toString(s.top,"%")," ").concat(this.toString(s.right,"%")," ").concat(this.toString(s.bottom,"%")," ").concat(this.toString(s.left,"%"),")"),i.webkitClipPath=i.clipPath;break;case"borderRadius":case"padding":case"fontSize":i[o]=this.toString(s,"px");break;case"backgroundColor":case"color":i[o]="rgba(".concat(s.r,", ").concat(s.g,", ").concat(s.b,", ").concat(s.a,")");break;case"interact":i.pointerEvents=s?"all":"none";break;case"opacity":case"active":case"zIndex":i[o]=s}}return i.transform.length||delete i.transform,i}},{key:"setLength",value:function(t,e,i,n,r){var a=t.Lively.initials[i],o=parseInt(t.Lively.initials[n]),s=parseInt(t.Lively.initials[r]),l=e[i],u=e.padding?1:o/(0===s?1e-6:s);"string"==typeof l&&(l="calc(".concat(l," / ").concat(a,")"));var c=e.padding?e.padding:o+s+"px";t.style[i]="max(calc(".concat(a," * ").concat(l," - ").concat("border-box"!==t.style.boxSizing?"0px":c,"), 0px)");var d="calc(min(calc(".concat(a," * ").concat(l,"), ").concat(c,") * ");t.style[n]=d+.5*u,t.style[r]=d+1/(0===u?1e-6:u)*.5}},{key:"apply",value:function(e,i){var n=this,r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{},a=r.duration,o=void 0===a?this.delta:a,s=r.reverse,l=void 0!==s&&s,u=function(){e.style.transitionDuration="".concat(o,"s");for(var r=0,a=Object.entries(i);r<a.length;r++){var s=t(a[r],2),l=s[0],u=s[1];"width"!==l?"height"!==l?"padding"===l&&(i.width||i.height)||"start"===l||"end"===l||(e.style[l]=u):n.setLength(e,i,"height","paddingTop","paddingBottom"):n.setLength(e,i,"width","paddingLeft","paddingRight")}e.Lively.keyframe=i};"start"in i&&!l||"end"in i&&l?(this.apply(e,i[l?"end":"start"],{duration:0}),p.delay(u,.001)):u(),("end"in i&&!l||"start"in i&&l)&&p.delay(this.apply.bind(this,e,i[l?"start":"end"],{duration:0}),this.delta,e.Lively.timeouts)}},{key:"setInitial",value:function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:this.keyframes[0];t.style.transitionTimingFunction=this.interpolation,t.style.transformOrigin=this.origin,this.apply(t,e,{duration:0})}},{key:"setToLast",value:function(t){var e,i,n=arguments.length>1&&void 0!==arguments[1]&&arguments[1];(n||null!==(e=t.Lively)&&void 0!==e&&e.keyframe)&&this.setInitial(t,null===(i=t.Lively)||void 0===i?void 0:i.keyframe)}},{key:"start",value:function(t){var e=this,i=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},n=i.immediate,r=void 0!==n&&n,a=i.reverse,o=void 0!==a&&a,s=i.repeat,l=void 0===s?this.repeat:s;!t.Lively.animating||r?(this.setInitial(t,o?this.keyframes[this.length-1]:this.keyframes[0]),t.Lively.index=1,t.Lively.animating=!0,requestAnimationFrame((function(){return e.getNext(t,o,l)}))):t.Lively.queue.push([this,{reverse:o,repeat:l}])}},{key:"play",value:function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},i=e.delay,n=void 0===i?0:i,r=e.immediate,a=void 0!==r&&r,o=e.reverse,s=void 0!==o&&o;if(t.style&&this.length){a&&(t.Lively.queue=[],p.cancelAll(t.Lively.timeouts));var l=this.start.bind(this,t,{immediate:a,reverse:s});this.delay||n?p.delay(l,this.delay+n,t.Lively.timeouts):l()}}},{key:"getNext",value:function(e){var i=this,n=arguments.length>1&&void 0!==arguments[1]&&arguments[1],r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:1;if(e.Lively.index===this.length){e.Lively.animating=!1;var a=e.Lively.queue.shift()||[],o=t(a,2),s=o[0],l=o[1];return s?s.start(e,l):void(r>1&&this.start(e,{reverse:n,repeat:r-1}))}var u=e.Lively.index;n&&(u=this.length-1-u),this.apply(e,this.keyframes[u],{reverse:n}),e.Lively.index++,p.delay((function(){return i.getNext(e,n,r)}),this.delta,e.Lively.timeouts)}}]),r}();r(k,"initials",{opacity:1,scale:{x:1,y:1},position:{x:0,y:0},rotation:0,clip:{left:0,top:0,right:0,bottom:0},borderRadius:0,padding:0,fontSize:"1rem",backgroundColor:{r:127,g:127,b:127,a:255},color:{r:127,g:127,b:127,a:255},active:!0,interact:!0,zIndex:0});export{p as A,k as a,y as b,f as c,u as i,l,c as p,v as r};
