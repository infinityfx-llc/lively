import{i as n}from"./link-3a0d1369.js";function r(n,r){var e="undefined"!=typeof Symbol&&n[Symbol.iterator]||n["@@iterator"];if(!e){if(Array.isArray(n)||(e=function(n,r){if(!n)return;if("string"==typeof n)return t(n,r);var e=Object.prototype.toString.call(n).slice(8,-1);"Object"===e&&n.constructor&&(e=n.constructor.name);if("Map"===e||"Set"===e)return Array.from(n);if("Arguments"===e||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(e))return t(n,r)}(n))||r&&n&&"number"==typeof n.length){e&&(n=e);var o=0,a=function(){};return{s:a,n:function(){return o>=n.length?{done:!0}:{done:!1,value:n[o++]}},e:function(n){throw n},f:a}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var i,u=!0,f=!1;return{s:function(){e=e.call(n)},n:function(){var n=e.next();return u=n.done,n},e:function(n){f=!0,i=n},f:function(){try{u||null==e.return||e.return()}finally{if(f)throw i}}}}function t(n,r){(null==r||r>n.length)&&(r=n.length);for(var t=0,e=new Array(r);t<r;t++)e[t]=n[t];return e}var e={},o=function(r,t){r in e||(e[r]={unique:0},window.addEventListener(r,(function(t){for(var o=0,a=Object.values(e[r]);o<a.length;o++){var i=a[o];n.function(i)&&i(t)}})));var o=e[r];t.LivelyID=o.unique,o[o.unique++]=t},a=function(r,t){!n.null(window)&&r in e&&!n.null(t)&&"LivelyID"in t&&delete e[r][t.LivelyID]},i=function(n,t,e){var o,a=r(n);try{for(a.s();!(o=a.n()).done;){var i,u=o.value,f=r(t);try{for(f.s();!(i=f.n()).done;){i.value.addEventListener(u,e)}}catch(n){f.e(n)}finally{f.f()}}}catch(n){a.e(n)}finally{a.f()}},u=function(n,t,e){var o,a=r(n);try{for(a.s();!(o=a.n()).done;){var i,u=o.value,f=r(t);try{for(f.s();!(i=f.n()).done;){i.value.removeEventListener(u,e)}}catch(n){f.e(n)}finally{f.f()}}}catch(n){a.e(n)}finally{a.f()}};export{o as a,u as b,i as o,a as r};
