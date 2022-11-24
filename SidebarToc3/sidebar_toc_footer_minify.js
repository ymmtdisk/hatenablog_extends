(function() {
'use strict';
//----------------------
// ↓設定ここから↓

const PAGES = [
  {
    class    : 'page-entry',
    title    : '目次',
    display  : true
  },
  {
    class    : 'page-index',
    title    : 'このページの記事一覧',
    listPage : true,
    display  : true
  },
  {
    class    : 'page-archive',
    title    : 'このページの記事一覧',
    listPage : true,
    display  : true
  },
  {
    class    : 'page-static_page',
    title    : 'entry-title',
    display  : false
  },
];
const MATCH_MEDIA         = false;
const MEDIA_QUERY_SIDEBAR = '(min-width: 768px)';
const MARGIN_TOP     = 10;
const MARGIN_BOTTOM  = 0;
const CURRENT_MARGIN = 50;
const ADJUST_FIXED   = 0;
const MAX_HEIGHT     = 0;
const HEADLINE_QUERY = ['h2', 'h3', 'h4', 'h5', 'h6'];
const HEADLINE_MIN   = 1;
const ADJUST_SCROLL  = 0;
const SCROLL_TIME_PC    = 400;
const SCROLL_TIME_TOUCH = 0;
const TOC_INSIDE_SCROLL = true;
const TOC_TITLE_TOP   = true;
const SCROLL_SHADOW   = false;
const LINK_HISTORY    = true;
const DELAY_GET_DOM   = false;
const DELAY_TIME_DOM  = 250;
const DELAY_TIME_LOAD = 1000;
const GLOBAL_HEADER   = ['#globalheader-container'];
const CLICK_UPDATE    = [];
const CLICK_UPDATE_DELAY = 500;
const USE_LIST        = 'ol';
const TOUCH_DEVICE    = 'ontouchstart' in window;
const TOUCH_DEVICE_DISABLE = false;
const F_STICKY_MODE   = false;
const PAUSE_NO_SIDEBAR = true;
const PAUSE_MAIN_SMALL = true;

// ↑設定ここまで↑
//----------------------

const t=window,e=document,n="stoc",o="stoc-module",i="stoc-title",r="stoc-body",s="stoc-guide",l="stoc-sub-guide",c="hatena-module-title",a="entry-title",f="entry-title-link",u="fade-in",d="touch",E="shadow",m="active",g="tracking",h="fixed",p="absolute",T="static",_="fixed",L="absolute",y="sticky",A=["marginTop","marginBottom"],I=["paddingTop","borderTopWidth","paddingBottom","borderBottomWidth"],C=TOUCH_DEVICE?SCROLL_TIME_TOUCH:SCROLL_TIME_PC,O=C>0;function N(t){return t+"px"}function S(){return e.createElement("div")}const v=function(){const t=/[&'"<>]/g,e={"&":"&amp;","'":"&#39;",'"':"&quot;","<":"&lt;",">":"&gt;"};function n(t){return e[t]}return function(e){return"string"!==typeof e?e:e.replace(t,n)}}();function D(e){const n=t.scrollX||t.pageXOffset,o=t.scrollY||t.pageYOffset;e.focus(),t.scrollTo(n,o)}function M(t,e){const n=void 0===e?{}:e;n.preventScroll?D(t):t.focus(),document.activeElement!==t&&(t.tabIndex=-1,n.preventScroll?D(t):t.focus())}const B=function(){const t={};return function(e){const n=e.id.replace(/[-]./g,function(t){return t.charAt(1).toUpperCase()});if(!t[n]){const o=getComputedStyle(e,null);if(!n)return o;t[n]=o}return t[n]}}();function b(t){let n=[];const o=t.charAt(0),i=t.slice(1);return"#"===o?n[0]=e.getElementById(i):"."===o&&(n=e.getElementsByClassName(i)),n}function R(t,e){const n=parseFloat(B(t)[e]);return n}function H(t){return t.ctrlKey||t.shiftKey||t.altKey||t.metaKey}function U(t,e){let n=t.offsetHeight;return e&&(n+=G(t,A)),n}function P(e,n){return e.getBoundingClientRect().top+(void 0!==n?n:t.pageYOffset)}const Y=function(){const e=1e3/30,n=t.scrollTo,o=t.performance?performance:Date;let i,r,s,l;{const e="requestAnimationFrame";(l=Object.prototype.hasOwnProperty.call(t,e))?(r=t[e],s=t.cancelAnimationFrame):(r=t.setTimeout,s=t.clearTimeout)}function c(t){return t<.5?2*t*t:(4-2*t)*t-1}return function(a,f){const u=o.now(),d=t.pageYOffset,E=t.pageXOffset,m=a-d;let g;s(i),i=r(l?function t(e){g=e-u;if(g>=f)return void n(E,a);n(E,c(g/f)*m+d);i=r(t)}:function t(){g=o.now()-u;if(g>=f)return void n(E,a);n(E,c(g/f)*m+d);i=r(t,e)})}}();function G(t,e){let n=0;const o=B(t);for(let t=0,i=e.length;t<i;t++){const i=parseFloat(o[e[t]]);isNaN(i)||(n+=i)}return n}function k(){const D=e.getElementById(n);if(!D)return;const k=D.parentNode.parentNode,w=D.parentElement,K=k.style,X=e.body.classList;let F;for(let t=0,e=PAGES.length;t<e;t++)if(X.contains(PAGES[t].class)){if(!PAGES[t].display)break;F=PAGES[t];break}if(!F)return void xt();const j=F.listPage,q=F.title,Q=e.getElementById("main-inner");let V=!1;if(!j){const t=Q.getElementsByClassName("table-of-contents")[0];if(t){const e=t.getElementsByTagName("a");for(let t=0,n=e.length;t<n;t++)e[t].addEventListener("click",wt,!1);V=!0}}if(TOUCH_DEVICE_DISABLE)return void xt();let W=[],J=[];if(j){const t=["hentry","archive-entry"];for(let e=0,n=t.length;e<n&&!((W=Q.getElementsByClassName(t[e])).length>1);e++);const e=Q.getElementsByClassName(f);for(let t=0,n=e.length;t<n;t++)J[t]=e[t].textContent}else W=Q.getElementsByClassName("hentry")[0].getElementsByClassName("entry-content")[0].querySelectorAll(HEADLINE_QUERY.join());if(W.length<=HEADLINE_MIN)return void xt();let z=[],Z=0;for(let t=0,e=W.length;t<e;t++){const e=W[t],n=j?J[t]:e.textContent;let o,i=0;if(V?o=e.id:(o="section"+t,e.setAttribute("id",o)),z[t]='<li><a href="#'+o+'">'+v(n)+"</a>",j)continue;const r=e.nodeName.toLowerCase();for(let t=1,e=HEADLINE_QUERY.length;t<e;t++)if(r===HEADLINE_QUERY[t]){i=t;break}for(;Z<i;)z[t]="<"+USE_LIST+">"+z[t],Z++;for(;Z>i;)z[t]="</"+USE_LIST+"></li>"+z[t],Z--}let $,tt=!1;""!==q&&($=j||q!==a?q:Q.getElementsByClassName(f)[0].textContent);const et=k.getElementsByClassName(c)[0];if(et&&k.removeChild(et),$){const n=v($),o=S();o.id=i,o.className=c,o.innerHTML=TOC_TITLE_TOP?'<a href="#top">'+n+"</a>":n,tt=k.insertBefore(o,k.firstElementChild),TOC_TITLE_TOP&&tt.getElementsByTagName("a")[0].addEventListener("click",function(n){0!==n.button||H(n)||(n.preventDefault(),O?Y(0,C):t.scrollTo(t.pageXOffset,0),M(e.querySelector("body"),{preventScroll:!0}),LINK_HISTORY&&t.history.pushState(null,"","#top"))},!1)}w.id=r;const nt=e.createElement("ol");nt.innerHTML=z.join(""),D.appendChild(nt),k.setAttribute("id",o);const ot=D.getElementsByTagName("a"),it=[];for(let t=0,e=ot.length;t<e;t++)ot[t].addEventListener("click",wt,!1),it[t]=ot[t].classList;const rt=e.getElementById("main"),st=e.getElementById("box2"),lt=k.classList,ct=[];for(let t=0,e=GLOBAL_HEADER.length;t<e;t++){const e=b(GLOBAL_HEADER[t]);e[0]&&ct.push(e[0])}const at=z.length-1;let ft,ut,dt,Et,mt,gt,ht,pt,Tt,_t,Lt,yt=[],At=!1;const It={};It[L]={left:""},It[_]={},It[T]={},SCROLL_SHADOW&&D.classList.add(E),TOUCH_DEVICE&&(D.classList.add(d),lt.add(d));let Ct,Ot,Nt,St=!1;if(TOUCH_DEVICE||F_STICKY_MODE){const t=["-webkit-"+y,y],e=S().style;for(let n=0,o=t.length;n<o;n++)if(e.position=t[n],St=-1!==e.position.indexOf(y)){lt.add("sticky");break}}const vt=k.parentNode,Dt=vt.children,Mt=Dt.length,Bt=S();let bt;Bt.id=s,Bt.className="hatena-module",Bt.style.cssText=["visibility: hidden;","height: 0;","margin-top: 0;","margin-bottom: 0;","padding-top: 0;","padding-bottom: 0;","border-top: 0;","border-bottom: 0;"].join(""),1===Mt?(Ct=vt.insertBefore(Bt,k),Nt=!0):(Nt=Dt[Mt-1]===k)?((Ot=k.previousElementSibling).id=l,Ct=vt.insertBefore(Bt,k)):Ct=vt.appendChild(Bt),t.addEventListener("resize",function(){clearTimeout(bt),bt=setTimeout(Ft,200)},!1),k.addEventListener("animationend",function(){lt.remove(u)},!1);const Rt=function(){let t=-1;return function(e){if(e!==t){if(t>=0&&it[t].remove(m),t=e,e<0)return;let n=ot[e];it[e].add(m),TOC_INSIDE_SCROLL&&_t&&At&&(D.scrollTop=n.offsetTop+n.offsetHeight-Tt)}}}(),Ht=function(){let t=0;return{update:function(e,n){return!(e===t||!Et)&&(n&&n(t),t=e,!0)},get:function(){return t},set:function(e){t=e}}}(),Ut=Ht.update,Pt=Ht.get,Yt=Ht.set,Gt=function(){let e=!1;return function(n){n!==e&&(e?t.removeEventListener("scroll",jt,!1):t.addEventListener("scroll",jt,!1),e=n)}}();function kt(){Ft();for(let t=0,e=CLICK_UPDATE.length;t<e;t++){const e=b(CLICK_UPDATE[t]);for(let t=0,n=e.length;t<n;t++){let n;e[t].addEventListener("click",function(){clearTimeout(n),n=setTimeout(Ft,CLICK_UPDATE_DELAY)},!1)}}t.addEventListener("load",function(){setTimeout(Ft,DELAY_TIME_LOAD)},!1)}function xt(){K.display="none"}function wt(n){if(0===n.button&&!H(n)){n.preventDefault();const o=decodeURIComponent(n.currentTarget.hash),i=e.getElementById(o.substr(1)),r=P(i)-mt+ADJUST_SCROLL;O?Y(Math.min(r,ft),C):t.scrollTo(t.pageXOffset,r),M(i,{preventScroll:!0}),LINK_HISTORY&&t.history.pushState(null,"",o)}}function Kt(t){D.style.maxHeight=t?N(Tt):"",_t=t}function Xt(t){const e=It[t];At=t!==T,Object.keys(e).forEach(function(t){K[t]=e[t]}),At?lt.add(g):lt.remove(g),_===t?lt.add(h):lt.remove(h),L===t?lt.add(p):lt.remove(p),Kt(At)}function Ft(){function n(t,e,n){if(Gt(t),Et=e,t&&e)n();else if(Yt(0),Xt(T),St&&(vt.style.height=""),!t)for(let t=0,e=it.length;t<e;t++)it[t].remove(m)}function o(t,e,n){let o;const i=e.style,r=i[n];return i[n]="",o=U(t,!0),i[n]=r,o}function i(t,e){function n(t,e){let n=[];for(let o=0,i=t.length;o<i;o++)n[o]=R(t[o],e);return Math.max.apply(null,n)}function o(t,e){const n=t.length-1,o=2*e;if(n>0)for(let e=0;e<n;e++)for(let n=0;n<2;n++)if(R(t[e],I[n+o])>0)return t.slice(0,e+1);return t}const i=n(o(t,0),A[0]),r=n(o(e,1),A[1]);return 0===i||0===r?0:Math.min(i,r)}const r=t.innerHeight,s=r-e.documentElement.clientHeight,l=Math.max(U(e.getElementById("wrapper")),U(rt));ft=Math.max(e.documentElement.scrollHeight-r,0),mt=0;for(let t=0,e=ct.length;t<e;t++)mt+=B(ct[t]).position===_?U(ct[t]):0;gt=mt+MARGIN_TOP,pt=Ct.getBoundingClientRect().left+t.pageXOffset;const c=lt.contains(g);c||lt.add(g);const a=G(k,I)+G(w,I.concat(A)),f=tt?U(tt,!0)+i([w],[tt]):0;if(Tt=r-s-gt-MARGIN_BOTTOM-a-f,MAX_HEIGHT){const t=MAX_HEIGHT-a-f;Tt>t&&(Tt=t)}lt.remove(g);for(let t=0,e=W.length;t<e;t++)yt[t]=P(W[t])-mt;if(K.width=B(Ct).width,Rt(-1),MATCH_MEDIA?t.matchMedia(MEDIA_QUERY_SIDEBAR).matches:"none"!==B(st).cssFloat)if(o(st,vt,"height")>l){if(n(!PAUSE_MAIN_SMALL,!1),PAUSE_MAIN_SMALL)return}else n(!0,!0,function(){Kt(At),Yt(-1),Lt=0;const t=U(Q),n=function(t,e,n){let o=[];const i=t.classList,r=n.filter(function(t){return i.contains(t)});return r.forEach(function(t){i.remove(t)}),e.forEach(function(e){o.push(R(t,e))}),r.forEach(function(t){i.add(t)}),o}(k,["marginTop","marginLeft"],[g,h,p]),s=n[0],l=n[1];pt-=l,St&&(vt.style.height=N(t)),ut=P(Ct)-mt+s+ADJUST_FIXED,Ot&&(ut-=i(tt?[k,tt]:[k],[Ot,Ot.children[1]])),Nt?ut-=MARGIN_TOP:At&&(ut+=o(k,D,"maxHeight"));const c=Math.min(r-gt,U(k));dt=P(Q)+t-c-gt,ht=Ct.offsetParent!==e.body?P(Ct.offsetParent):0,It[_].top=N(gt-s),It[L].top=N(dt-ht+gt-s)});else if(n(!PAUSE_NO_SIDEBAR,!1),PAUSE_NO_SIDEBAR)return;c&&lt.add(g),jt()}function jt(){const e=t.pageYOffset,n=t.pageXOffset;if(dt<e?Ut(2)&&(Xt(L),Lt=0):ut<e?Ut(1,function(t){Nt||0!==t||lt.add(u),Xt(_)}):Ut(0)&&Xt(T),St||1!==Pt()||n===Lt||(K.left=N(pt-n),Lt=n),e<=yt[0]-CURRENT_MARGIN)Rt(0);else if(ft-e<=CURRENT_MARGIN)Rt(at);else for(let t=at;t>=0;t--)if(e>yt[t]-CURRENT_MARGIN){Rt(t);break}}DELAY_GET_DOM?kt():x(kt)}function x(e){t.addEventListener("DOMContentLoaded",function(){setTimeout(e,DELAY_TIME_DOM)},!1)}DELAY_GET_DOM?x(k):k();}());
