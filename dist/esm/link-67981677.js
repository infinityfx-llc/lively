function n(n,r){var e="undefined"!=typeof Symbol&&n[Symbol.iterator]||n["@@iterator"];if(!e){if(Array.isArray(n)||(e=function(n,r){if(!n)return;if("string"==typeof n)return t(n,r);var e=Object.prototype.toString.call(n).slice(8,-1);"Object"===e&&n.constructor&&(e=n.constructor.name);if("Map"===e||"Set"===e)return Array.from(n);if("Arguments"===e||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(e))return t(n,r)}(n))||r&&n&&"number"==typeof n.length){e&&(n=e);var o=0,i=function(){};return{s:i,n:function(){return o>=n.length?{done:!0}:{done:!1,value:n[o++]}},e:function(n){throw n},f:i}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var u,a=!0,c=!1;return{s:function(){e=e.call(n)},n:function(){var n=e.next();return a=n.done,n},e:function(n){c=!0,u=n},f:function(){try{a||null==e.return||e.return()}finally{if(c)throw u}}}}function t(n,t){(null==t||t>n.length)&&(t=n.length);for(var r=0,e=new Array(t);r<t;r++)e[r]=n[r];return e}function r(){var n=arguments.length>0&&void 0!==arguments[0]?arguments[0]:function(n){return n};return n.isBound?"undefined"!=typeof window?n(this.value):null:(n.isBound=!0,r.construct(this,n))}r.construct=function(t){for(var e=arguments.length,o=new Array(e>1?e-1:0),i=1;i<e;i++)o[i-1]=arguments[i];var u=r.bind.apply(r,[t].concat(o));return u.set=function(n){return t.value=n},u.link=function(n){return t.linked.push(n),u},u.feed=function(r){t.value=r;var e,o=n(t.linked);try{for(o.s();!(e=o.n()).done;){(0,e.value)()}}catch(n){o.e(n)}finally{o.f()}},u},r.create=function(n){return r.construct({value:n,linked:[]})},r.isLink=function(n){return n instanceof Function&&"link"in n};export{r as L};