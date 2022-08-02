import e from"@babel/runtime/helpers/typeof";import t from"@babel/runtime/helpers/slicedToArray";import r from"@babel/runtime/helpers/asyncToGenerator";import n from"@babel/runtime/helpers/classCallCheck";import i from"@babel/runtime/helpers/createClass";import o from"@babel/runtime/helpers/inherits";import s from"@babel/runtime/helpers/possibleConstructorReturn";import a from"@babel/runtime/helpers/getPrototypeOf";import u from"@babel/runtime/helpers/defineProperty";import l from"@babel/runtime/regenerator";import{isValidElement as p,Children as c,cloneElement as h,Component as f}from"react";import{K as v,b as d,a as m,A as y}from"./animation-9ea0228d.js";import{L as w}from"./link-67981677.js";import{i as b,c as g,a as k,r as x}from"./helper-6ed90764.js";function L(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function j(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?L(Object(r),!0).forEach((function(t){u(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):L(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function O(e,t){var r="undefined"!=typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(!r){if(Array.isArray(e)||(r=function(e,t){if(!e)return;if("string"==typeof e)return E(e,t);var r=Object.prototype.toString.call(e).slice(8,-1);"Object"===r&&e.constructor&&(r=e.constructor.name);if("Map"===r||"Set"===r)return Array.from(e);if("Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r))return E(e,t)}(e))||t&&e&&"number"==typeof e.length){r&&(e=r);var n=0,i=function(){};return{s:i,n:function(){return n>=e.length?{done:!0}:{done:!1,value:e[n++]}},e:function(e){throw e},f:i}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var o,s=!0,a=!1;return{s:function(){r=r.call(e)},n:function(){var e=r.next();return s=e.done,e},e:function(e){a=!0,o=e},f:function(){try{s||null==r.return||r.return()}finally{if(a)throw o}}}}function E(e,t){(null==t||t>e.length)&&(t=e.length);for(var r=0,n=new Array(t);r<t;r++)n[r]=e[r];return n}function A(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}();return function(){var r,n=a(e);if(t){var i=a(this).constructor;r=Reflect.construct(n,arguments,i)}else r=n.apply(this,arguments);return s(this,r)}}var C=function(s){o(R,f);var a,u,L,E,C,D,F,P,M,V=A(R);function R(e){var t;n(this,R),(t=V.call(this,e)).hover=!1,t.hasFocus=!1,t.inView=!1,t.scrollDelta=0,t.viewportMargin=e.viewportMargin;var r=t.props.animate||{},i=r.duration,o=r.interpolate,s=r.origin,a=r.useLayout;for(var u in t.links={duration:i,interpolate:o,origin:s,useLayout:a},t.animations={default:t.parse(t.props.animate)},t.props.animations)t.animations[u]=t.parse(t.props.animations[u]);return t.links=new v(t.links),t.elements=[],t.children=[],t.level=0,t}return i(R,[{key:"parse",value:function(e){if(d.isAnimation(e))return e.use();if(!b(e))return null;var t={};for(var r in e){var n=e[r];w.isLink(n)?this.links[r]=n.link(this.style.bind(this)):t[r]=n}return new m(t,this.props.initial)}},{key:"style",value:function(){var e=this;cancelAnimationFrame(this.frame),this.frame=requestAnimationFrame((function(){var t,r=O(e.elements);try{for(r.s();!(t=r.n()).done;){var n=t.value;e.links.update(n)}}catch(e){r.e(e)}finally{r.f()}}))}},{key:"update",value:function(){var e,t=O(this.elements);try{for(t.s();!(e=t.n()).done;){var r=e.value;g(r),this.animations.default.restore(r,!0),this.links.update(r)}}catch(e){t.e(e)}finally{t.f()}}},{key:"componentDidMount",value:function(){var e=this,t=this.props.parentLevel<1||this.props.noCascade;this.resizeEventListener=this.onResize.bind(this),k("resize",this.resizeEventListener),t&&(this.scrollEventListener=this.onScroll.bind(this),k("scroll",this.scrollEventListener)),this.update(),r(l.mark((function r(){return l.wrap((function(r){for(;;)switch(r.prev=r.next){case 0:if(!("fonts"in document)){r.next=4;break}return r.next=3,document.fonts.ready;case 3:e.update({mount:!0});case 4:t&&(e.props.onMount&&e.play(e.props.onMount,{staggerDelay:.001,immediate:!0}),e.onScroll());case 5:case"end":return r.stop()}}),r)})))()}},{key:"componentDidUpdate",value:(M=r(l.mark((function e(){return l.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:this.update();case 1:case"end":return e.stop()}}),e,this)}))),function(){return M.apply(this,arguments)})},{key:"componentWillUnmount",value:function(){x("scroll",this.scrollEventListener),x("resize",this.resizeEventListener)}},{key:"inViewport",value:function(){var e=this,r=!0,n=!0;if(this.elements.forEach((function(t){var i=t.getBoundingClientRect().y;r=r&&i+t.clientHeight*(1-e.viewportMargin)<window.innerHeight,n=n&&i>window.innerHeight+t.clientHeight*e.viewportMargin})),!this.elements.length){var i,o=O(this.children);try{for(o.s();!(i=o.n()).done;){var s=i.value.animatable.inViewport(),a=t(s,2),u=a[0],l=a[1];r=r&&u,n=n&&l}}catch(e){o.e(e)}finally{o.f()}}return[r,n]}},{key:"onScroll",value:(P=r(l.mark((function e(){var r,n,i,o;return l.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(this.props.whileViewport&&!(Date.now()-this.scrollDelta<350)){e.next=2;break}return e.abrupt("return");case 2:this.scrollDelta=Date.now(),r=this.inViewport(),n=t(r,2),i=n[0],o=n[1],!this.inView&&i&&(this.inView=!0,this.props.whileViewport&&this.play(this.props.whileViewport)),this.inView&&o&&(this.inView=!1,this.props.whileViewport&&this.play(this.props.whileViewport,{reverse:!0,immediate:!0}));case 6:case"end":return e.stop()}}),e,this)}))),function(){return P.apply(this,arguments)})},{key:"onResize",value:(F=r(l.mark((function e(){var t;return l.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:null!==(t=this.nextResize)&&void 0!==t&&t.cancel&&this.nextResize.cancel(),this.nextResize=y.delay(this.update.bind(this,{mount:!0}),.25);case 2:case"end":return e.stop()}}),e,this)}))),function(){return F.apply(this,arguments)})},{key:"onEnter",value:(D=r(l.mark((function e(t){var r,n=arguments;return l.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:r=n.length>1&&void 0!==n[1]&&n[1],this.hover||(this.props.whileHover&&this.play(this.props.whileHover),this.hover=!0),r&&r(t);case 3:case"end":return e.stop()}}),e,this)}))),function(e){return D.apply(this,arguments)})},{key:"onLeave",value:(C=r(l.mark((function e(t){var r,n=arguments;return l.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:r=n.length>1&&void 0!==n[1]&&n[1],this.hover&&(this.props.whileHover&&this.play(this.props.whileHover,{reverse:!0}),this.hover=!1),r&&r(t);case 3:case"end":return e.stop()}}),e,this)}))),function(e){return C.apply(this,arguments)})},{key:"onFocus",value:(E=r(l.mark((function e(t){var r,n=arguments;return l.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:r=n.length>1&&void 0!==n[1]&&n[1],this.hasFocus||(this.props.whileFocus&&this.play(this.props.whileFocus),this.hasFocus=!0),r&&r(t);case 3:case"end":return e.stop()}}),e,this)}))),function(e){return E.apply(this,arguments)})},{key:"onBlur",value:(L=r(l.mark((function e(t){var r,n=arguments;return l.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:r=n.length>1&&void 0!==n[1]&&n[1],this.hasFocus&&(this.props.whileFocus&&this.play(this.props.whileFocus,{reverse:!0}),this.hasFocus=!1),r&&r(t);case 3:case"end":return e.stop()}}),e,this)}))),function(e){return L.apply(this,arguments)})},{key:"onClick",value:(u=r(l.mark((function e(t){var r,n=arguments;return l.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:r=n.length>1&&void 0!==n[1]&&n[1],this.props.onClick&&this.play(this.props.onClick),r&&r(t);case 3:case"end":return e.stop()}}),e,this)}))),function(e){return u.apply(this,arguments)})},{key:"play",value:(a=r(l.mark((function e(t){var r,n,i,o,s,a,u,p,c,h,f,v,d,m,w,b,g,k,x,L,j,E=this,A=arguments;return l.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(r=A.length>1&&void 0!==A[1]?A[1]:{},n=r.callback,i=r.reverse,o=void 0!==i&&i,s=r.immediate,a=void 0!==s&&s,u=r.cascade,p=void 0!==u&&u,c=r.groupAdjust,h=void 0===c?0:c,f=r.cascadeDelay,v=void 0===f?0:f,d=r.staggerDelay,m=void 0===d?0:d,!(this.props.parentLevel>0)||p){e.next=3;break}return e.abrupt("return");case 3:if(w="string"==typeof t?this.animations[t]:this.animations.default){e.next=6;break}return e.abrupt("return");case 6:b=0,this.elements.forEach((function(e,t){var r="group"in E.props?E.props.parentLevel-E.props.group:E.level+h;v=o?w.duration:v;var n=o?r*v:(E.props.parentLevel-r)*v;n=E.props.stagger*t+n+m,b=n>b?n:b,w.play(e,{delay:n,reverse:o,immediate:a})})),g=O(this.children);try{for(g.s();!(k=g.n()).done;)x=k.value,L=x.animatable,j=x.staggerIndex,L.play(t,{reverse:o,immediate:a,cascade:!0,staggerDelay:j<0?0:this.props.stagger*j,cascadeDelay:w.duration,groupAdjust:j<0?0:1})}catch(e){g.e(e)}finally{g.f()}n&&y.delay(n,b+w.duration);case 11:case"end":return e.stop()}}),e,this)}))),function(e){return a.apply(this,arguments)})},{key:"mergeProperties",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},n=j(j({},r),t);for(var i in n)["children","parentLevel","ref"].includes(i)?delete n[i]:Array.isArray(t[i])||Array.isArray(r[i])||"object"===e(t[i])&&"object"===e(r[i])&&(n[i]=j(j({},r[i]),t[i]));return n}},{key:"deepClone",value:function(e){var t,r=this,n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},i=n.index,o=void 0===i?0:i,s=n.useElements,a=void 0!==s&&s,u=n.useEvents,l=void 0===u||u;if(!p(e))return e;var f={};if(e.type===R||e.type.prototype instanceof R||(a&&(f={ref:function(e){return r.elements[o]=e}}),l&&(this.props.parentLevel<1||this.props.noCascade)&&(f=j(j({},f),{},{onMouseEnter:function(t){var n;return r.onEnter(t,null===(n=e.props)||void 0===n?void 0:n.onMouseEnter)},onMouseLeave:function(t){var n;return r.onLeave(t,null===(n=e.props)||void 0===n?void 0:n.onMouseLeave)},onFocus:function(t){var n;return r.onFocus(t,null===(n=e.props)||void 0===n?void 0:n.onFocus)},onBlur:function(t){var n;return r.onBlur(t,null===(n=e.props)||void 0===n?void 0:n.onBlur)},onClick:function(t){var n;return r.onClick(t,null===(n=e.props)||void 0===n?void 0:n.onClick)}}),l=!1)),(e.type===R||e.type.prototype instanceof R)&&(null===(t=e.props)||void 0===t||!t.noCascade)){var v=this.childrenIndex++;f=j(j(j({},f),this.mergeProperties(e.props,this.props)),{},{parentLevel:this.parentLevel>0?this.parentLevel:this.level,ref:function(e){return r.children[v]={animatable:e,staggerIndex:a?o:-1}}})}var d=c.map(e.props.children,(function(e,t){return r.deepClone(e,{index:t,useEvents:l})}));return h(e,f,d)}},{key:"countNestedLevels",value:function(e){var t=this;if(!e)return 0;var r=0,n=0;return c.forEach(e,(function(e){var i;if(p(e)){(e.type===R||e.type.prototype instanceof R)&&(r=1);var o=t.countNestedLevels(null===(i=e.props)||void 0===i?void 0:i.children);n=n<o?o:n}})),n+r}},{key:"render",value:function(){var e=this,t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:this.props.children;return this.level=this.countNestedLevels(t),this.childrenIndex=0,c.map(t,(function(t,r){return e.deepClone(t,{index:r,useElements:!0})}))}}]),R}();u(C,"defaultProps",{parentLevel:0,stagger:.1,viewportMargin:.25,animate:{},animations:{}});export{C as A};
