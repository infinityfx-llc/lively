import i from"@babel/runtime/helpers/typeof";var n=function(i,n){var e=arguments.length>2&&void 0!==arguments[2]?arguments[2]:window;"Lively"in e||(e.Lively={}),i in e.Lively||(e.Lively[i]=n)},e=function(n){return n&&"object"===i(n)&&!Array.isArray(n)},t=function(i,n){return new Array(n).fill(0).map((function(n,e){return e<i.length?i[e]:i[i.length-1]}))},o=function(i,e){if(e instanceof Function){n("Events",{}),i in window.Lively.Events||(window.Lively.Events[i]={unique:0},window.addEventListener(i,(function(n){Object.values(window.Lively.Events[i]).forEach((function(i){i instanceof Function&&i(n)}))})));var t=window.Lively.Events[i];e.Lively={ListenerID:t.unique},t[t.unique++]=e}},l=function(i,n){var e,t;"undefined"!=typeof window&&null!==(e=window.Lively)&&void 0!==e&&null!==(t=e.Events)&&void 0!==t&&t[i]&&null!=n&&n.Lively&&"ListenerID"in n.Lively&&delete window.Lively.Events[i][n.Lively.ListenerID]},r=function(i){n("queue",[],i),n("timeouts",{},i),i.Lively.style||(i.Lively.style=function(i){for(var n={},e=0;e<i.style.length;e++)n[i.style[e]]=i.style[i.style[e]];return n}(i),i.Lively.style.transitionProperty="transform, opacity, clip-path, border-radius, font-size, background-color, color, width, height, padding",i.Lively.style.willChange="transform"),function(i,n){for(var e in i.style={},n)i.style[e]=n[e]}(i,i.Lively.style);var e=getComputedStyle(i),t=e.paddingLeft,o=e.paddingRight,l=e.paddingTop,r=e.paddingBottom,d=e.backgroundColor,a=e.color,s=e.borderRadius,u=e.padding,y=e.fontSize,v=e.zIndex,p=i.getBoundingClientRect(),c=p.x,f=p.y,g=p.width,L=p.height;i.Lively.initials={x:c,y:f,paddingLeft:t,paddingRight:o,paddingTop:l,paddingBottom:r,backgroundColor:d,color:a,fontSize:y,zIndex:"auto"===v?0:parseInt(v),width:g+"px",height:L+"px",borderRadius:s.split(" ")[0],padding:u.split(" ")[0]}};export{o as a,r as c,e as i,n as l,t as p,l as r};