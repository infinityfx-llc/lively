"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var e=require("./animatable-a2322b2f.js"),t=require("@babel/runtime/helpers/toConsumableArray"),r=require("@babel/runtime/helpers/asyncToGenerator"),i=require("@babel/runtime/helpers/classCallCheck"),n=require("@babel/runtime/helpers/createClass"),o=require("@babel/runtime/helpers/get"),a=require("@babel/runtime/helpers/inherits"),s=require("@babel/runtime/helpers/possibleConstructorReturn"),u=require("@babel/runtime/helpers/getPrototypeOf"),l=require("@babel/runtime/helpers/defineProperty"),p=require("@babel/runtime/regenerator"),h=require("react"),c=require("./animation-42f9647d.js");function f(e){return e&&"object"==typeof e&&"default"in e?e:{default:e}}require("@babel/runtime/helpers/slicedToArray"),require("@babel/runtime/helpers/typeof"),require("@babel/runtime/helpers/objectWithoutProperties");var d=f(t),y=f(r),m=f(i),v=f(n),b=f(o),g=f(a),w=f(s),x=f(u),A=f(l),k=f(p);function O(e,t){var r="undefined"!=typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(!r){if(Array.isArray(e)||(r=function(e,t){if(!e)return;if("string"==typeof e)return S(e,t);var r=Object.prototype.toString.call(e).slice(8,-1);"Object"===r&&e.constructor&&(r=e.constructor.name);if("Map"===r||"Set"===r)return Array.from(e);if("Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r))return S(e,t)}(e))||t&&e&&"number"==typeof e.length){r&&(e=r);var i=0,n=function(){};return{s:n,n:function(){return i>=e.length?{done:!0}:{done:!1,value:e[i++]}},e:function(e){throw e},f:n}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var o,a=!0,s=!1;return{s:function(){r=r.call(e)},n:function(){var e=r.next();return a=e.done,e},e:function(e){s=!0,o=e},f:function(){try{a||null==r.return||r.return()}finally{if(s)throw o}}}}function S(e,t){(null==t||t>e.length)&&(t=e.length);for(var r=0,i=new Array(t);r<t;r++)i[r]=e[r];return i}function q(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);t&&(i=i.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,i)}return r}function j(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?q(Object(r),!0).forEach((function(t){A.default(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):q(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function L(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}();return function(){var r,i=x.default(e);if(t){var n=x.default(this).constructor;r=Reflect.construct(i,arguments,n)}else r=i.apply(this,arguments);return w.default(this,r)}}var P=function(e){g.default(o,e);var t,r,i,n=L(o);function o(e){var t,r,i;return m.default(this,o),(i=n.call(this,e)).parent=(null===(t=(r=i.props).parent)||void 0===t?void 0:t.call(r))||{group:""},i.group=i.parent.group+i.props.group,i.useLayout=!1,i.childStyles={pointerEvents:"initial"},i.parentStyles={background:"transparent",border:"none",padding:0,pointerEvents:"none",backdropFilter:"none",boxShadow:"unset",fontSize:"unset"},i}return v.default(o,[{key:"layout",value:function(){this.position=this.position||getComputedStyle(this.element).position;var e=j(j({},this.parentStyles),{},{width:this.element.offsetWidth,height:this.element.offsetHeight});"absolute"===this.position||"fixed"===this.position?e.position="absolute":(e.position="relative",this.childStyles=j(j({},this.childStyles),{},{position:"absolute",margin:0,top:0,left:0})),this.parentStyles=e,this.useLayout=!0,this.hasUpdated=!0,this.forceUpdate()}},{key:"update",value:(i=y.default(k.default.mark((function e(){var t,r,i,n,o,a,s,u,l=arguments;return k.default.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(t=l.length>0&&void 0!==l[0]?l[0]:{},r=t.mount,i=void 0===r?!this.useLayout:r,n=t.active,o=void 0===n?this.props.active:n,this.element=this.elements[0],this.element){e.next=4;break}return e.abrupt("return");case 4:if(!this.props.useLayout||!i){e.next=6;break}return e.abrupt("return",this.layout());case 6:if(!this.element.Lively||this.hasUpdated){e.next=8;break}return e.abrupt("return");case 8:if(c.cacheElementStyles(this.element),this.hasUpdated=!1,!this.parent.props){e.next=12;break}return e.abrupt("return");case 12:return e.next=14,c.AnimationQueue.sleep(.001);case 14:this.setUniqueId(),this.animations={default:this.unmorphAnimation()},o||this.animations.default.setInitial(this.element),a=O(this.children);try{for(a.s();!(s=a.n()).done;)(u=s.value.animatable).setUniqueId(),u.animations={default:u.unmorphAnimation()},o||u.animations.default.setInitial(u.element)}catch(e){a.e(e)}finally{a.f()}case 19:case"end":return e.stop()}}),e,this)}))),function(){return i.apply(this,arguments)})},{key:"setUniqueId",value:function(){this.parent.id&&(this.id=this.parent.id),"id"in this||("Lively"in window||(window.Lively={}),"Morph"in window.Lively||(window.Lively.Morph={}),this.group in window.Lively.Morph||(window.Lively.Morph[this.group]=0),this.id=window.Lively.Morph[this.group]++),"id"in this&&this.element.setAttribute("lively-morph-id",this.id.toString())}},{key:"componentDidUpdate",value:(r=y.default(k.default.mark((function e(t){return k.default.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,this.update({mount:!1,active:t.active});case 2:t.active!==this.props.active&&this.morph(this.props.active);case 3:case"end":return e.stop()}}),e,this)}))),function(e){return r.apply(this,arguments)})},{key:"morph",value:(t=y.default(k.default.mark((function e(t){var r,i;return k.default.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return t&&this.element.setAttribute("lively-morph-target",!0),e.next=3,c.AnimationQueue.sleep(.001);case 3:t?this.play("default",{immediate:!0}):(r=document.querySelector('[lively-morph-group="'.concat(this.group,'"][lively-morph-target="true"]')))&&(r.removeAttribute("lively-morph-target"),(i=r.getAttribute("lively-morph-id"))in this.animations||this.createAnimations(i),this.play(i,{immediate:!0}));case 4:case"end":return e.stop()}}),e,this)}))),function(e){return t.apply(this,arguments)})},{key:"createAnimations",value:function(e){var t=document.querySelector('[lively-morph-group="'.concat(this.group,'"][lively-morph-id="').concat(e,'"]'));this.animations[e]=this.morphAnimation(this.element,t);var r,i=O(this.children);try{for(i.s();!(r=i.n()).done;){r.value.animatable.createAnimations(e)}}catch(e){i.e(e)}finally{i.f()}}},{key:"animationFromKeyframes",value:function(e){var t=this,r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},i=o.properties.slice();this.props.useLayout&&i.push.apply(i,d.default(o.layoutProperties));var n,a={useLayout:this.props.useLayout,interpolate:this.props.interpolate,origin:{x:0,y:0},duration:this.props.duration},s=O(i);try{var u=function(){var i=n.value;if(t.props.ignore.includes(i))return"continue";var o=i in e?i:"auto";if(!(o in e))return"continue";a[i]=e[o].map((function(e){if(!c.isObject(e))return e in r?r[e][i]:e;var t={};for(var n in e)e[n]in r?t[n]=r[e[n]][i]:t[n]=e[n];return t}))};for(s.s();!(n=s.n()).done;)u()}catch(e){s.e(e)}finally{s.f()}return new c.Animation(a)}},{key:"morphAnimation",value:function(e,t){var r,i;return t?(e=null===(r=e.Lively)||void 0===r?void 0:r.initials,t=null===(i=t.Lively)||void 0===i?void 0:i.initials,this.x=t.x-e.x,this.y=t.y-e.y,this.parent.props&&(this.x-=this.parent.x,this.y-=this.parent.y),this.animationFromKeyframes({auto:["from","to",{set:"to",end:"from"}],position:["from","to",{set:"to",end:"from"}],scale:["from","to",{set:"to",end:"from"}],opacity:[1,1,0],interact:[!0,!0,!1]},{from:j(j({},e),{},{position:{x:0,y:0},scale:{x:1,y:1}}),to:j(j({},t),{},{position:{x:this.x,y:this.y},scale:{x:parseInt(t.width)/parseInt(e.width),y:parseInt(t.height)/parseInt(e.height)}})})):this.animationFromKeyframes({opacity:[1,0,0],interact:[!0,!1,!1]})}},{key:"unmorphAnimation",value:function(){return this.animationFromKeyframes({auto:["from","from","from"],position:[{x:0,y:0}],scale:[{x:1,y:1}],opacity:[0,0,1],interact:[!1,!1,!0]},{from:this.element.Lively.initials})}},{key:"getChildren",value:function(e){var t=this;return h.Children.map(e,(function(e){if(!h.isValidElement(e))return e;var r=e.type!==o?{}:{parent:function(){return t},duration:t.props.duration};return h.cloneElement(e,r,t.getChildren(e.props.children))}))}},{key:"render",value:function(){var e,t=null!==(e=this.props.children)&&void 0!==e&&e.length?this.props.children[0]:this.props.children;if(!h.isValidElement(t))return t;var r=this.getChildren(t.props.children),i={"lively-morph-group":this.group,style:j(j({},t.props.style),this.childStyles)},n=b.default(x.default(o.prototype),"render",this).call(this,h.cloneElement(t,i,r));return this.useLayout?h.cloneElement(t,{style:this.parentStyles},n):n}}]),o}(e.Animatable);A.default(P,"properties",["position","scale","opacity","backgroundColor","color","interact","zIndex"]),A.default(P,"layoutProperties",["borderRadius","fontSize"]),A.default(P,"defaultProps",{group:0,active:!1,useLayout:!1,interpolate:"ease",duration:1.5,ignore:[]}),exports.Animatable=e.Animatable,exports.Animation=c.Animation,exports.Morph=P;
