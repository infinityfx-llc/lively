import e from"@babel/runtime/helpers/slicedToArray";import t from"@babel/runtime/helpers/asyncToGenerator";import r from"@babel/runtime/helpers/typeof";import n from"@babel/runtime/helpers/classCallCheck";import i from"@babel/runtime/helpers/createClass";import o from"@babel/runtime/helpers/inherits";import s from"@babel/runtime/helpers/possibleConstructorReturn";import a from"@babel/runtime/helpers/getPrototypeOf";import l from"@babel/runtime/helpers/defineProperty";import u from"@babel/runtime/regenerator";import p,{isValidElement as c,Children as h,cloneElement as f,Component as v}from"react";import{c as d,A as y,a as m,r as b,b as g,M as w,P as k,s as O}from"./pop-f8d815a5.js";import x from"@babel/runtime/helpers/extends";import L from"@babel/runtime/helpers/objectWithoutProperties";import j from"@babel/runtime/helpers/toConsumableArray";import A from"@babel/runtime/helpers/get";function P(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function E(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?P(Object(r),!0).forEach((function(t){l(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):P(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function S(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}();return function(){var r,n=a(e);if(t){var i=a(this).constructor;r=Reflect.construct(n,arguments,i)}else r=n.apply(this,arguments);return s(this,r)}}var C=function(s){o(C,v);var a,l,p,w,k,O,x,L,j,A,P=S(C);function C(e){var t;for(var r in n(this,C),(t=P.call(this,e)).hover=!1,t.hasFocus=!1,t.inView=!1,t.scrollDelta=0,t.viewportMargin=e.viewportMargin,t.animations={default:t.toAnimation(t.props.animate)},t.props.animations)t.animations[r]=t.toAnimation(t.props.animations[r]);return t.elements=[],t.children=[],t.level=0,t}return i(C,[{key:"update",value:function(){var e=this;this.elements.forEach((function(t){var r;d(t),null===(r=e.animations.default)||void 0===r||r.setToLast(t,!0)}))}},{key:"toAnimation",value:function(e){return!e||"object"!==r(e)&&"function"!=typeof e?null:"use"in e?e.use():Object.keys(e).length?new y(E({},e),this.props.initial):null}},{key:"componentDidMount",value:(A=t(u.mark((function e(){return u.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(this.resizeEventListener=this.onResize.bind(this),m("resize",this.resizeEventListener),this.update(!0),!("fonts"in document)){e.next=7;break}return e.next=6,document.fonts.ready;case 6:this.update(!0);case 7:(this.props.parentLevel<1||this.props.noCascade)&&(this.scrollEventListener=this.onScroll.bind(this),m("scroll",this.scrollEventListener),this.props.onMount&&this.play(this.props.onMount,{staggerDelay:.001,immediate:!0}),this.props.whileViewport&&this.onScroll());case 8:case"end":return e.stop()}}),e,this)}))),function(){return A.apply(this,arguments)})},{key:"componentDidUpdate",value:(j=t(u.mark((function e(){return u.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:this.update();case 1:case"end":return e.stop()}}),e,this)}))),function(){return j.apply(this,arguments)})},{key:"componentWillUnmount",value:function(){b("scroll",this.scrollEventListener),b("resize",this.resizeEventListener)}},{key:"inViewport",value:function(){var t=this,r=!0,n=!0;return this.elements.forEach((function(e){var i=e.getBoundingClientRect().y;r=r&&i+e.clientHeight*(1-t.viewportMargin)<window.innerHeight,n=n&&i>window.innerHeight+e.clientHeight*t.viewportMargin})),this.elements.length||this.children.forEach((function(t){var i=t.animatable.inViewport(),o=e(i,2),s=o[0],a=o[1];r=r&&s,n=n&&a})),[r,n]}},{key:"onScroll",value:(L=t(u.mark((function t(){var r,n,i,o;return u.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(!(Date.now()-this.scrollDelta<350)){t.next=2;break}return t.abrupt("return");case 2:this.scrollDelta=Date.now(),r=this.inViewport(),n=e(r,2),i=n[0],o=n[1],!this.inView&&i&&(this.inView=!0,this.props.whileViewport&&this.play(this.props.whileViewport)),this.inView&&o&&(this.inView=!1,this.props.whileViewport&&this.play(this.props.whileViewport,{reverse:!0,immediate:!0}));case 6:case"end":return t.stop()}}),t,this)}))),function(){return L.apply(this,arguments)})},{key:"onResize",value:(x=t(u.mark((function e(){var t;return u.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:null!==(t=this.nextResize)&&void 0!==t&&t.cancel&&this.nextResize.cancel(),this.nextResize=g.delay(this.update.bind(this),.25);case 2:case"end":return e.stop()}}),e,this)}))),function(){return x.apply(this,arguments)})},{key:"onEnter",value:(O=t(u.mark((function e(t){var r,n=arguments;return u.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:r=n.length>1&&void 0!==n[1]&&n[1],this.hover||(this.props.whileHover&&this.play(this.props.whileHover),this.hover=!0),r&&r(t);case 3:case"end":return e.stop()}}),e,this)}))),function(e){return O.apply(this,arguments)})},{key:"onLeave",value:(k=t(u.mark((function e(t){var r,n=arguments;return u.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:r=n.length>1&&void 0!==n[1]&&n[1],this.hover&&(this.props.whileHover&&this.play(this.props.whileHover,{reverse:!0}),this.hover=!1),r&&r(t);case 3:case"end":return e.stop()}}),e,this)}))),function(e){return k.apply(this,arguments)})},{key:"onFocus",value:(w=t(u.mark((function e(t){var r,n=arguments;return u.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:r=n.length>1&&void 0!==n[1]&&n[1],this.hasFocus||(this.props.whileFocus&&this.play(this.props.whileFocus),this.hasFocus=!0),r&&r(t);case 3:case"end":return e.stop()}}),e,this)}))),function(e){return w.apply(this,arguments)})},{key:"onBlur",value:(p=t(u.mark((function e(t){var r,n=arguments;return u.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:r=n.length>1&&void 0!==n[1]&&n[1],this.hasFocus&&(this.props.whileFocus&&this.play(this.props.whileFocus,{reverse:!0}),this.hasFocus=!1),r&&r(t);case 3:case"end":return e.stop()}}),e,this)}))),function(e){return p.apply(this,arguments)})},{key:"onClick",value:(l=t(u.mark((function e(t){var r,n=arguments;return u.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:r=n.length>1&&void 0!==n[1]&&n[1],this.props.onClick&&this.play(this.props.onClick),r&&r(t);case 3:case"end":return e.stop()}}),e,this)}))),function(e){return l.apply(this,arguments)})},{key:"play",value:(a=t(u.mark((function e(t){var r,n,i,o,s,a,l,p,c,h,f,v,d,y,m,b,w=this,k=arguments;return u.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(r=k.length>1&&void 0!==k[1]?k[1]:{},n=r.callback,i=r.reverse,o=void 0!==i&&i,s=r.immediate,a=void 0!==s&&s,l=r.cascade,p=void 0!==l&&l,c=r.groupAdjust,h=void 0===c?0:c,f=r.cascadeDelay,v=void 0===f?0:f,d=r.staggerDelay,y=void 0===d?0:d,!(this.props.parentLevel>0)||p){e.next=3;break}return e.abrupt("return");case 3:if(m="string"==typeof t?this.animations[t]:this.animations.default){e.next=6;break}return e.abrupt("return");case 6:b=0,this.elements.forEach((function(e,t){var r="group"in w.props?w.props.parentLevel-w.props.group:w.level+h;v=o?m.duration:v;var n=o?r*v:(w.props.parentLevel-r)*v;n=w.props.stagger*t+n+y,b=n>b?n:b,m.play(e,{delay:n,reverse:o,immediate:a})})),this.children.forEach((function(e){var r=e.animatable,n=e.staggerIndex,i=void 0===n?-1:n;r.play(t,{reverse:o,immediate:a,cascade:!0,staggerDelay:i<0?0:w.props.stagger*i,cascadeDelay:m.duration,groupAdjust:i<0?0:1})})),n&&g.delay(n,b+m.duration);case 10:case"end":return e.stop()}}),e,this)}))),function(e){return a.apply(this,arguments)})},{key:"mergeProperties",value:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},n=E(E({},t),e);for(var i in n)["children","parentLevel","ref"].includes(i)?delete n[i]:Array.isArray(e[i])||Array.isArray(t[i])||"object"===r(e[i])&&"object"===r(t[i])&&(n[i]=E(E({},t[i]),e[i]));return n}},{key:"deepClone",value:function(e){var t,r=this,n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},i=n.index,o=void 0===i?0:i,s=n.useElements,a=void 0!==s&&s,l=n.useEvents,u=void 0===l||l;if(!c(e))return e;var p={};if(e.type===C||e.type.prototype instanceof C||(a&&(p={ref:function(e){return r.elements[o]=e}}),u&&(this.props.parentLevel<1||this.props.noCascade)&&(p=E(E({},p),{},{onMouseEnter:function(t){var n;return r.onEnter(t,null===(n=e.props)||void 0===n?void 0:n.onMouseEnter)},onMouseLeave:function(t){var n;return r.onLeave(t,null===(n=e.props)||void 0===n?void 0:n.onMouseLeave)},onFocus:function(t){var n;return r.onFocus(t,null===(n=e.props)||void 0===n?void 0:n.onFocus)},onBlur:function(t){var n;return r.onBlur(t,null===(n=e.props)||void 0===n?void 0:n.onBlur)},onClick:function(t){var n;return r.onClick(t,null===(n=e.props)||void 0===n?void 0:n.onClick)}}),u=!1)),(e.type===C||e.type.prototype instanceof C)&&(null===(t=e.props)||void 0===t||!t.noCascade)){var v=this.childrenIndex++;p=E(E(E({},p),this.mergeProperties(e.props,this.props)),{},{parentLevel:this.parentLevel>0?this.parentLevel:this.level,ref:function(e){return r.children[v]={animatable:e,staggerIndex:a?o:-1}}})}var d=h.map(e.props.children,(function(e,t){return r.deepClone(e,{index:t,useEvents:u})}));return f(e,p,d)}},{key:"countNestedLevels",value:function(e){var t=this;if(!e)return 0;var r=0,n=0;return h.forEach(e,(function(e){var i;if(c(e)){(e.type===C||e.type.prototype instanceof C)&&(r=1);var o=t.countNestedLevels(null===(i=e.props)||void 0===i?void 0:i.children);n=n<o?o:n}})),n+r}},{key:"render",value:function(){var e=this,t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:this.props.children;return this.level=this.countNestedLevels(t),this.childrenIndex=0,h.map(t,(function(t,r){return e.deepClone(t,{index:r,useElements:!0})}))}}]),C}();l(C,"defaultProps",{parentLevel:0,stagger:.1,viewportMargin:.25,animate:{},animations:{}});var D=["levels","animations"];function R(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function M(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?R(Object(r),!0).forEach((function(t){l(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):R(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function F(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}();return function(){var r,n=a(e);if(t){var i=a(this).constructor;r=Reflect.construct(n,arguments,i)}else r=n.apply(this,arguments);return s(this,r)}}var I=function(e){o(r,v);var t=F(r);function r(e){var i;return n(this,r),(i=t.call(this,e)).levels=i.props.levels,i.animations=new Array(i.levels).fill(0).map((function(e,t){return t<i.props.animations.length?i.props.animations[t]:i.props.animations[i.props.animations.length-1]})),i}return i(r,[{key:"makeAnimatable",value:function(e){var t=this,r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:1;if(r<1||h.count(e)<1)return e;var n=this.props;n.levels,n.animations;var i=L(n,D),o=this.animations[this.levels-r];return r===this.levels&&(i.ref=function(e){return t.animatable=e}),p.createElement(C,x({animate:o},i),h.map(e,(function(e){return c(e)?f(e,{},t.makeAnimatable(e.props.children,r-1)):e})))}},{key:"play",value:function(e){var t,r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};null===(t=this.animatable)||void 0===t||t.play(e,M({},r))}},{key:"shouldComponentUpdate",value:function(e){return e.animations===this.props.animations}},{key:"render",value:function(){return this.makeAnimatable(this.props.children,this.levels)}}]),r}();function U(e,t){var r="undefined"!=typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(!r){if(Array.isArray(e)||(r=function(e,t){if(!e)return;if("string"==typeof e)return V(e,t);var r=Object.prototype.toString.call(e).slice(8,-1);"Object"===r&&e.constructor&&(r=e.constructor.name);if("Map"===r||"Set"===r)return Array.from(e);if("Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r))return V(e,t)}(e))||t&&e&&"number"==typeof e.length){r&&(e=r);var n=0,i=function(){};return{s:i,n:function(){return n>=e.length?{done:!0}:{done:!1,value:e[n++]}},e:function(e){throw e},f:i}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var o,s=!0,a=!1;return{s:function(){r=r.call(e)},n:function(){var e=r.next();return s=e.done,e},e:function(e){a=!0,o=e},f:function(){try{s||null==r.return||r.return()}finally{if(a)throw o}}}}function V(e,t){(null==t||t>e.length)&&(t=e.length);for(var r=0,n=new Array(t);r<t;r++)n[r]=e[r];return n}function z(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function B(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?z(Object(r),!0).forEach((function(t){l(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):z(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function H(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}();return function(){var r,n=a(e);if(t){var i=a(this).constructor;r=Reflect.construct(n,arguments,i)}else r=n.apply(this,arguments);return s(this,r)}}l(I,"defaultProps",{levels:1,stagger:.1,viewportMargin:.25,animations:[w,k]});var T=function(e){o(v,C);var r,s,l,p=H(v);function v(e){var t,r,i;return n(this,v),(i=p.call(this,e)).parent=(null===(t=(r=i.props).parent)||void 0===t?void 0:t.call(r))||{group:""},i.group=i.parent.group+i.props.group,i.state={useLayout:!1,childStyles:{},parentStyles:{position:"relative",background:"transparent",border:"none",pointerEvents:"none",backdropFilter:"none",fontSize:"unset"}},i}return i(v,[{key:"layoutUpdate",value:function(){delete this.element.Lively;var e,t=getComputedStyle(this.element).position,r=this.state.useLayout;"absolute"!==t&&"fixed"!==t||r?(e={position:"absolute",margin:0,top:0,left:0,pointerEvents:"initial"},r=!0):e={top:this.element.offsetTop,left:this.element.offsetLeft},this.setState({childStyles:e,parentStyles:B(B({},this.state.parentStyles),{},{width:this.element.offsetWidth,height:this.element.offsetHeight}),useLayout:r})}},{key:"update",value:(l=t(u.mark((function e(){var t,r,n,i,o=arguments;return u.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(r=o.length>0&&void 0!==o[0]&&o[0],n=o.length>1&&void 0!==o[1]?o[1]:this.props.active,i=null===(t=this.element)||void 0===t?void 0:t.Lively,this.element=this.elements[0],this.element){e.next=6;break}return e.abrupt("return");case 6:if(!r||!this.props.useLayout){e.next=8;break}return e.abrupt("return",this.layoutUpdate());case 8:if(i&&!r?(this.element.Lively=i,O(this.element,i.style)):d(this.element),!this.parent.props){e.next=11;break}return e.abrupt("return");case 11:return e.next=13,g.sleep(.001);case 13:this.setUniqueId(),this.animations={default:this.createUnmorphAnimation()},this.animations.default.setToLast(this.element,!n),this.children.forEach((function(e){var t=e.animatable;t.setUniqueId(),t.animations={default:t.createUnmorphAnimation()},t.animations.default.setToLast(t.element,!n)}));case 17:case"end":return e.stop()}}),e,this)}))),function(){return l.apply(this,arguments)})},{key:"setUniqueId",value:function(){this.parent.id&&(this.id=this.parent.id),"id"in this||("Lively"in window||(window.Lively={}),"Morph"in window.Lively||(window.Lively.Morph={}),this.group in window.Lively.Morph||(window.Lively.Morph[this.group]=0),this.id=window.Lively.Morph[this.group]++),"id"in this&&this.element.setAttribute("lively-morph-id",this.id.toString())}},{key:"componentDidUpdate",value:(s=t(u.mark((function e(t){return u.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,this.update(!1,t.active);case 2:t.active!==this.props.active&&this.morph(this.props.active);case 3:case"end":return e.stop()}}),e,this)}))),function(e){return s.apply(this,arguments)})},{key:"morph",value:(r=t(u.mark((function e(t){var r,n;return u.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return t&&this.element.setAttribute("lively-morph-target",!0),e.next=3,g.sleep(.001);case 3:t?this.play("default",{immediate:!0}):(r=document.querySelector('[lively-morph-group="'.concat(this.group,'"][lively-morph-target="true"]')))&&(r.removeAttribute("lively-morph-target"),(n=r.getAttribute("lively-morph-id"))in this.animations||this.createAnimations(n),this.play(n,{immediate:!0}));case 4:case"end":return e.stop()}}),e,this)}))),function(e){return r.apply(this,arguments)})},{key:"createAnimations",value:function(e){var t=document.querySelector('[lively-morph-group="'.concat(this.group,'"][lively-morph-id="').concat(e,'"]'));this.animations[e]=this.createMorphAnimation(t),this.children.forEach((function(t){return t.animatable.createAnimations(e)}))}},{key:"createAnimation",value:function(e){var t,r,n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},i=null===(t=this.element.Lively)||void 0===t?void 0:t.initials,o=null==e||null===(r=e.Lively)||void 0===r?void 0:r.initials,s=v.properties;this.props.useLayout&&s.push.apply(s,j(v.layoutProperties));var a,l={useLayout:this.props.useLayout,interpolate:this.props.interpolate,origin:{x:0,y:0},duration:this.props.duration},u=U(s);try{for(u.s();!(a=u.n()).done;){var p=a.value;this.props.ignore.includes(p)||(l[p]=p in n?n[p]:o?[i[p],o[p],o[p]]:[i[p],i[p],i[p]])}}catch(e){u.e(e)}finally{u.f()}return new y(l)}},{key:"createMorphAnimation",value:function(e){var t,r;if(!e)return this.createAnimation(null,{opacity:[1,0,0],interact:[!0,!1,!1]});var n=null===(t=this.element.Lively)||void 0===t?void 0:t.initials,i=null===(r=e.Lively)||void 0===r?void 0:r.initials;this.x=i.x-n.x,this.y=i.y-n.y,this.parent.props&&(this.x-=this.parent.x,this.y-=this.parent.y);var o=parseInt(i.width)/parseInt(n.width),s=parseInt(i.height)/parseInt(n.height);return this.createAnimation(e,{position:[{x:0,y:0},{x:this.x,y:this.y},{x:this.x,y:this.y}],scale:[{x:1,y:1},{x:o,y:s},{x:o,y:s}],opacity:[1,1,0],interact:[!0,!0,!1]})}},{key:"createUnmorphAnimation",value:function(){return this.createAnimation(null,{position:{x:0,y:0},scale:{x:1,y:1},opacity:[0,0,1],interact:[!1,!1,!0]})}},{key:"getChildren",value:function(e){var t=this;return h.map(e,(function(e){if(!c(e))return e;var r=e.type!==v?{}:{parent:function(){return t},duration:t.props.duration};return f(e,r,t.getChildren(e.props.children))}))}},{key:"render",value:function(){var e,t=null!==(e=this.props.children)&&void 0!==e&&e.length?this.props.children[0]:this.props.children;if(!c(t))return t;var r=this.getChildren(t.props.children),n={"lively-morph-group":this.group,style:B(B({},t.props.style),this.state.childStyles)},i=A(a(v.prototype),"render",this).call(this,f(t,n,r));return this.state.useLayout?f(t,{style:this.state.parentStyles},i):i}}]),v}();l(T,"properties",["position","scale","opacity","backgroundColor","color","interact"]),l(T,"layoutProperties",["borderRadius","fontSize"]),l(T,"defaultProps",{id:null,group:0,active:!1,useLayout:!1,interpolate:"ease",duration:1.5,ignore:[]});export{C as Animatable,I as Animate,T as Morph};
