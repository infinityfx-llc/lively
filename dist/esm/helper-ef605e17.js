import e from"@babel/runtime/helpers/defineProperty";import t from"@babel/runtime/helpers/typeof";function n(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);t&&(i=i.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,i)}return n}function i(t){for(var i=1;i<arguments.length;i++){var r=null!=arguments[i]?arguments[i]:{};i%2?n(Object(r),!0).forEach((function(n){e(t,n,r[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(r)):n(Object(r)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(r,e))}))}return t}var r=function(e,t){var n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:window;"Lively"in n||(n.Lively={}),e in n.Lively||(n.Lively[e]=t)},o=function(e){return e&&"object"===t(e)&&!Array.isArray(e)},l=function(e,t){return new Array(t).fill(0).map((function(t,n){return n<e.length?e[n]:e[e.length-1]}))},a=function(e,t){if(t instanceof Function){r("Events",{}),e in window.Lively.Events||(window.Lively.Events[e]={unique:0},window.addEventListener(e,(function(t){Object.values(window.Lively.Events[e]).forEach((function(e){e instanceof Function&&e(t)}))})));var n=window.Lively.Events[e];t.Lively={ListenerID:n.unique},n[n.unique++]=t}},s=function(e,t){var n,i;"undefined"!=typeof window&&null!==(n=window.Lively)&&void 0!==n&&null!==(i=n.Events)&&void 0!==i&&i[e]&&null!=t&&t.Lively&&"ListenerID"in t.Lively&&delete window.Lively.Events[e][t.Lively.ListenerID]},d=function(e){r("queue",[],e),r("timeouts",{},e),e.Lively.style||(e.Lively.style=i(i({},function(e){for(var t={},n=0;n<e.style.length;n++)t[e.style[n]]=e.style[e.style[n]];return t}(e)),{},{transitionProperty:"all",willChange:"transform",strokeDasharray:1})),function(e,t){for(var n in e.style={},t)e.style[n]=t[n]}(e,e.Lively.style);var t=getComputedStyle(e),n=t.paddingLeft,o=t.paddingRight,l=t.paddingTop,a=t.paddingBottom,s=t.backgroundColor,d=t.color,u=t.borderRadius,y=t.padding,c=t.fontSize,p=t.zIndex,f=e.getBoundingClientRect(),v=f.x,g=f.y,w=f.width,b=f.height;e.Lively.initials={x:v,y:g,paddingLeft:n,paddingRight:o,paddingTop:l,paddingBottom:a,backgroundColor:s,color:d,fontSize:c,zIndex:"auto"===p?0:parseInt(p),width:w+"px",height:b+"px",borderRadius:u.split(" ")[0],padding:y.split(" ")[0]}};export{a,d as c,o as i,r as l,l as p,s as r};
