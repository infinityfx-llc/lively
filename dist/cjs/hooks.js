"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var e=require("@babel/runtime/helpers/slicedToArray"),r=require("react"),t=require("./link-884ecbbe.js"),u=require("./scroll-fd4c118f.js");function n(e){return e&&"object"==typeof e&&"default"in e?e:{default:e}}require("./helper-dfb168a5.js"),require("@babel/runtime/helpers/typeof");var o=n(e);exports.useScroll=u.useScroll,exports.useAnimation=function(e){var r=t.Link.create(e);return[r,r.feed]},exports.useUnmount=function(e){var t=r.useState(e),u=o.default(t,2),n=u[0],i=u[1],l=r.useRef();return[n,function(){var e;if(!n)return i(!0);null!==(e=l.current)&&void 0!==e&&e.props.onUnmount&&l.current.play(l.current.props.onUnmount,{reverse:!0,immediate:!0,callback:function(){return i(!1)}})},l]};
