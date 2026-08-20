"use strict";var DeckKit=(()=>{var Le=Object.defineProperty;var Lt=Object.getOwnPropertyDescriptor;var Tt=Object.getOwnPropertyNames;var St=Object.prototype.hasOwnProperty;var Mt=(e,t)=>{for(var n in t)Le(e,n,{get:t[n],enumerable:!0})},Ht=(e,t,n,i)=>{if(t&&typeof t=="object"||typeof t=="function")for(let r of Tt(t))!St.call(e,r)&&r!==n&&Le(e,r,{get:()=>t[r],enumerable:!(i=Lt(t,r))||i.enumerable});return e};var At=e=>Ht(Le({},"__esModule",{value:!0}),e);var Gn={};Mt(Gn,{GROUP_ORDER:()=>me,LAYOUTS:()=>de,LAYOUT_BY_KEY:()=>K,SELECTABLE_LAYOUTS:()=>fe,THEMES:()=>ze,THEME_BY_KEY:()=>W,applyTheme:()=>be,attachLegacyPlayer:()=>tt,attachPlayer:()=>ae,bootFromScriptTag:()=>On,canConvert:()=>V,convert:()=>ee,deckCss:()=>se,diffDeck:()=>Pe,mountDeck:()=>Ce,normalizeDeck:()=>O,renderSections:()=>Ne,renderSlide:()=>oe,renderStage:()=>le,themeCss:()=>ge,toStandaloneHtml:()=>_e});var Te={w:1280,h:720};function O(e){let t=(e.slides||[]).map((i,r)=>({...i,id:i.id||`s${r}`})),n=new Set;for(let i of t){for(;n.has(i.id);)i.id=`${i.id}_`;n.add(i.id)}return{...e,version:1,theme:e.theme||"navy-gold",transition:e.transition||"fade",size:e.size||{...Te},assets:e.assets||{},slides:t}}function u(e){return String(e??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#x27;")}function Se(e){return u(e).replace(/&lt;(\/?)(b|i|sup|sub)&gt;/g,"<$1$2>")}function ie(e){return String(e||"").replace(/^\s*(B[ưu][ớo]c|Giai đoạn|Stage|Step)\s*\d+\s*[:.\-–]?\s*/,"").trim()}function Q(e){return String(e).padStart(2,"0")}var A=e=>(e||[]).map(t=>String(t??"")).filter(t=>t.trim());function Me(e){let t=String(e||""),n=[["\\Leftrightarrow","\u21D4"],["\\Rightarrow","\u21D2"],["\\mathbb{R}","\u211D"],["\\forall","\u2200"],["\\exists","\u2203"],["\\infty","\u221E"],["\\left",""],["\\right",""],["\\times","\xD7"],["\\cdot","\xB7"],["\\sqrt","\u221A"],["\\leq","\u2264"],["\\geq","\u2265"],["\\neq","\u2260"],["\\le","\u2264"],["\\ge","\u2265"],["\\ne","\u2260"],["\\to","\u2192"],["\\in","\u2208"],["\\vartheta","\u03D1"],["\\varphi","\u03C6"],["\\varepsilon","\u03B5"],["\\Delta","\u0394"],["\\Gamma","\u0393"],["\\Lambda","\u039B"],["\\Omega","\u03A9"],["\\Sigma","\u03A3"],["\\Theta","\u0398"],["\\Phi","\u03A6"],["\\Psi","\u03A8"],["\\Pi","\u03A0"],["\\alpha","\u03B1"],["\\beta","\u03B2"],["\\gamma","\u03B3"],["\\delta","\u03B4"],["\\epsilon","\u03B5"],["\\zeta","\u03B6"],["\\eta","\u03B7"],["\\theta","\u03B8"],["\\iota","\u03B9"],["\\kappa","\u03BA"],["\\lambda","\u03BB"],["\\mu","\u03BC"],["\\nu","\u03BD"],["\\xi","\u03BE"],["\\rho","\u03C1"],["\\sigma","\u03C3"],["\\tau","\u03C4"],["\\upsilon","\u03C5"],["\\phi","\u03C6"],["\\chi","\u03C7"],["\\psi","\u03C8"],["\\omega","\u03C9"],["\\pi","\u03C0"]];for(let[i,r]of n)t=t.split(i).join(r);t=t.replace(/_\{([^{}]*)\}/g,"$1").replace(/\^\{([^{}]*)\}/g,"^$1"),t=t.replace(/\\text\{([^{}]*)\}/g,"$1");for(let i=0;i<3;i++){let r=t.replace(/\\[dt]?frac\s*\{([^{}]*)\}\s*\{([^{}]*)\}/g,"($1)/($2)");if(r===t)break;t=r}return t=t.replace(/\\begin\{[a-z]*\}(\{[^{}]*\})?/gi,"").replace(/\\end\{[a-z]*\}/gi,""),t=t.replace(/\\\\/g," ; "),t=t.replace(/\\[a-zA-Z]+/g,""),t=t.replace(/\\([{}[\]|,;!\s])/g,"$1").replace(/\\+/g,""),t.replace(/[{}$]/g,"").replace(/\s+/g," ").trim()}function k(e,t){return e?.edit?` contenteditable="true" data-e="${e.idx??0}.${t}"`:""}function Z(e,t){return t&&e.assets?.[t]||""}function q(e,t,n="bullets"){let i=A(e);if(!t?.edit)return`<ul class="bul">${i.map(l=>`<li>${Se(l)}</li>`).join("")}</ul>`;let r=t.idx??0,o=i.map((l,s)=>`<li><span contenteditable="true" data-e="${r}.${n}.${s}">${Se(l)}</span><button class="edx" title="Xo\xE1 \xFD">\xD7</button></li>`).join("");return`<ul class="bul" data-base="${r}.${n}">${o}</ul><button class="edadd" data-base="${r}.${n}">+ \xFD</button>`}var ue=e=>u(e.kicker||""),X=(e,t="")=>`<div class="pgno"${t}>${e.page??""}/${e.total??""}</div>`;function E(e,t){return`<div class="hd"><div class="kick">${ue(t)}</div><div class="ttl"${k(t,"title")}>${u(e.title)}</div></div><div class="rule"></div><div class="foot">${u(t.foot||"")}</div>`+X(t)}var Bt=e=>e>=5?3:e>=2?2:1,pe=["var(--sl-blue)","var(--sl-gold)","var(--sl-green)","var(--sl-navy)"],Ae=["var(--sl-blue)","var(--sl-gold)","var(--sl-green)"],Dt=["var(--sl-blue)","var(--sl-navy)","var(--sl-gold)","var(--sl-green)"],Ke=["#2B4182","#2563EB","#0E9F6E","#7C3AED","#B45309"],re=(e,t)=>(e.columns||[]).filter(n=>String(n?.title||"").trim()).slice(0,t),he=(e,t)=>(e.columns||[]).filter(n=>n?.title||(n?.bullets||[]).length).slice(0,t),R=(e,t)=>{let n=Z(t,e.image?.asset);if(n){let i=e.image?.title?`<div class="fcap"${k(t,"image.title")}>${u(e.image.title)}</div>`:"";return E(e,t)+`<div class="body"><div class="two"><div>${q(e.bullets,t)}</div><div class="fig"><img src="${n}">${i}</div></div></div>`}return E(e,t)+`<div class="body">${q(e.bullets,t)}</div>`},zt=(e,t)=>E(e,t)+`<div class="body">${q(e.bullets,t)}</div>`,Nt=(e,t)=>{let n=A(e.bullets).slice(0,6),i=n.map((r,o)=>`<div><div class="card-n">${Q(o+1)}</div><div class="bar"></div><div class="card-t"${k(t,`bullets.${o}`)}>${u(r)}</div></div>`).join("");return E(e,t)+`<div class="body"><div class="grid" style="grid-template-columns:repeat(${Bt(n.length)},1fr)">${i}</div></div>`},Ge=(e,t)=>{let n=he(e,3);if(n.length<2){let r=A(e.bullets).slice(0,3).map(o=>({title:"",bullets:[o]}));r.length&&(n=r)}let i=n.map((r,o)=>{let l=Ae[o%3],s=r.title?`<div class="ch"${k(t,`columns.${o}.title`)}>${u(r.title)}</div>`:"";return`<div class="col"><div class="top" style="background:${l}"></div><div class="cn" style="color:${l}">${Q(o+1)}</div>${s}`+q(r.bullets,t,`columns.${o}.bullets`)+"</div>"}).join("");return E(e,t)+`<div class="body"><div class="cols" style="grid-template-columns:repeat(${n.length},1fr)">${i}</div></div>`},qt=(e,t)=>{let n=re(e,4);if(n.length<2)return R(e,t);let i=n.map((r,o)=>`<div class="metric"><div class="top"></div><div class="val"${k(t,`columns.${o}.title`)}>${u(r.title)}</div><div class="lab"${k(t,`columns.${o}.bullets.0`)}>${u((r.bullets||[""])[0])}</div></div>`).join("");return E(e,t)+`<div class="body"><div class="mrow" style="grid-template-columns:repeat(${n.length},1fr)">${i}</div></div>`},Ft=(e,t)=>{let i=A(e.bullets).slice(0,5).map((r,o)=>{let l=r.replace(/^\s*(B[ưu][ớo]c|Giai đoạn|Bước)\s*\d+\s*[:.]?\s*/,"").trim();return`<div class="node ${o%2===0?"above":"below"}"><div class="dot">${o+1}</div><div class="lab"${k(t,`bullets.${o}`)}>${u(l)}</div></div>`}).join("");return E(e,t)+`<div class="body"><div class="tl"><div class="line"></div>${i}</div></div>`},It=(e,t)=>{let n=A(e.bullets).slice(0,6).map((i,r)=>`<div class="it"><div class="n">${Q(r+1)}</div><div class="t"${k(t,`bullets.${r}`)}>${u(i)}</div></div>`).join("");return E(e,t)+`<div class="body"><div class="toc">${n}</div></div>`},He=e=>(t,n)=>E(t,n)+`<div class="acard lft" style="--sl-accent:${e}">${q(t.bullets,n)}</div>`,Rt=(e,t)=>{let n=e.formulaImage?.startsWith("data:")?e.formulaImage:Z(t,e.formulaImage),i=String(e.formula||""),r=/\\[a-zA-Z]{2,}|\{|\}/.test(i),o=n?`<img src="${n}">`:`<div class="ftx${r?" ftx-tex":""}">${u(r?Me(i):i)}</div>`,l=e.caption?`<div class="fcp2"${k(t,"caption")}>${u(e.caption)}</div>`:"";return E(e,t)+`<div class="fbox">${o}</div>${l}`},jt=(e,t)=>{let n=Z(t,e.image?.asset),i=e.caption?`<div class="fcap" style="position:absolute;left:64px;right:64px;bottom:38px"${k(t,"caption")}>${u(e.caption)}</div>`:"";return E(e,t)+`<div class="bigfig">${n?`<img src="${n}">`:""}</div>${i}`},Pt=(e,t)=>{let n=e.title||A(e.bullets)[0]||"",i=e.subtitle?`<div class="sub"${k(t,"subtitle")}>${u(e.subtitle)}</div>`:"";return`<div class="k">${ue(t)}</div><div class="msg"${k(t,"title")}>${u(n)}</div>${i}`+X(t)},_t=(e,t)=>{let n=e.title||A(e.bullets)[0]||"",i=e.subtitle?`<div class="qby"${k(t,"subtitle")}>\u2014 ${u(e.subtitle)}</div>`:"";return`<div class="rail"></div><div class="qmark">&ldquo;</div><div class="qmsg"${k(t,"title")}>${u(n)}</div>${i}`+X(t,' style="color:var(--sl-blue-border)"')},Ot=(e,t)=>{let n=e.subtitle?`<div class="sec-sub"${k(t,"subtitle")}>${u(e.subtitle)}</div>`:"";return`<div class="rail"></div><div class="sec-tag">${ue(t)}</div><div class="sec-ttl"${k(t,"title")}>${u(e.title)}</div>${n}`+X(t,' style="color:var(--sl-blue-border)"')},Gt=(e,t)=>{let n=(e.table||[]).map((i,r)=>{let o=r===0?"th":"td";return"<tr>"+i.map((l,s)=>`<${o}${k(t,`table.${r}.${s}`)}>${u(l)}</${o}>`).join("")+"</tr>"}).join("");return E(e,t)+`<div class="body"><table class="dtbl">${n}</table></div>`},Ut=(e,t)=>E(e,t)+`<div class="acard" style="background:var(--sl-amber-bg);border:1px solid var(--sl-amber-bd)">${q(e.bullets,t)}</div>`,Wt=(e,t)=>{let n=e.question,i=(n?.options||[]).map((l,s)=>`<li${k(t,`question.options.${s}`)}>${u(l)}</li>`).join(""),r=`<div class="acard" style="top:130px;bottom:180px"><div style="font-size:24px;font-weight:700;line-height:1.35"${k(t,"question.stem")}>${u(n?.stem)}</div>`+(i?`<ul class="bul" style="margin-top:18px">${i}</ul>`:"")+"</div>",o=e.notes?'<div style="position:absolute;left:64px;right:64px;bottom:74px;background:var(--sl-blue-tint);border-radius:12px;padding:14px 20px;font-size:16px;color:var(--sl-blue-deep)">\u0110\xE1p \xE1n \u1EDF ph\u1EA7n Ghi ch\xFA (Notes) \u2014 m\u1EDF Presenter View \u0111\u1EC3 xem.</div>':"";return E(e,t)+r+o},Kt=(e,t)=>{let n=A(e.bullets).slice(0,6).map((i,r)=>`<div class="stp"><div class="sn">${r+1}</div><div class="st"${k(t,`bullets.${r}`)}>${u(ie(i))}</div></div>`).join("");return E(e,t)+`<div class="body"><div class="steps">${n}</div></div>`},Vt=(e,t)=>{let n=re(e,3);if(!n.length)return R(e,t);let i=n.map((r,o)=>`<div class="bn"><div class="bnv" style="color:${Ae[o%3]}"${k(t,`columns.${o}.title`)}>${u(r.title)}</div><div class="bnl"${k(t,`columns.${o}.bullets.0`)}>${u((r.bullets||[""])[0])}</div></div>`).join("");return E(e,t)+`<div class="body"><div class="bnrow" style="grid-template-columns:repeat(${n.length},1fr)">${i}</div></div>`},Zt=(e,t)=>{let n=A(e.bullets).slice(0,5),i=Math.max(1,n.length),r=n.map((o,l)=>{let s=i>1?46+l*(52/(i-1)):74;return`<div class="pyr" style="width:${Math.round(s)}%;background:${Ke[l%5]}"${k(t,`bullets.${l}`)}>${u(o)}</div>`}).join("");return E(e,t)+`<div class="body"><div class="pyramid">${r}</div></div>`},Yt=(e,t)=>{let n=A(e.bullets).slice(0,5),i=Math.max(1,n.length),r=n.map((o,l)=>{let s=i>1?92-l*(52/(i-1)):74;return`<div class="fnl" style="width:${Math.round(s)}%;background:${Ke[l%5]}"${k(t,`bullets.${l}`)}>${u(o)}</div>`}).join("");return E(e,t)+`<div class="body"><div class="funnel">${r}</div></div>`},Jt=(e,t)=>{let n=A(e.bullets).slice(0,6).map((i,r)=>`<div class="ck"><span class="ckm">\u2713</span><div class="ckt"${k(t,`bullets.${r}`)}>${u(i)}</div></div>`).join("");return E(e,t)+`<div class="body"><div class="cklist">${n}</div></div>`},Xt=(e,t)=>{let n=re(e,4);if(n.length<2)return R(e,t);let i=n.map((r,o)=>`<div class="qd" style="border-top:5px solid ${pe[o%4]}"><div class="qdt" style="color:${pe[o%4]}"${k(t,`columns.${o}.title`)}>${u(r.title)}</div>`+q(r.bullets,t,`columns.${o}.bullets`)+"</div>").join("");return E(e,t)+`<div class="body"><div class="quad">${i}</div></div>`},Qt=(e,t)=>{let n=A(e.bullets).slice(0,4).map((i,r)=>`<div class="arw${r===0?" first":""}" style="background:${Dt[r%4]}"><div class="arwn">B\u01AF\u1EDAC ${r+1}</div><div class="arwt"${k(t,`bullets.${r}`)}>${u(ie(i))}</div></div>`).join("");return E(e,t)+`<div class="body"><div class="arrow">${n}</div></div>`},en=(e,t)=>{let n=e.subtitle?`<div class="hsub"${k(t,"subtitle")}>${u(e.subtitle)}</div>`:"";return`<div class="cover-in"><div class="hbar"></div><div class="hk">${ue(t)}</div><div class="hbig"${k(t,"title")}>${u(e.title)}</div>${n}</div>`+X(t)},tn=(e,t)=>{let n=(e.images||[]).filter(r=>Z(t,r.asset)).slice(0,4);if(!n.length)return R(e,t);let i=n.map((r,o)=>{let l=r.title?`<div class="gcap"${k(t,`images.${o}.title`)}>${u(r.title)}</div>`:"";return`<div class="gcell"><img src="${Z(t,r.asset)}">${l}</div>`}).join("");return E(e,t)+`<div class="body"><div class="gal" style="grid-template-columns:repeat(${n.length>1?2:1},1fr)">${i}</div></div>`},nn=(e,t)=>{let n=A(e.bullets).slice(0,5).map((i,r)=>`<div class="nrow"><div class="nbig">${Q(r+1)}</div><div class="ntxt"${k(t,`bullets.${r}`)}>${u(i)}</div></div>`).join("");return E(e,t)+`<div class="body"><div class="nlist">${n}</div></div>`},rn=(e,t)=>{let n=e.subtitle?`<div class="spl-sub"${k(t,"subtitle")}>${u(e.subtitle)}</div>`:"";return`<div class="split"><div class="spl-l"><div class="spl-t"${k(t,"title")}>${u(e.title)}</div>${n}</div><div class="spl-r">${q(e.bullets,t)}</div></div>`+X(t)},on=(e,t)=>{let n=re(e,4);if(n.length<2)return R(e,t);let i=n.map((r,o)=>{let l=(r.bullets||[""])[0],s=l?`<div class="ft-l"${k(t,`columns.${o}.bullets.0`)}>${u(l)}</div>`:"";return`<div class="ft"><div class="ft-ic" style="background:${pe[o%4]}">${o+1}</div><div class="ft-t"${k(t,`columns.${o}.title`)}>${u(r.title)}</div>${s}</div>`}).join("");return E(e,t)+`<div class="body"><div class="feat" style="grid-template-columns:repeat(${n.length},1fr)">${i}</div></div>`},ln=(e,t)=>{let n=he(e,2);if(n.length<2)return R(e,t);let i=[["#0E9F6E","\u2713"],["#C70036","\u2717"]],r=n.map((o,l)=>{let[s,p]=i[l];return`<div class="pc" style="border-top:5px solid ${s}"><div class="pc-h"><span class="pc-m" style="background:${s}">${p}</span><span style="color:${s}"${k(t,`columns.${l}.title`)}>${u(o.title)}</span></div>`+q(o.bullets,t,`columns.${l}.bullets`)+"</div>"}).join("");return E(e,t)+`<div class="body"><div class="pcwrap">${r}</div></div>`},sn=(e,t)=>E(e,t)+`<div class="body"><div class="spot"><div class="spot-ic">\u{1F4A1}</div><div class="spot-body">${q(e.bullets,t)}</div></div></div>`,an=(e,t)=>{let n=A(e.bullets).slice(0,5).map((i,r)=>`<div class="vt-item"><div class="vt-dot">${r+1}</div><div class="vt-txt"${k(t,`bullets.${r}`)}>${u(ie(i))}</div></div>`).join("");return E(e,t)+`<div class="body"><div class="vtl">${n}</div></div>`},dn=(e,t)=>A(e.bullets).length<3?R(e,t):E(e,t)+`<div class="body twocol">${q(e.bullets,t)}</div>`,cn=(e,t)=>{let n=he(e,2);if(n.length<2)return R(e,t);let i=n[0].bullets||[],r=n[1].bullets||[],o=`<tr><th${k(t,"columns.0.title")}>${u(n[0].title)}</th><th${k(t,"columns.1.title")}>${u(n[1].title)}</th></tr>`,l="";for(let s=0;s<Math.max(i.length,r.length);s++)l+=`<tr><td${k(t,`columns.0.bullets.${s}`)}>${u(i[s]??"")}</td><td${k(t,`columns.1.bullets.${s}`)}>${u(r[s]??"")}</td></tr>`;return E(e,t)+`<div class="body"><table class="cmptbl">${o}${l}</table></div>`},pn=(e,t)=>{let n=re(e,4);if(n.length<2)return R(e,t);let i=n.map((r,o)=>`<div class="kpi" style="--sl-accent:${pe[o%4]}"><div class="kpi-v"${k(t,`columns.${o}.title`)}>${u(r.title)}</div><div class="kpi-bar"></div><div class="kpi-l"${k(t,`columns.${o}.bullets.0`)}>${u((r.bullets||[""])[0])}</div></div>`).join("");return E(e,t)+`<div class="body"><div class="kpirow" style="grid-template-columns:repeat(${n.length},1fr)">${i}</div></div>`},Ue=e=>(t,n)=>{let i=t.image||(t.images||[])[0],r=Z(n,i?.asset);if(!r)return R(t,n);let o=i?.title?`<div class="fcap"${k(n,"image.title")}>${u(i.title)}</div>`:"",l=`<div class="fig"><img src="${r}">${o}</div>`,s=`<div>${q(t.bullets,n)}</div>`;return E(t,n)+`<div class="body"><div class="imgside ${e==="l"?"left":"right"}">`+(e==="l"?l+s:s+l)+"</div></div>"},un=(e,t)=>{let n=e.title||A(e.bullets)[0]||"",i=Z(t,(e.image||(e.images||[])[0])?.asset),r=i?`<img class="qav" src="${i}">`:"",o=e.subtitle?`<div class="qby"${k(t,"subtitle")}>${u(e.subtitle)}</div>`:"",l=e.caption?`<div class="qrole"${k(t,"caption")}>${u(e.caption)}</div>`:"";return`<div class="rail"></div><div class="qmark">&ldquo;</div><div class="qmsg"${k(t,"title")}>${u(n)}</div><div class="qauth">${r}<div>${o}${l}</div></div>`+X(t,' style="color:var(--sl-blue-border)"')},We=/^\s*>\s*/,hn=(e,t)=>{let n=A(e.bullets).slice(0,7),i=n.findIndex(o=>We.test(o));i<0&&(i=0);let r=n.map((o,l)=>{let s=l<i?"done":l===i?"now":"next",p=l<i?"\u2713":Q(l+1);return`<div class="ag-it ${s}"><div class="ag-n">${p}</div><div class="ag-t"${k(t,`bullets.${l}`)}>${u(o.replace(We,""))}</div></div>`}).join("");return E(e,t)+`<div class="body"><div class="agenda">${r}</div></div>`},gn=(e,t)=>{let n=he(e,3);if(n.length<2)return R(e,t);let i=n.map((r,o)=>`<div class="c3"><div class="c3-h" style="background:${Ae[o%3]}"${k(t,`columns.${o}.title`)}>${u(r.title)}</div><div class="c3-b">`+q(r.bullets,t,`columns.${o}.bullets`)+"</div></div>").join("");return E(e,t)+`<div class="body"><div class="c3row" style="grid-template-columns:repeat(${n.length},1fr)">${i}</div></div>`},bn=(e,t)=>E(e,t)+`<div class="body blankbody">${q(e.bullets,t)}</div>`,fn=(e,t)=>{let n=(e.table||[]).map(l=>l.map(s=>String(s??"")));if(!n.length)return R(e,t);let i=Math.max(...n.map(l=>l.length)),r=n.map((l,s)=>`<tr>${l.map((a,c)=>{let h=s===0?"th":"td",x=c===0?' class="tw-h"':"",v=c===l.length-1&&l.length<i?` colspan="${i-l.length+1}"`:"";return`<${h}${x}${v}${k(t,`table.${s}.${c}`)}>${u(a)}</${h}>`}).join("")}</tr>`).join(""),o=e.caption?`<div class="tw-cap"${k(t,"caption")}>${u(e.caption)}</div>`:"";return E(e,t)+`<div class="body twwrap"><table class="twtbl" style="--tw-n:${i}">${r}</table>${o}</div>`},mn=(e,t)=>{let n=A(e.bullets),i=n.reduce((s,p)=>s+p.length,0),r=i>700?"s":i>380?"m":"l",o=n.map((s,p)=>`<p class="dc-p"${k(t,`bullets.${p}`)}>${u(s)}</p>`).join(""),l=e.caption?`<div class="dc-src"${k(t,"caption")}>${u(e.caption)}</div>`:"";return E(e,t)+`<div class="body"><div class="defcard" data-sz="${r}">${o}${l}</div></div>`},kn=(e,t)=>{let n=e.formulaImage?.startsWith("data:")?e.formulaImage:Z(t,e.formulaImage),i=String(e.formula||""),r=/\\[a-zA-Z]{2,}|\{|\}/.test(i),o=n?`<img src="${n}">`:`<div class="fs-eq${r?" ftx-tex":""}">${u(r?Me(i):i)}</div>`,l=A(e.bullets).slice(0,5).map((s,p)=>`<li><span class="fs-n">${p+1}</span><span class="fs-t"${k(t,`bullets.${p}`)}>${u(ie(s))}</span></li>`).join("");return E(e,t)+`<div class="body fswrap"><div class="fsbox">${o}</div><ol class="fsteps">${l}</ol></div>`},Be={tablewide:fn,defcard:mn,formulasteps:kn,kpirow:pn,imageleft:Ue("l"),imageright:Ue("r"),quoteauthor:un,agenda:hn,compare3:gn,blank:bn,goals:zt,content:R,cards:Nt,three:Ge,metrics:qt,timeline:Ft,toc:It,steps:Kt,bignum:Vt,pyramid:Zt,funnel:Yt,checklist:Jt,quadrant:Xt,arrow:Qt,hero:en,gallery:tn,numbered:nn,split:rn,feature:on,proscons:ln,spotlight:sn,vtimeline:an,twocol:dn,comparetable:cn,define:He("var(--sl-navy)"),example:He("var(--sl-green)"),remember:He("var(--sl-gold)"),compare:Ge,formula:Rt,figure:jt,table:Gt,note:Ut,question:Wt,statement:Pt,quote:_t,section:Ot},De={statement:"hero dots",quote:"dk-dark",section:"dk-dark",hero:"cover",split:"split",quoteauthor:"dk-dark"};var ze=[{key:"navy-gold",label:"Navy \xB7 V\xE0ng",dark:!1,tokens:{font:'"Inter",-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif',bg:"radial-gradient(1200px 620px at 82% -12%,#eef3fd,#ffffff 62%)",bg2:"linear-gradient(160deg,#f6f8fc,#eef2fb)",ink:"#1C274C",navy:"#2B4182",navy2:"#0F2977",gold:"#FFB000",blue:"#2684FC","blue-pale":"#8FA9E8","blue-border":"#BEDBFF","blue-deep":"#1C398E","blue-tint":"#EEF6FF",green:"#0E9F6E",muted:"#6B7280",border:"#E6E9F0",card:"#ffffff",rail:"#2B4182",dot:"#C7D8Fb","amber-bg":"#FFF7E6","amber-bd":"#FFE2A8"}},{key:"blue-green",label:"Xanh l\u1EE5c h\u1ECDc thu\u1EADt",dark:!1,tokens:{font:'"Inter",-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif',bg:"radial-gradient(1200px 620px at 82% -12%,#e6f7f2,#ffffff 62%)",bg2:"linear-gradient(160deg,#eefaf6,#e3f3ee)",ink:"#0F2E29",navy:"#0B6E5A",navy2:"#064E45",gold:"#12B886",blue:"#0CA678","blue-pale":"#8FD3C2","blue-border":"#B2E5D8","blue-deep":"#0B5A48","blue-tint":"#E9F8F3",green:"#0B7285",muted:"#5C6B68",border:"#DCEDE8",card:"#ffffff",rail:"#0B6E5A",dot:"#BEE7DB","amber-bg":"#FFF4E6","amber-bd":"#FFDFB0"}},{key:"cream-editorial",label:"Kem c\u1ED5 \u0111i\u1EC3n",dark:!1,tokens:{font:'"Inter",-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif',bg:"radial-gradient(1200px 620px at 82% -12%,#f7f0e6,#FAF7F2 60%)",bg2:"linear-gradient(160deg,#faf6ef,#f3ece0)",ink:"#2A2118",navy:"#3A2E22",navy2:"#241C14",gold:"#C2410C",blue:"#B45309","blue-pale":"#D9BFA6","blue-border":"#EAD9C4","blue-deep":"#7C3A12","blue-tint":"#F6ECE0",green:"#4D7C0F",muted:"#7A6C5A",border:"#E7DCCB",card:"#FFFDF9",rail:"#3A2E22",dot:"#E3D2BC","amber-bg":"#FBF1E2","amber-bd":"#EAD3B4","font-display":'Georgia,"DejaVu Serif","Liberation Serif","Times New Roman",serif'}},{key:"dark-modern",label:"T\u1ED1i hi\u1EC7n \u0111\u1EA1i",dark:!0,tokens:{font:'"Inter",-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif',bg:"radial-gradient(1200px 700px at 78% -10%,#1b2440,#0f1526 62%)",bg2:"linear-gradient(160deg,#141b30,#0f1424)",ink:"#E6ECF7",navy:"#EAF0FF",navy2:"#0B1120",gold:"#FBBF24",blue:"#60A5FA","blue-pale":"#5A6B93","blue-border":"#324063","blue-deep":"#93C5FD","blue-tint":"#1B2540",green:"#34D399",muted:"#9AA6C0",border:"#28324f",card:"#161d33",rail:"#FBBF24",dot:"#33406a","amber-bg":"#2A2410","amber-bd":"#4A3F17"}},{key:"purple-tech",label:"T\xEDm c\xF4ng ngh\u1EC7",dark:!1,tokens:{font:'"Inter",-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif',bg:"radial-gradient(1100px 640px at 80% -12%,#efeafe,#ffffff 62%)",bg2:"linear-gradient(160deg,#f2eefe,#eae3fb)",ink:"#241C3A",navy:"#5B3FC4",navy2:"#3B2A86",gold:"#12B886",blue:"#7C5CFC","blue-pale":"#B9A6F2","blue-border":"#DCD0FB","blue-deep":"#4B32A8","blue-tint":"#F2EEFE",green:"#0CA678",muted:"#6B6480",border:"#E7E1F5",card:"#ffffff",rail:"#5B3FC4",dot:"#D8CBF7","amber-bg":"#F4EEFE","amber-bd":"#DCCFF7"}},{key:"black-gold",label:"\u0110en \xB7 V\xE0ng",dark:!0,tokens:{font:'"Inter",-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif',bg:"radial-gradient(1200px 700px at 78% -10%,#242017,#141109 64%)",bg2:"linear-gradient(160deg,#1c1810,#12100a)",ink:"#F3ECD8",navy:"#F7E7B0",navy2:"#0E0C07",gold:"#E7B008",blue:"#8AB4D8","blue-pale":"#7A6A3E","blue-border":"#4A3F1E","blue-deep":"#F1D579","blue-tint":"#241E10",green:"#C9A227",muted:"#B6A882",border:"#3A3117",card:"#1c1810",rail:"#E7B008",dot:"#4A3F1E","amber-bg":"#241E10","amber-bd":"#4A3F1E"}},{key:"deep-blue",label:"Xanh bi\u1EC3n t\u1EA1p ch\xED",dark:!0,tokens:{font:'"Inter",-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif',bg:"radial-gradient(1200px 720px at 78% -10%,#122a63,#0a1738 64%)",bg2:"linear-gradient(160deg,#0f2352,#0a1838)",ink:"#E8EEFB",navy:"#EAF1FF",navy2:"#081026",gold:"#54C7EC",blue:"#5B9DF9","blue-pale":"#5C74A8","blue-border":"#2C3E6E","blue-deep":"#A7C6FF","blue-tint":"#14264f",green:"#3DD7C0",muted:"#9FB0D4",border:"#243761",card:"#122a5c",rail:"#54C7EC",dot:"#2C3E6E","amber-bg":"#242010","amber-bd":"#4A3F1E","font-display":'Georgia,"DejaVu Serif","Liberation Serif","Times New Roman",serif'}},{key:"light-neu",label:"Xanh nh\u1EB9",dark:!1,tokens:{font:'"Inter",-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif',bg:"radial-gradient(1200px 620px at 82% -12%,#eef1f7,#f7f9fc 62%)",bg2:"linear-gradient(160deg,#f2f5fa,#e9edf5)",ink:"#28304A",navy:"#3A4A72",navy2:"#222A44",gold:"#E0A800",blue:"#5B8DEF","blue-pale":"#A9C0F0","blue-border":"#CDD9F2","blue-deep":"#3A5FB0","blue-tint":"#EEF3FD",green:"#46B083",muted:"#6B7488",border:"#E3E8F2",card:"#ffffff",rail:"#5B8DEF",dot:"#CDD9F2","amber-bg":"#EEF3FD","amber-bd":"#CDD9F2"}},{key:"coral-warm",label:"Cam san h\xF4",dark:!1,tokens:{font:'"Inter",-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif',bg:"radial-gradient(1200px 620px at 82% -12%,#fdeee9,#fffaf8 62%)",bg2:"linear-gradient(160deg,#fdf0ec,#f9e6df)",ink:"#3A241F",navy:"#7A3B2E",navy2:"#3A1C15",gold:"#E8503A",blue:"#2E8B8B","blue-pale":"#F0A99B","blue-border":"#F5D3CA","blue-deep":"#B83A28","blue-tint":"#FDEFEB",green:"#46B083",muted:"#7A6A63",border:"#F0E2DB",card:"#FFFDFB",rail:"#E8503A",dot:"#F5D3CA","amber-bg":"#FDEFEB","amber-bd":"#F5D3CA"}},{key:"emerald-fresh",label:"Ng\u1ECDc l\u1EE5c b\u1EA3o",dark:!1,tokens:{font:'"Inter",-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif',bg:"radial-gradient(1200px 620px at 82% -12%,#e6f6f0,#f7fdfb 62%)",bg2:"linear-gradient(160deg,#eefaf5,#e3f4ee)",ink:"#173A30",navy:"#0F6E52",navy2:"#0A4A38",gold:"#12B886",blue:"#0CA678","blue-pale":"#8FD3C0","blue-border":"#B8E6D8","blue-deep":"#0B7A5C","blue-tint":"#E9F8F2",green:"#0B8F6E",muted:"#5C6B64",border:"#DCEEE7",card:"#ffffff",rail:"#12B886",dot:"#BFE6DA","amber-bg":"#EEF9F4","amber-bd":"#BFE6DA"}},{key:"slate-pro",label:"X\xE1m th\xE9p",dark:!1,tokens:{font:'"Inter",-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif',bg:"radial-gradient(1200px 620px at 82% -12%,#eef1f5,#f8fafc 62%)",bg2:"linear-gradient(160deg,#eef1f6,#e4e9f0)",ink:"#1F2937",navy:"#334155",navy2:"#1E293B",gold:"#D97706",blue:"#0EA5E9","blue-pale":"#93C5E8","blue-border":"#CBD8E6","blue-deep":"#0369A1","blue-tint":"#EEF6FC",green:"#059669",muted:"#64748B",border:"#E2E8F0",card:"#ffffff",rail:"#334155",dot:"#CBD8E6","amber-bg":"#FEF6E6","amber-bd":"#F5E2B8"}},{key:"rose-elegant",label:"H\u1ED3ng thanh l\u1ECBch",dark:!1,tokens:{font:'"Inter",-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif',bg:"radial-gradient(1200px 620px at 82% -12%,#fbecf3,#fffafd 62%)",bg2:"linear-gradient(160deg,#faedf3,#f4e0ea)",ink:"#3A1F2E",navy:"#7A2E56",navy2:"#4A1C34",gold:"#E0518A",blue:"#C2185B","blue-pale":"#EAA3C2","blue-border":"#F2CFDF","blue-deep":"#A01050","blue-tint":"#FBEEF4",green:"#0E9F6E",muted:"#7A6470",border:"#F0DCE6",card:"#ffffff",rail:"#C2185B",dot:"#F2CFDF","amber-bg":"#FBEEF4","amber-bd":"#F2CFDF"}}],W=Object.fromEntries(ze.map(e=>[e.key,e])),Y="navy-gold";function ge(e,t=":root"){let n=W[e]||W[Y],i=Object.entries(n.tokens).map(([r,o])=>`--sl-${r}:${o}`).join(";");return`${t}{${i}}`}function be(e,t){let n=W[t]||W[Y];for(let[i,r]of Object.entries(n.tokens))e.style.setProperty(`--sl-${i}`,r);e.dataset.theme=n.key,e.dataset.dark=n.dark?"1":"0"}var Ve=`/* \u2550\u2550 PH\u1EA0M VI \u2014 deck-kit d\xF9ng CHUNG document v\u1EDBi app, n\xEAn KH\xD4NG \u0111\u01B0\u1EE3c khai selector tr\u1EA7n \u2550\u2550\u2550
   \u0110\xE3 \u0111o trong tr\xECnh duy\u1EC7t th\u1EADt: b\u1EA3n c\u0169 gi\u1EBFt scroll to\xE0n trang app, \u0111\u1ED5i m\xE0u m\u1ECDi <b> c\u1EE7a app,
   v\xE0 ghi n\u1EC1n t\u1ED1i l\xEAn <body>. Nguy\xEAn nh\xE2n: \`html,body{}\` + \`*{}\` l\xE0 selector TR\u1EA6N.
   \`@layer\` KH\xD4NG c\u1EE9u \u0111\u01B0\u1EE3c \u2014 layer khai sau lu\xF4n th\u1EAFng, m\xE0 layer c\u1EE7a deck-kit sinh l\xFAc mount
   n\xEAn lu\xF4n \u0111\u1EE9ng cu\u1ED1i. Ch\u1EC9 c\xF3 PH\u1EA0M VI m\u1EDBi ch\u1EB7n \u0111\u01B0\u1EE3c.
   \`.dk-root\` l\xE0 khung deck (mount.ts t\u1EF1 g\u1EAFn). Trang deck \u0110\u1ED8C L\u1EACP t\u1EF1 khai html,body ri\xEAng
   (deck_shell.py) n\xEAn kh\xF4ng m\u1EA5t g\xEC. */
.dk-root,.dk-root *{margin:0;padding:0;box-sizing:border-box}
.dk-root{position:relative;height:100%;overflow:hidden;font-family:var(--sl-font);
 background:radial-gradient(1100px 650px at 50% 26%,#2b303c,#12141b 80%);
 /* H\u1EC7 s\u1ED1 c\u1EE1 ch\u1EEF to\xE0n deck \u2014 GV ch\u1EC9nh \u1EDF menu Hi\u1EC3n th\u1ECB. 1 = nh\u01B0 thi\u1EBFt k\u1EBF g\u1ED1c.
    Nh\xE2n v\xE0o T\u1EEANG khai b\xE1o \`font-size\` ch\u1EE9 KH\xD4NG d\xF9ng \`transform:scale\`/\`zoom\`:
    \`deck_to_pptx\` \u0111\u1ECDc \`getBoundingClientRect()\` \u0111\u1EC3 \u0111\u1EB7t textbox v\xE0 \`getComputedStyle().fontSize\`
    \u0111\u1EC3 l\u1EA5y c\u1EE1 ch\u1EEF \u2014 transform l\xE0m hai th\u1EE9 \u0111\xF3 l\u1EC7ch nhau \u21D2 .pptx \u0111\u1EB7t ch\u1EEF sai ch\u1ED7.
    Nh\xE2n th\u1EB3ng th\xEC .pptx t\u1EF1 kh\u1EDBp, kh\xF4ng ph\u1EA3i s\u1EEDa m\u1ED9t d\xF2ng Python n\xE0o. */
 --dk-fs:1}
.stage{position:absolute;inset:0;display:flex;align-items:center;justify-content:center}
/* flex:none \u2014 KH\xD4NG cho flex co khung 1280\xD7720 khi panel h\u1EB9p (bug m\xE9o slide th\xE0nh g\u1EA7n vu\xF4ng);
   fit() s\u1EBD scale \u0111\u1ED3ng \u0111\u1EC1u n\xEAn slide lu\xF4n gi\u1EEF 16:9. */
.scaler{position:relative;transform-origin:center center;flex:none}
#scaler>.slide{position:absolute;inset:0;display:none;overflow:hidden;border-radius:14px;
 box-shadow:0 30px 80px rgba(0,0,0,.55),0 3px 12px rgba(0,0,0,.4);
 background:var(--sl-bg);color:var(--sl-ink);font-family:var(--sl-font)}
#scaler>.slide.active{display:block;animation:sf .32s ease}
@keyframes sf{from{opacity:0;transform:scale(.99)}to{opacity:1;transform:none}}
/* Hi\u1EC7u \u1EE9ng chuy\u1EC3n slide (data-tr tr\xEAn #scaler) \u2014 fade l\xE0 m\u1EB7c \u0111\u1ECBnh (sf) */
#scaler[data-tr="none"]>.slide.active{animation:none}
#scaler[data-tr="slide"]>.slide.active{animation:trSlide .38s cubic-bezier(.22,.61,.36,1)}
@keyframes trSlide{from{opacity:0;transform:translateX(48px)}to{opacity:1;transform:none}}
#scaler[data-tr="slideup"]>.slide.active{animation:trUp .38s cubic-bezier(.22,.61,.36,1)}
@keyframes trUp{from{opacity:0;transform:translateY(44px)}to{opacity:1;transform:none}}
#scaler[data-tr="zoom"]>.slide.active{animation:trZoom .34s ease}
@keyframes trZoom{from{opacity:0;transform:scale(.9)}to{opacity:1;transform:none}}
#scaler[data-tr="flip"]>.slide.active{animation:trFlip .5s ease}
@keyframes trFlip{from{opacity:0;transform:perspective(1200px) rotateY(30deg)}to{opacity:1;transform:none}}

/* \u2550\u2550 THANG THI\u1EBET K\u1EBE cho SLIDE \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550
   Tr\u01B0\u1EDBc \u0111\xE2y 9 gi\xE1 tr\u1ECB box-shadow m\u1ED9t-l\u1EA7n v\xE0 8 b\xE1n k\xEDnh, g\xE1n ng\u1EABu nhi\xEAn: hai th\u1EBB c\u1EA1nh nhau
   trong c\xF9ng m\u1ED9t deck c\xF3 \u0111\u1ED9 n\u1ED5i kh\xE1c nhau m\xE0 kh\xF4ng v\xEC l\xFD do g\xEC \u2014 nh\xECn ra ngay l\xE0 c\u1EA9u th\u1EA3 d\xF9
   kh\xF4ng gi\xE1 tr\u1ECB n\xE0o sai.

   C\u1ED0 \xDD t\xE1ch kh\u1ECFi \`--dk-*\` trong \`tokens.css\` (thang c\u1EE7a khung TR\xCCNH S\u1EECA): g\u1ED9p hai h\u1EC7 l\u1EA1i l\xE0
   bu\u1ED9c giao di\u1EC7n slide ph\u1EA3i \u0111\u1ED5i theo giao di\u1EC7n tr\xECnh s\u1EEDa. */
/* \`--pad\` l\u1EA5y t\u1EEB \`.dk-root\` n\u1EBFu c\xF3 (menu Hi\u1EC3n th\u1ECB \u0111\u1EB7t), kh\xF4ng th\xEC 64px g\u1ED1c.
   KH\xD4NG khai th\u1EB3ng \`--pad:64px\` \u1EDF \u0111\xE2y: bi\u1EBFn khai tr\xEAn ph\u1EA7n t\u1EED con lu\xF4n th\u1EAFng bi\u1EBFn k\u1EBF th\u1EEBa,
   n\xEAn m\u1EADt \u0111\u1ED9 ch\u1ECDn \u1EDF khung deck s\u1EBD v\xF4 t\xE1c d\u1EE5ng \u2014 \u0111\xFAng c\xE1i b\u1EABy \u0111\xE3 d\xEDnh \u1EDF \`.spl-r\`. */
.slide{--pad:var(--dk-pad,64px);
 --sl-sh-sm:0 8px 24px rgba(20,30,70,.07);      /* th\u1EBB nh\u1ECF, danh s\xE1ch */
 --sl-sh-md:0 12px 34px rgba(20,30,70,.10);     /* th\u1EBB n\u1ED9i dung ch\xEDnh */
 --sl-sh-lg:0 16px 44px rgba(20,30,70,.10);     /* kh\u1ED1i nh\u1EA5n, th\u1EBB s\u1ED1 */
 --sl-r-sm:14px; --sl-r-md:18px; --sl-r-lg:22px}
.slide.chrome::before{content:"";position:absolute;left:0;top:0;bottom:0;width:8px;background:var(--sl-rail)}
.slide.dots::after{content:"";position:absolute;right:56px;bottom:52px;width:150px;height:118px;
 background-image:radial-gradient(circle,var(--sl-dot) 2px,transparent 2px);background-size:20px 20px;opacity:.7}

.hd{position:absolute;left:var(--pad);top:44px;right:var(--pad)}
.kick{font-size:calc(15px * var(--dk-fs,1));font-weight:800;letter-spacing:.14em;text-transform:uppercase;color:var(--sl-gold)}
/* \`--sl-font-display\` ch\u1EC9 c\xF3 \u1EDF theme "t\u1EA1p ch\xED"/"c\u1ED5 \u0111i\u1EC3n"; theme kh\xE1c kh\xF4ng khai th\xEC
   \`var(\u2026, var(--sl-font))\` t\u1EF1 v\u1EC1 font th\xE2n \u2014 kh\xF4ng c\u1EA7n khai l\u1EA1i \u1EDF 10 theme c\xF2n l\u1EA1i.
   CH\u1EC8 \xE1p cho TI\xCAU \u0110\u1EC0: ch\u1EEF th\xE2n gi\u1EEF sans \u0111\u1EC3 \u0111\u1ECDc r\xF5 tr\xEAn m\xE1y chi\u1EBFu. */
.ttl{font-family:var(--sl-font-display,var(--sl-font));
 font-size:calc(var(--ttl-size,38px) * var(--dk-fs,1));font-weight:800;color:var(--sl-navy);line-height:1.08;margin-top:6px;letter-spacing:-.01em;
 display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:3;overflow:hidden}
/* Ti\xEAu \u0111\u1EC1 d\xE0i ph\u1EA3i \u0111\u01B0\u1EE3c CH\u1EEAA CH\u1ED6, kh\xF4ng th\xEC n\xF3 \u0111\xE8 l\xEAn n\u1ED9i dung (l\u1ED7i th\u1EA5y r\xF5 \u1EDF table/question/cards).
   B\u1EADc t\xEDnh theo s\u1ED1 k\xFD t\u1EF1 \u2014 c\u1EA3 renderer Python l\u1EABn TS \u0111\u1EC1u suy ra \u0111\u01B0\u1EE3c, kh\xF4ng c\u1EA7n \u0111o b\u1EB1ng JS. */
.slide[data-tt="2"]{--ttl-size:33px;--rule-y:158px}
.slide[data-tt="3"]{--ttl-size:28px;--rule-y:190px}
.rule{position:absolute;left:var(--pad);top:var(--rule-y,120px);height:2px;width:calc(100% - 2*var(--pad));background:var(--sl-border)}
.rule::before{content:"";position:absolute;left:0;top:-1px;width:96px;height:4px;background:var(--sl-gold)}
.pgno{position:absolute;right:var(--pad);bottom:30px;font-size:calc(13px * var(--dk-fs,1));color:var(--sl-muted);font-variant-numeric:tabular-nums}
.foot{position:absolute;left:var(--pad);bottom:30px;font-size:calc(12px * var(--dk-fs,1));color:var(--sl-muted);max-width:70%;
 white-space:nowrap;overflow:hidden;text-overflow:ellipsis}

/* \`overflow:hidden\` l\xE0 CH\u1ED0T CH\u1EB6N cu\u1ED1i: n\u1ED9i dung qu\xE1 d\xE0i th\xEC b\u1ECB c\u1EAFt g\u1ECDn trong khung slide,
   KH\xD4NG \u0111\u01B0\u1EE3c tr\xE0n \u0111\xE8 l\xEAn ch\xE2n trang/s\u1ED1 trang hay l\xF2i ra ngo\xE0i m\xE9p (l\u1ED7i n\xE0y \u1EA3nh ch\u1EE5p so-pixel
   kh\xF4ng b\u1EAFt \u0111\u01B0\u1EE3c v\xEC c\u1EA3 hai renderer c\xF9ng tr\xE0n gi\u1ED1ng nhau). C\xE1c b\u1EADc \`--bul-size\`/\`--tt\` b\xEAn
   d\u01B0\u1EDBi lo ph\u1EA7n thu nh\u1ECF cho v\u1EEBa; \u0111\xE2y ch\u1EC9 ch\u1EB7n tr\u01B0\u1EDDng h\u1EE3p thu h\u1EBFt c\u1EE1 v\u1EABn d\xE0i. */
.body{position:absolute;left:var(--pad);top:calc(var(--rule-y,120px) + 32px);right:var(--pad);bottom:80px;
 overflow:hidden}
ul.bul{list-style:none}
ul.bul li{position:relative;padding-left:30px;font-size:calc(var(--bul-size,26px) * var(--dk-fs,1));line-height:1.4;color:var(--sl-ink);margin:var(--bul-gap,14px) 0}
ul.bul li::before{content:"";position:absolute;left:2px;top:.62em;width:9px;height:9px;border-radius:50%;background:var(--sl-blue)}
/* Nhi\u1EC1u \xFD th\xEC thu nh\u1ECF d\u1EA7n cho v\u1EEBa khung \u2014 tr\u01B0\u1EDBc \u0111\xE2y \xFD th\u1EE9 7\u20138 tr\xE0n xu\u1ED1ng \u0111\xE8 ch\xE2n trang.
   \`data-nb\` \u0111\xE3 c\xF3 s\u1EB5n tr\xEAn m\u1ED7i <section> n\xEAn kh\xF4ng ph\u1EA3i \u0111\u1ED5i renderer. */
.slide[data-nb="6"]{--bul-size:23px;--bul-gap:11px}
.slide[data-nb="7"]{--bul-size:21px;--bul-gap:9px}
.slide[data-nb="8"]{--bul-size:20px;--bul-gap:8px}
.slide[data-nb="9"],.slide[data-nb="10"],.slide[data-nb="11"],.slide[data-nb="12"]{--bul-size:19px;--bul-gap:6px}
/* split c\xF3 n\u1EEDa slide b\xEAn ph\u1EA3i r\u1ED9ng r\xE3i h\u01A1n n\xEAn ch\u1EEF to h\u01A1n m\u1EB7c \u0111\u1ECBnh \u2014 nh\u01B0ng CH\u1EC8 khi \xEDt \xFD;
   t\u1EEB 6 \xFD tr\u1EDF l\xEAn n\xF3 theo thang chung \u1EDF tr\xEAn \u0111\u1EC3 kh\xF4ng tr\xE0n. */
.split{--bul-size:22px}
.slide[data-nb="6"] .split,.slide[data-nb="7"] .split,.slide[data-nb="8"] .split,
.slide[data-nb="9"] .split,.slide[data-nb="10"] .split,
.slide[data-nb="11"] .split,.slide[data-nb="12"] .split{--bul-size:inherit}
.slide b,.slide strong{color:var(--sl-navy);font-weight:800}

/* table: b\u1EA3ng d\u1EEF li\u1EC7u nguy\xEAn v\u0103n t\u1EEB gi\xE1o \xE1n. Tr\u01B0\u1EDBc \u0111\xE2y KH\xD4NG c\xF3 CSS n\xE0o \u2192 b\u1EA3ng co d\xFAm \u1EDF g\xF3c. */
.dtbl{width:100%;border-collapse:collapse;font-size:calc(20px * var(--dk-fs,1));table-layout:fixed}
.dtbl th,.dtbl td{border:1px solid var(--sl-border);padding:12px 16px;text-align:left;color:var(--sl-ink);
 vertical-align:top;overflow-wrap:anywhere}
.dtbl th{background:var(--sl-navy);color:#fff;font-weight:800;font-size:calc(21px * var(--dk-fs,1))}
.dtbl tr:nth-child(even) td{background:var(--sl-bg2)}

/* content 2 c\u1ED9t (ch\u1EEF + \u1EA3nh) */
.two{display:grid;grid-template-columns:1fr 460px;gap:40px;height:100%}
.two .fig{align-self:center;background:var(--sl-card);border:1px solid var(--sl-border);border-radius:18px;
 padding:16px;box-shadow:var(--sl-sh-md)}
.two .fig img{width:100%;height:auto;display:block;border-radius:10px}
.fcap{margin-top:10px;font-size:calc(15px * var(--dk-fs,1));color:var(--sl-muted);text-align:center;font-style:italic}

/* cards: l\u01B0\u1EDBi th\u1EBB s\u1ED1 l\u1EDBn */
.grid{display:grid;gap:26px 30px;height:100%}
.card-n{font-size:calc(46px * var(--dk-fs,1));font-weight:800;color:var(--sl-blue-pale);line-height:1}
.card-n+.bar{width:96px;height:4px;background:var(--sl-gold);margin:10px 0 12px}
.card-t{font-size:calc(22px * var(--dk-fs,1));line-height:1.32;color:var(--sl-ink)}

/* three: 3 th\u1EBB */
.cols{display:grid;gap:24px;height:100%}
.col{background:var(--sl-card);border:1px solid var(--sl-border);border-radius:18px;padding:26px 24px;
 box-shadow:var(--sl-sh-md);position:relative;overflow:hidden}
.col .top{position:absolute;left:0;top:0;right:0;height:8px}
.col .cn{font-size:calc(30px * var(--dk-fs,1));font-weight:800;margin-top:8px}
.col .ch{font-size:calc(22px * var(--dk-fs,1));font-weight:800;color:var(--sl-navy);margin:8px 0 14px}
.col ul.bul li{font-size:calc(21px * var(--dk-fs,1));margin:11px 0}

/* metrics: th\u1EBB s\u1ED1 */
.mrow{display:grid;gap:24px;align-items:stretch;height:100%;padding:20px 0}
.metric{background:var(--sl-card);border:1px solid var(--sl-border);border-radius:20px;padding:30px 20px;
 text-align:center;box-shadow:var(--sl-sh-lg);position:relative;overflow:hidden;
 display:flex;flex-direction:column;justify-content:center}
.metric .top{position:absolute;left:0;top:0;right:0;height:8px;background:var(--sl-gold)}
.metric .val{font-size:calc(58px * var(--dk-fs,1));font-weight:800;color:var(--sl-navy);line-height:1.05}
.metric .lab{font-size:calc(19px * var(--dk-fs,1));color:var(--sl-muted);margin-top:14px;line-height:1.3}

/* timeline ngang */
.tl{position:relative;height:100%;display:flex;align-items:center}
.tl .line{position:absolute;left:0;right:0;top:50%;height:3px;background:var(--sl-border)}
.tl .node{position:relative;flex:1;display:flex;flex-direction:column;align-items:center;text-align:center}
.tl .dot{width:56px;height:56px;border-radius:50%;background:var(--sl-navy);color:#fff;display:flex;
 align-items:center;justify-content:center;font-size:calc(22px * var(--dk-fs,1));font-weight:800;z-index:2;box-shadow:0 8px 20px rgba(20,30,70,.25)}
.tl .lab{position:absolute;width:88%;font-size:calc(18px * var(--dk-fs,1));line-height:1.3;color:var(--sl-ink)}
.tl .above .lab{bottom:64px}.tl .below .lab{top:64px}

/* toc: danh s\xE1ch \u0111\xE1nh s\u1ED1 */
.toc{display:flex;flex-direction:column;gap:16px;height:100%;justify-content:center}
.toc .it{display:flex;align-items:center;gap:22px;background:var(--sl-card);border:1px solid var(--sl-border);
 border-radius:14px;padding:16px 22px;box-shadow:var(--sl-sh-sm);position:relative}
.toc .it::before{content:"";position:absolute;left:0;top:0;bottom:0;width:6px;background:var(--sl-gold);border-radius:14px 0 0 14px}
.toc .n{font-size:calc(30px * var(--dk-fs,1));font-weight:800;color:var(--sl-blue-pale);min-width:52px}
.toc .t{font-size:calc(24px * var(--dk-fs,1));font-weight:700;color:var(--sl-ink)}

/* steps: quy tr\xECnh d\u1ECDc (s\u1ED1 + vi\u1EC7c) */
.steps{display:flex;flex-direction:column;gap:16px;height:100%;justify-content:center}
.stp{display:flex;align-items:center;gap:22px;background:var(--sl-card);border:1px solid var(--sl-border);
 border-radius:14px;padding:15px 24px;box-shadow:var(--sl-sh-sm)}
.stp .sn{flex:none;width:46px;height:46px;border-radius:50%;background:var(--sl-gold);color:var(--sl-navy2);
 font-weight:800;font-size:calc(22px * var(--dk-fs,1));display:flex;align-items:center;justify-content:center}
.stp .st{font-size:calc(23px * var(--dk-fs,1));font-weight:600;color:var(--sl-ink);line-height:1.3}

/* bignum: 1\u20133 con s\u1ED1 hero */
.bnrow{display:grid;gap:30px;height:100%;align-items:center}
.bn{text-align:center;background:var(--sl-card);border:1px solid var(--sl-border);border-radius:22px;
 padding:36px 22px;box-shadow:var(--sl-sh-lg)}
.bnv{font-size:calc(98px * var(--dk-fs,1));font-weight:900;line-height:1;letter-spacing:-.02em}
.bnl{margin-top:14px;font-size:calc(23px * var(--dk-fs,1));font-weight:600;color:var(--sl-muted);line-height:1.3}

/* pyramid / funnel: t\u1EA7ng b\u1EADc m\xE0u */
.pyramid,.funnel{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;height:100%}
.pyr,.fnl{color:#fff;font-weight:700;font-size:calc(22px * var(--dk-fs,1));line-height:1.25;text-align:center;padding:16px 26px;
 border-radius:14px;box-shadow:var(--sl-sh-md);display:flex;align-items:center;justify-content:center;
 max-width:100%;overflow:hidden}

/* checklist: \u2713 trong v\xF2ng tr\xF2n */
.cklist{display:flex;flex-direction:column;gap:14px;height:100%;justify-content:center}
.ck{display:flex;align-items:center;gap:18px}
.ckm{flex:none;width:38px;height:38px;border-radius:50%;background:var(--sl-green);color:#fff;font-weight:800;font-size:calc(20px * var(--dk-fs,1));display:flex;align-items:center;justify-content:center}
.ckt{font-size:calc(23px * var(--dk-fs,1));font-weight:600;color:var(--sl-ink);line-height:1.3}

/* quadrant: ma tr\u1EADn 2\xD72 */
.quad{display:grid;grid-template-columns:1fr 1fr;gap:20px;height:100%}
.qd{background:var(--sl-card);border:1px solid var(--sl-border);border-radius:16px;padding:20px 24px;box-shadow:var(--sl-sh-sm);overflow:auto}
.qdt{font-size:calc(22px * var(--dk-fs,1));font-weight:800;margin-bottom:8px}
.qd ul.bul li{font-size:calc(18px * var(--dk-fs,1));margin:5px 0}

/* arrow: m\u0169i t\xEAn ngang (chevron) */
.arrow{display:flex;gap:5px;align-items:stretch;height:100%;padding:44px 0}
.arw{flex:1;color:#fff;padding:20px 24px 20px 46px;display:flex;flex-direction:column;justify-content:center;overflow:hidden;
 clip-path:polygon(0 0,calc(100% - 26px) 0,100% 50%,calc(100% - 26px) 100%,0 100%,26px 50%)}
.arw.first{clip-path:polygon(0 0,calc(100% - 26px) 0,100% 50%,calc(100% - 26px) 100%,0 100%);border-radius:12px 0 0 12px;padding-left:28px}
.arwn{font-size:calc(13px * var(--dk-fs,1));font-weight:800;letter-spacing:.05em;opacity:.9}
.arwt{font-size:calc(19px * var(--dk-fs,1));font-weight:700;margin-top:6px;line-height:1.25}

/* cover: b\xECa s\xE1ng, ti\xEAu \u0111\u1EC1 r\u1EA5t l\u1EDBn */
/* \`display:flex\` CH\u1EC8 khi slide \u0111ang hi\u1EC7n. Tr\u01B0\u1EDBc \u0111\xE2y khai tr\u1EA7n \`#scaler>.slide.cover{display:flex}\`
   \u2014 c\xF9ng specificity v\u1EDBi \`.slide.active{display:block}\` nh\u01B0ng \u0111\u1EE9ng SAU n\xEAn th\u1EAFng, khi\u1EBFn slide
   \`cover\` KH\xD4NG \u1EDF v\u1ECB tr\xED \u0111\u1EA7u lu\xF4n hi\u1EC7n \u0111\xE8 l\xEAn slide \u0111ang xem. Ch\u01B0a GV n\xE0o g\u1EB7p (0/71 deck th\u1EADt
   c\xF3 cover \u1EDF gi\u1EEFa) nh\u01B0ng \u0111\u1ED5i b\u1ED1 c\u1EE5c m\u1ED9t slide th\xE0nh "B\xECa" l\xE0 d\u1EF1ng ra ngay. */
#scaler>.slide.cover{align-items:center;background:var(--sl-bg2);padding:0 var(--pad)}
#scaler>.slide.cover.active,.slide.cover{display:flex;align-items:center;background:var(--sl-bg2);padding:0 var(--pad)}
.cover-in{max-width:960px}
.cover .hbar{width:74px;height:6px;background:var(--sl-gold);border-radius:3px;margin-bottom:22px}
.cover .hk{font-size:calc(18px * var(--dk-fs,1));font-weight:800;letter-spacing:.09em;text-transform:uppercase;color:var(--sl-blue)}
.cover .hbig{font-size:calc(72px * var(--dk-fs,1));line-height:1.05;font-weight:900;color:var(--sl-ink);margin-top:12px;letter-spacing:-.02em}
.cover .hsub{font-size:calc(26px * var(--dk-fs,1));color:var(--sl-muted);margin-top:22px;line-height:1.35;max-width:760px}

/* gallery: l\u01B0\u1EDBi \u1EA3nh */
.gal{display:grid;gap:16px;height:100%}
.gcell{position:relative;border-radius:14px;overflow:hidden;background:var(--sl-muted);border:1px solid var(--sl-border);box-shadow:var(--sl-sh-sm)}
.gcell img{width:100%;height:100%;object-fit:cover;display:block}
.gcap{position:absolute;left:0;right:0;bottom:0;background:linear-gradient(transparent,rgba(0,0,0,.6));color:#fff;font-size:calc(14px * var(--dk-fs,1));font-weight:600;padding:14px 12px 8px}

/* numbered: \u0111\xE1nh s\u1ED1 l\u1EDBn */
.nlist{display:flex;flex-direction:column;gap:16px;height:100%;justify-content:center}
.nrow{display:flex;align-items:center;gap:24px}
.nbig{font-size:calc(52px * var(--dk-fs,1));font-weight:900;color:var(--sl-gold);min-width:82px;line-height:1;letter-spacing:-.02em}
.ntxt{font-size:calc(24px * var(--dk-fs,1));font-weight:600;color:var(--sl-ink);line-height:1.3}

/* split: panel m\xE0u tr\xE1i + n\u1ED9i dung ph\u1EA3i (full-bleed) */
.slide.split{padding:0}
.split{display:flex;height:100%;width:100%}
.spl-l{width:42%;background:linear-gradient(155deg,var(--sl-navy),var(--sl-navy2));color:#fff;padding:var(--pad);display:flex;flex-direction:column;justify-content:center}
.spl-t{font-family:var(--sl-font-display,var(--sl-font));font-size:calc(46px * var(--dk-fs,1));font-weight:900;line-height:1.08}
.spl-sub{font-size:calc(20px * var(--dk-fs,1));opacity:.85;margin-top:18px;line-height:1.4}
/* \`.spl-r\` KH\xD4NG \u0111\u01B0\u1EE3c khai \`--bul-size\` (d\xF9 \u1EDF khung hay \u1EDF \`li\`): bi\u1EBFn khai tr\xEAn ph\u1EA7n t\u1EED con
   lu\xF4n th\u1EAFng bi\u1EBFn k\u1EBF th\u1EEBa t\u1EEB \`.slide[data-nb=\u2026]\`, n\xEAn thang thu nh\u1ECF theo s\u1ED1 \xFD s\u1EBD v\xF4 t\xE1c d\u1EE5ng
   v\xE0 split 8-10 \xFD tr\xE0n ra ngo\xE0i. \`.spl-r\` l\u1EA1i n\u1EB1m NGO\xC0I \`.body\` n\xEAn c\u0169ng kh\xF4ng c\xF3 ch\u1ED1t
   \`overflow:hidden\` c\u1EE7a \`.body\` \u2014 ph\u1EA3i t\u1EF1 khai.
   C\u1EE1 m\u1EB7c \u0111\u1ECBnh 22px c\u1EE7a split \u0111\u1EB7t \u1EDF thang \`data-nb\` ph\xEDa d\u01B0\u1EDBi (b\u1EADc "\xEDt \xFD"). */
.spl-r{flex:1;padding:var(--pad);display:flex;flex-direction:column;justify-content:center;
 min-height:0;overflow:hidden}

/* feature: th\u1EBB t\xEDnh n\u0103ng l\u1EDBn (v\xF2ng s\u1ED1) */
.feat{display:grid;gap:22px;height:100%;align-items:center}
.ft{background:var(--sl-card);border:1px solid var(--sl-border);border-radius:18px;padding:28px 24px;box-shadow:var(--sl-sh-sm);text-align:center}
.ft-ic{width:56px;height:56px;border-radius:16px;color:#fff;font-size:calc(26px * var(--dk-fs,1));font-weight:800;display:flex;align-items:center;justify-content:center;margin:0 auto 16px}
.ft-t{font-size:calc(22px * var(--dk-fs,1));font-weight:800;color:var(--sl-navy)}
.ft-l{font-size:calc(16px * var(--dk-fs,1));color:var(--sl-muted);margin-top:8px;line-height:1.4}

/* proscons: \u01B0u (xanh) / nh\u01B0\u1EE3c (\u0111\u1ECF) */
.pcwrap{display:grid;grid-template-columns:1fr 1fr;gap:24px;height:100%}
/* \`overflow:hidden\` ch\u1EE9 KH\xD4NG \`auto\`: slide \u0111em \u0111i chi\u1EBFu/ch\u1EE5p \u1EA3nh kh\xF4ng c\xF3 thanh cu\u1ED9n,
   \`auto\` ch\u1EC9 khi\u1EBFn ch\u1EEF th\u1EEBa tr\xE0n ra ngo\xE0i th\u1EBB. Anh em \`.qd\` \u0111\xE3 s\u1EEDa, \`.pc\` b\u1ECB b\u1ECF s\xF3t. */
.pc{background:var(--sl-card);border:1px solid var(--sl-border);border-radius:16px;padding:20px 24px;box-shadow:var(--sl-sh-sm);overflow:hidden;min-height:0;display:flex;flex-direction:column}
.pc ul.bul{min-height:0;overflow:hidden}
.pc-h{display:flex;align-items:center;gap:11px;font-size:calc(22px * var(--dk-fs,1));font-weight:800;margin-bottom:12px}
.pc-m{flex:none;width:30px;height:30px;border-radius:50%;color:#fff;display:flex;align-items:center;justify-content:center;font-size:calc(16px * var(--dk-fs,1))}
.pc ul.bul li{font-size:calc(19px * var(--dk-fs,1));margin:6px 0}

/* spotlight: h\u1ED9p nh\u1EA5n c\xF3 bi\u1EC3u t\u01B0\u1EE3ng */
/* KHAI B\xC1O DUY NH\u1EA4T \u2014 tr\u01B0\u1EDBc \u0111\xE2y khai 2 ch\u1ED7 v\u1EDBi tr\u1EE5c ng\u01B0\u1EE3c nhau (\`row\` \u1EDF \u0111\xE2y,
   \`column\` \u1EDF kh\u1ED1i ch\u1ED1ng tr\xE0n) n\xEAn b\u1ED1 c\u1EE5c "bi\u1EC3u t\u01B0\u1EE3ng b\xEAn tr\xE1i ch\u1EEF" ch\u01B0a bao gi\u1EDD ch\u1EA1y.
   Gi\u1EEF \`column\` v\xEC \u0111\xF3 l\xE0 b\u1EA3n \u0111ang hi\u1EC3n th\u1ECB v\xE0 m\u1ECDi \u1EA3nh m\u1ED1c test l\u1EA5y theo n\xF3. */
.spot{display:flex;flex-direction:column;align-items:center;gap:28px;background:var(--sl-amber-bg);border:2px solid var(--sl-amber-bd);border-radius:20px;padding:32px 44px;height:100%;min-height:0;overflow:hidden;box-shadow:var(--sl-sh-lg)}
.spot-ic{font-size:calc(60px * var(--dk-fs,1));flex:none}
.spot-body{flex:1}
.spot-body ul.bul li{font-size:calc(26px * var(--dk-fs,1));font-weight:600;color:var(--sl-ink);margin:8px 0;line-height:1.35}

/* vtimeline: m\u1ED1c th\u1EDDi gian d\u1ECDc */
.vtl{position:relative;padding-left:44px;height:100%;display:flex;flex-direction:column;justify-content:center;gap:18px}
.vtl::before{content:"";position:absolute;left:18px;top:14px;bottom:14px;width:2px;background:var(--sl-border)}
.vt-item{display:flex;align-items:center;gap:18px;position:relative}
.vt-dot{position:absolute;left:-44px;width:37px;height:37px;border-radius:50%;background:var(--sl-gold);color:var(--sl-navy2);font-weight:800;font-size:calc(18px * var(--dk-fs,1));display:flex;align-items:center;justify-content:center;flex:none}
.vt-txt{font-size:calc(23px * var(--dk-fs,1));font-weight:600;color:var(--sl-ink);line-height:1.3}

/* twocol: 2 c\u1ED9t n\u1ED9i dung */
.body.twocol .bul{column-count:2;column-gap:48px}
.body.twocol .bul li{break-inside:avoid}

/* comparetable: b\u1EA3ng so s\xE1nh k\u1EBB \xF4 */
.cmptbl{width:100%;border-collapse:collapse;font-size:calc(20px * var(--dk-fs,1))}
.cmptbl th,.cmptbl td{border:1px solid var(--sl-border);padding:13px 18px;text-align:left;color:var(--sl-ink)}
.cmptbl th{background:var(--sl-navy);color:#fff;font-weight:800;font-size:calc(21px * var(--dk-fs,1))}
.cmptbl tr:nth-child(even) td{background:var(--sl-bg2)}

/* define/example/remember: card vi\u1EC1n accent */
/* \`top\` ph\u1EA3i b\xE1m \`--rule-y\` ch\u1EE9 kh\xF4ng \u0111\xF3ng c\u1EE9ng 152px: ti\xEAu \u0111\u1EC1 3 d\xF2ng \u0111\u1EA9y \`--rule-y\` l\xEAn
   190px, th\u1EBB \u0111\u1EE9ng y\xEAn \u1EDF 152px s\u1EBD \u0110\xC8 l\xEAn ti\xEAu \u0111\u1EC1 v\xE0 \u0111\u01B0\u1EDDng k\u1EBB. C\xF4ng th\u1EE9c n\xE0y ra \u0111\xFAng 152px \u1EDF
   ti\xEAu \u0111\u1EC1 1 d\xF2ng n\xEAn slide th\u01B0\u1EDDng kh\xF4ng \u0111\u1ED5i m\u1ED9t pixel n\xE0o. */
.acard{position:absolute;left:var(--pad);top:calc(var(--rule-y,120px) + 32px);right:var(--pad);bottom:64px;background:var(--sl-card);
 border-radius:18px;border:1px solid var(--sl-border);padding:34px 40px;box-shadow:var(--sl-sh-lg);overflow:auto}
.acard.lft{border-left:8px solid var(--sl-accent)}

/* formula */
.fbox{position:absolute;left:120px;right:120px;top:calc(var(--rule-y,120px) + 120px);min-height:190px;background:var(--sl-card);
 border:1.5px dashed var(--sl-blue-border);border-radius:18px;display:flex;align-items:center;justify-content:center;padding:24px}
.fbox img{max-width:88%;max-height:150px}
.fbox .ftx{font-size:calc(38px * var(--dk-fs,1));font-weight:800;color:var(--sl-navy);text-align:center;line-height:1.25}
.fcp2{position:absolute;left:120px;right:120px;top:calc(var(--rule-y,120px) + 350px);text-align:center;color:var(--sl-muted);font-size:calc(16px * var(--dk-fs,1))}
/* C\xF4ng th\u1EE9c CH\u01AFA render \u0111\u01B0\u1EE3c th\xE0nh \u1EA3nh: hi\u1EC7n ch\u1EEF \u0111\xE3 d\u1ECDn, c\u1EE1 nh\u1ECF h\u01A1n + b\xE1o cho GV bi\u1EBFt
   \u0111\u1EC3 b\u1EA5m d\xE0n l\u1EA1i. Kh\xF4ng \u0111\xE1nh d\u1EA5u th\xEC GV t\u01B0\u1EDFng c\xF4ng th\u1EE9c v\u1ED1n x\u1EA5u nh\u01B0 v\u1EADy. */
.fbox .ftx.ftx-tex{font-size:calc(26px * var(--dk-fs,1));font-weight:700;overflow-wrap:anywhere;
 display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:4;overflow:hidden}
.fbox .ftx.ftx-tex::after{content:"c\xF4ng th\u1EE9c ch\u01B0a d\u1EF1ng \u0111\u01B0\u1EE3c \u1EA3nh \u2014 b\u1EA5m D\xE0n l\u1EA1i slide";
 display:block;margin-top:14px;font-size:calc(13px * var(--dk-fs,1));font-weight:600;color:var(--sl-muted)}

/* figure l\u1EDBn */
.bigfig{position:absolute;left:var(--pad);top:calc(var(--rule-y,120px) + 32px);right:var(--pad);bottom:74px;display:flex;
 align-items:center;justify-content:center;background:var(--sl-card);border-radius:18px;border:1px solid var(--sl-border);overflow:hidden;box-shadow:var(--sl-sh-md)}
.bigfig img{max-width:100%;max-height:100%;object-fit:contain}

/* full-bleed: statement / quote / section */
#scaler>.slide.hero,.slide.hero{background:var(--sl-bg2)}
.hero .k{position:absolute;left:96px;top:150px;font-size:calc(15px * var(--dk-fs,1));font-weight:800;letter-spacing:.14em;text-transform:uppercase;color:var(--sl-gold)}
.hero .k::after{content:"";display:block;width:120px;height:4px;background:var(--sl-gold);margin-top:12px}
.hero .msg{position:absolute;left:96px;right:120px;top:210px;font-size:calc(48px * var(--dk-fs,1));font-weight:800;color:var(--sl-navy);line-height:1.14;letter-spacing:-.01em}
.hero .sub{position:absolute;left:96px;right:140px;top:520px;font-size:calc(20px * var(--dk-fs,1));color:var(--sl-muted);line-height:1.35}

/* Ph\u1EA3i b\xE1m \`#scaler>\` \u2014 lu\u1EADt n\u1EC1n chung \`#scaler>.slide\` c\xF3 \u0110\u1ED8 \u01AFU TI\xCAN cao h\u01A1n (id+class)
   n\xEAn \`.slide.dark\` \u0111\u01A1n thu\u1EA7n b\u1ECB \u0111\xE8, slide t\u1ED1i ho\xE1 ra n\u1EC1n TR\u1EAENG v\xE0 ch\u1EEF tr\u1EAFng bi\u1EBFn m\u1EA5t. */
#scaler>.slide.dk-dark,.slide.dk-dark{background:linear-gradient(135deg,var(--sl-navy),var(--sl-navy2))}
.dk-dark .rail{position:absolute;left:0;top:0;bottom:0;width:8px;background:var(--sl-gold)}
.qmark{position:absolute;left:88px;top:104px;font-size:calc(150px * var(--dk-fs,1));font-weight:800;color:var(--sl-gold);line-height:.7;font-family:Georgia,serif}
.qmsg{position:absolute;left:100px;right:120px;top:250px;font-size:calc(42px * var(--dk-fs,1));font-weight:800;color:#fff;line-height:1.24}
.qby{position:absolute;left:100px;top:560px;font-size:calc(19px * var(--dk-fs,1));color:var(--sl-blue-border)}
.sec-tag{position:absolute;left:110px;top:250px;font-size:calc(16px * var(--dk-fs,1));font-weight:800;letter-spacing:.14em;text-transform:uppercase;color:var(--sl-gold)}
.sec-ttl{position:absolute;left:110px;right:120px;top:290px;font-size:calc(52px * var(--dk-fs,1));font-weight:800;color:#fff;line-height:1.12}
.sec-sub{position:absolute;left:110px;right:140px;top:460px;font-size:calc(20px * var(--dk-fs,1));color:var(--sl-blue-border);line-height:1.4}

/* nav pill + progress (nh\u01B0 player pptx) */
/* \`absolute\` ch\u1EE9 KH\xD4NG \`fixed\`: fixed neo v\xE0o viewport \u21D2 nav tho\xE1t kh\u1ECFi panel, n\u1ED5i \u0111\xE8 UI
   app. \`mount.ts\` \u0111\xE3 \u0111\u1EB7t host \`position:relative\` n\xEAn absolute neo \u0111\xFAng khung deck. */
.nav{position:absolute;bottom:16px;left:50%;transform:translateX(-50%);display:flex;align-items:center;gap:12px;
 background:rgba(18,20,27,.72);backdrop-filter:blur(10px);border:1px solid rgba(255,255,255,.08);color:#fff;
 padding:8px 14px;border-radius:999px;font-size:calc(14px * var(--dk-fs,1));z-index:20;box-shadow:0 8px 30px rgba(0,0,0,.45)}
.nav button{background:rgba(255,255,255,.12);border:0;color:#fff;width:34px;height:34px;border-radius:50%;cursor:pointer;font-size:calc(17px * var(--dk-fs,1))}
.nav button:hover{background:rgba(255,255,255,.28)}
.nav .counter{min-width:70px;text-align:center;font-variant-numeric:tabular-nums}
#sprog{position:absolute;left:0;bottom:0;height:3px;width:0;z-index:21;background:linear-gradient(90deg,var(--sl-blue),var(--sl-gold));transition:width .25s}

/* \u2550\u2550 B\u1ED1 c\u1EE5c b\u1ED5 sung (\u0111\u1EE3t 2) \u2014 kh\xF4ng c\xF3 \u1EDF renderer Python \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550 */

/* D\xE3y ch\u1EC9 s\u1ED1: s\u1ED1 to, v\u1EA1ch m\xE0u, nh\xE3n d\u01B0\u1EDBi */
.kpirow{display:grid;gap:26px;align-items:stretch;height:100%;padding:24px 0}
.kpi{display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;
 background:var(--sl-card);border:1px solid var(--sl-border);border-radius:20px;padding:26px 18px;box-shadow:var(--sl-sh-sm)}
.kpi-v{font-size:calc(64px * var(--dk-fs,1));font-weight:800;color:var(--sl-accent);line-height:1;overflow-wrap:anywhere}
.kpi-bar{width:52px;height:5px;border-radius:3px;background:var(--sl-accent);margin:16px 0 14px}
.kpi-l{font-size:calc(19px * var(--dk-fs,1));color:var(--sl-muted);line-height:1.35}

/* \u1EA2nh m\u1ED9t b\xEAn, \xFD b\xEAn kia. \`left\`/\`right\` ch\u1EC9 \u0111\u1ED5i T\u1EC8 L\u1EC6 C\u1ED8T \u2014 th\u1EE9 t\u1EF1 DOM \u0111\xE3 \u0111\xFAng
   s\u1EB5n n\xEAn tr\xECnh \u0111\u1ECDc m\xE0n h\xECnh v\xE0 b\u1EA3n .pptx kh\xF4ng b\u1ECB \u0111\u1EA3o. */
.imgside{display:grid;gap:40px;height:100%;align-items:center}
.imgside.left{grid-template-columns:460px 1fr}
.imgside.right{grid-template-columns:1fr 460px}
.imgside .fig{align-self:center;background:var(--sl-card);border:1px solid var(--sl-border);
 border-radius:18px;padding:16px;box-shadow:var(--sl-sh-md)}
.imgside .fig img{width:100%;height:auto;display:block;border-radius:10px;max-height:420px;object-fit:contain}

/* Tr\xEDch d\u1EABn c\xF3 t\xE1c gi\u1EA3 \u2014 d\xF9ng l\u1EA1i .qmark/.qmsg c\u1EE7a \`quote\`.
   \`.qby\` c\u1EE7a \`quote\` l\xE0 position:absolute (top:560px); l\u1ED3ng v\xE0o .qauth th\xEC hai to\u1EA1 \u0111\u1ED9
   C\u1ED8NG D\u1ED2N v\xE0 t\xEAn t\xE1c gi\u1EA3 v\u0103ng ra ngo\xE0i slide \u2192 ph\u1EA3i tr\u1EA3 n\xF3 v\u1EC1 d\xF2ng th\u01B0\u1EDDng. */
.qauth{position:absolute;left:100px;bottom:96px;right:120px;
 display:flex;align-items:center;gap:16px}
.qauth .qby{position:static;top:auto;left:auto;font-size:calc(21px * var(--dk-fs,1));font-weight:700;color:#fff}
.qav{width:64px;height:64px;border-radius:50%;object-fit:cover;flex-shrink:0;
 border:2px solid var(--sl-gold)}
.qrole{font-size:calc(16px * var(--dk-fs,1));color:var(--sl-blue-border);margin-top:2px}

/* M\u1EE5c l\u1EE5c c\xF3 m\u1ED1c: \u0111\xE3 qua / \u0111ang \u1EDF / s\u1EAFp t\u1EDBi */
.agenda{display:flex;flex-direction:column;gap:12px;height:100%;justify-content:center}
.ag-it{display:flex;align-items:center;gap:20px;border-radius:14px;padding:12px 20px;
 border:1px solid var(--sl-border);background:var(--sl-card);box-shadow:var(--sl-sh-sm)}
.ag-n{width:38px;height:38px;border-radius:50%;flex-shrink:0;display:flex;align-items:center;
 justify-content:center;font-weight:800;font-size:calc(16px * var(--dk-fs,1));background:var(--sl-bg2);color:var(--sl-muted)}
.ag-t{font-size:calc(21px * var(--dk-fs,1));color:var(--sl-ink);line-height:1.3}
.ag-it.done{opacity:.5}
.ag-it.done .ag-n{background:var(--sl-green);color:#fff}
/* M\u1EE5c \u0110ANG \u1EDF: vi\u1EC1n \u0111\u1EADm + n\u1EC1n nh\u1EA5n \u0111\u1EC3 nh\xECn ph\xE1t th\u1EA5y ngay \u0111ang d\u1EA1y t\u1EDBi \u0111\xE2u */
.ag-it.now{border-color:var(--sl-gold);border-width:2px;background:var(--sl-bg2);
 box-shadow:0 4px 16px rgba(0,0,0,.08)}
.ag-it.now .ag-n{background:var(--sl-gold);color:var(--sl-navy)}
.ag-it.now .ag-t{font-weight:700}

/* So s\xE1nh 3 c\u1ED9t: ti\xEAu \u0111\u1EC1 l\xE0 d\u1EA3i m\xE0u \u0111\u1EB7c (kh\xE1c \`three\` ch\u1EC9 c\xF3 v\u1EA1ch m\u1EA3nh) */
.c3row{display:grid;gap:22px;height:100%;align-items:stretch;padding:8px 0}
.c3{display:flex;flex-direction:column;border-radius:16px;overflow:hidden;
 border:1px solid var(--sl-border);background:var(--sl-card);box-shadow:var(--sl-sh-md)}
.c3-h{padding:14px 18px;color:#fff;font-weight:800;font-size:calc(21px * var(--dk-fs,1));line-height:1.25;
 overflow-wrap:anywhere}
.c3-b{flex:1;padding:16px 18px}
.c3-b ul.bul li{font-size:calc(19px * var(--dk-fs,1));margin:9px 0}

/* Khung tr\u1EAFng: v\xF9ng n\u1ED9i dung c\xF3 vi\u1EC1n \u0111\u1EE9t cho GV bi\u1EBFt ch\u1ED7 t\u1EF1 d\u1EF1ng */
.blankbody{border:2px dashed var(--sl-border);border-radius:16px;padding:24px}

/* \u2550\u2550 Ch\u1ED1ng TR\xC0N khi n\u1ED9i dung qu\xE1 d\xE0i (m\u1EE9c "over") \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550
   C\xE1c con s\u1ED1/nh\xE3n c\u1EE1 l\u1EDBn \u0111\u01B0\u1EE3c \u0111\u1EB7t c\u1EE9ng theo px n\xEAn g\u1EB7p ch\u1EEF d\xE0i l\xE0 v\u1EE1 khung.
   D\xF9ng \`clamp()\` theo chi\u1EC1u r\u1ED9ng \xF4 + c\u1EAFt s\u1ED1 d\xF2ng, thay v\xEC \u0111\u1EC3 tr\xE0n ra ngo\xE0i. */

/* S\u1ED1 l\u1EDBn / ch\u1EC9 s\u1ED1: co theo b\u1EC1 ngang \xF4, t\u1ED1i \u0111a 3 d\xF2ng */
.bnv{font-size:calc((clamp(34px,7vw,98px)) * var(--dk-fs,1));overflow-wrap:anywhere;
 display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:3;overflow:hidden}
.bnl,.kpi-l,.metric .lab{overflow-wrap:anywhere;
 display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:3;overflow:hidden}
.kpi-v{font-size:calc((clamp(28px,5vw,64px)) * var(--dk-fs,1));
 display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:3;overflow:hidden}
.metric .val{font-size:calc((clamp(28px,4.6vw,58px)) * var(--dk-fs,1));overflow-wrap:anywhere;
 display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:2;overflow:hidden}
.bn,.kpi,.metric{overflow:hidden}

/* C\u1ED9t (three/compare/compare3/quadrant/feature) v\xE0 c\xE1c danh s\xE1ch trong c\u1ED9t:
   \xF4 c\u1ED9t t\u1EF1 cu\u1ED9n-\u1EA9n ph\u1EA7n th\u1EEBa thay v\xEC \u0111\u1EA9y ch\u1EEF xu\u1ED1ng d\u01B0\u1EDBi ch\xE2n trang. */
.cols .col,.c3,.c3-b{overflow:hidden}
.cols .col ul.bul,.c3-b ul.bul{overflow:hidden}

/* \`.dtbl\` C\u0168NG kh\xF4ng \u0111\u01B0\u1EE3c \`display:block\` \u2014 xem ghi ch\xFA \u1EDF kh\u1ED1i .cmptbl ph\xEDa d\u01B0\u1EDBi.
   Tr\u01B0\u1EDBc \u0111\xE2y d\xF2ng n\xE0y \u0111\u1EB7t \`display:block\`, gi\u1EBFt \`table-layout:fixed\` \u1EDF khai b\xE1o g\u1ED1c: \u0111o th\u1EADt
   3 c\u1ED9t ra 112/468/147px thay v\xEC ~362 \u0111\u1EC1u nhau. N\u1EB7ng h\u01A1n \`.cmptbl\` v\xEC \`table\` l\xE0 b\u1ED1 c\u1EE5c
   KH\xD4NG cho ch\u1ECDn tay \u21D2 gi\xE1o vi\xEAn kh\xF4ng tho\xE1t \u0111\u01B0\u1EE3c. Ph\u1EA7n c\u1EAFt \u0111\xE3 c\xF3 \`.body\` lo. */

/* M\u1EE5c l\u1EE5c c\xF3 m\u1ED1c / c\xE1c b\u01B0\u1EDBc / \u0111i\u1EC3m nh\u1EA5n: nhi\u1EC1u m\u1EE5c th\xEC thu g\u1ECDn d\xF2ng */
.agenda,.toc{overflow:hidden}
.agenda .ag-t,.toc .t{display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:2;overflow:hidden}

/* \u2500\u2500 Ch\u1ED1ng tr\xE0n: m\u1ED9t lu\u1EADt chung thay v\xEC v\xE1 theo t\u1EEBng t\xEAn class \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
   M\u1ECDi v\xF9ng n\u1ED9i dung c\u1EE7a slide \u0111\u1EC1u n\u1EB1m trong \`.body\` (\u0111\xE3 \`overflow:hidden\`). V\u1EA5n \u0111\u1EC1 c\xF2n l\u1EA1i
   l\xE0 c\xE1c L\u1EDAP GI\u1EEEA cao h\u01A1n khung cha n\xEAn \u0111\u1EA9y ch\u1EEF xu\u1ED1ng d\u01B0\u1EDBi ch\xE2n trang tr\u01B0\u1EDBc khi b\u1ECB c\u1EAFt.
   Cho t\u1EA5t c\u1EA3 ch\xFAng \`min-height:0\` + \`overflow:hidden\` \u2014 trong flex/grid, m\u1EB7c \u0111\u1ECBnh
   \`min-height:auto\` KH\xD4NG cho con co l\u1EA1i, \u0111\xF3 ch\xEDnh l\xE0 l\xFD do ch\u1EEF tr\xE0n ra ngo\xE0i. */
.body>*,.body>*>*{min-height:0}
.cols,.grid,.mrow,.kpirow,.c3row,.quad,.steps,.spot,.agenda,.toc,.gal,.two,.imgside{
 max-height:100%;overflow:hidden}
/* \xD4 con c\u1EE7a c\xE1c l\u01B0\u1EDBi tr\xEAn: t\u1EF1 c\u1EAFt ph\u1EA7n th\u1EEBa, kh\xF4ng \u0111\u1EA9y ra ngo\xE0i */
.col,.qd,.c3,.kpi,.metric,.gcell,.spot-body,.stp{min-height:0;overflow:hidden}
/* Danh s\xE1ch n\u1EB1m TRONG \xF4: \`data-nb\` \u0111\u1EBFm \xFD c\u1EE7a c\u1EA3 slide n\xEAn b\u1EADc thu nh\u1ECF kh\xF4ng v\u1EDBi t\u1EDBi \u0111\xE2y */
.col ul.bul,.qd ul.bul,.c3-b ul.bul,.spot-body ul.bul{min-height:0;overflow:hidden}
.col ul.bul li,.qd ul.bul li,.c3-b ul.bul li{font-size:calc(19px * var(--dk-fs,1));margin:8px 0}
/* C\u1ED9t nhi\u1EC1u \xFD th\xEC thu nh\u1ECF th\xEAm \u2014 n\u1EBFu kh\xF4ng, \xFD cu\u1ED1i b\u1ECB C\u1EAET NGANG CH\u1EEE (x\u1EA5u, kh\xF3 \u0111\u1ECDc).
   \`data-nb\` l\xE0 t\u1ED5ng \xFD c\u1EE7a slide; v\u1EDBi b\u1ED1 c\u1EE5c c\u1ED9t, \xFD \u0111\u01B0\u1EE3c chia \u0111\u1EC1u n\xEAn v\u1EABn suy ra \u0111\u01B0\u1EE3c \u0111\u1ED9 d\xE0y. */
.slide[data-nb="6"] .col ul.bul li,.slide[data-nb="6"] .qd ul.bul li,.slide[data-nb="6"] .c3-b ul.bul li{font-size:calc(17px * var(--dk-fs,1));margin:6px 0}
.slide[data-nb="7"] .col ul.bul li,.slide[data-nb="7"] .qd ul.bul li,.slide[data-nb="7"] .c3-b ul.bul li{font-size:calc(16px * var(--dk-fs,1));margin:5px 0}
.slide[data-nb="8"] .col ul.bul li,.slide[data-nb="8"] .qd ul.bul li,.slide[data-nb="8"] .c3-b ul.bul li{font-size:calc(15px * var(--dk-fs,1));margin:4px 0}
.slide[data-nb="9"] .col ul.bul li,.slide[data-nb="10"] .col ul.bul li,
.slide[data-nb="11"] .col ul.bul li,.slide[data-nb="12"] .col ul.bul li,
.slide[data-nb="9"] .qd ul.bul li,.slide[data-nb="10"] .qd ul.bul li,
.slide[data-nb="9"] .c3-b ul.bul li,.slide[data-nb="10"] .c3-b ul.bul li{font-size:calc(14px * var(--dk-fs,1));margin:3px 0}
/* Ti\xEAu \u0111\u1EC1 c\u1ED9t c\u0169ng ph\u1EA3i nh\u01B0\u1EDDng ch\u1ED7 khi \xFD nhi\u1EC1u */
.slide[data-nb="7"] .col .ch,.slide[data-nb="8"] .col .ch,.slide[data-nb="9"] .col .ch{font-size:calc(18px * var(--dk-fs,1));margin:6px 0 8px}
.slide[data-nb="7"] .col .cn,.slide[data-nb="8"] .col .cn,.slide[data-nb="9"] .col .cn{font-size:calc(24px * var(--dk-fs,1))}
/* \xDD b\u1ECB c\u1EAFt d\u1EDF dang th\xEC th\xE0 c\u1EAFt TR\u1ECCN D\xD2NG c\xF2n h\u01A1n c\u1EAFt ngang ch\u1EEF */
.col ul.bul li,.qd ul.bul li,.c3-b ul.bul li{display:-webkit-box;-webkit-box-orient:vertical;
 -webkit-line-clamp:3;overflow:hidden}
/* quadrant / spotlight / comparetable: 3 ch\u1ED7 cu\u1ED1i c\xF2n tr\xE0n \u1EDF m\u1EE9c "over".
   C\xF9ng m\u1ED9t c\xE1ch ch\u1EEFa: cho khung con co \u0111\u01B0\u1EE3c (min-height:0) r\u1ED3i c\u1EAFt ph\u1EA7n th\u1EEBa. */
.quad{display:grid;height:100%;min-height:0;overflow:hidden}
.qd{min-height:0;overflow:hidden;display:flex;flex-direction:column}
.qd ul.bul{min-height:0;overflow:hidden}
.spot-body{min-height:0;overflow:hidden;flex:1 1 auto}
.spot-body ul.bul{min-height:0;overflow:hidden}
.slide[data-nb="7"] .spot-body ul.bul li,.slide[data-nb="8"] .spot-body ul.bul li{font-size:calc(19px * var(--dk-fs,1));margin:7px 0}
/* B\u1EA3ng so s\xE1nh \u2014 KHAI B\xC1O DUY NH\u1EA4T (tr\u01B0\u1EDBc kia 4 ch\u1ED7 khai m\xE2u thu\u1EABn nhau).
   TUY\u1EC6T \u0110\u1ED0I kh\xF4ng th\xEAm \`display:block\`: \`table-layout:fixed\` CH\u1EC8 c\xF3 t\xE1c d\u1EE5ng tr\xEAn
   display:table, n\xEAn block l\xE0m ch\u1EBFt lu\xF4n vi\u1EC7c chia c\u1ED9t \u0111\u1EC1u. \u0110\xE3 \u0111o th\u1EADt: m\u1ED9t \xF4 d\xE0i
   khi\u1EBFn 2 c\u1ED9t th\xE0nh 1009px / 142px thay v\xEC 576/576 \u2014 hai c\u1ED9t "so s\xE1nh" h\u1EBFt so s\xE1nh
   \u0111\u01B0\u1EE3c, ti\xEAu \u0111\u1EC1 c\u1ED9t h\u1EB9p c\xF2n b\u1ECB ng\u1EAFt gi\u1EEFa ch\u1EEBng.
   C\u1EAFt ph\u1EA7n th\u1EEBa \u0111\xE3 c\xF3 \`.body\` (absolute, overflow \u1EA9n) lo; <table> kh\xF4ng nh\u1EADn
   max-height n\xEAn \u0111\u1EEBng c\u1ED1 \xE9p \u1EDF \u0111\xE2y. Gi\u1EEF <table> th\u1EADt \u0111\u1EC3 .pptx tr\xEDch \u0111\xFAng \xF4. */
.cmptbl{table-layout:fixed;width:100%;border-collapse:collapse}
.cmptbl td,.cmptbl th{overflow-wrap:anywhere;vertical-align:top}
.slide[data-nb="7"] .cmptbl,.slide[data-nb="8"] .cmptbl,
.slide[data-nb="9"] .cmptbl,.slide[data-nb="10"] .cmptbl{font-size:calc(16px * var(--dk-fs,1))}
.slide[data-nb="7"] .cmptbl td,.slide[data-nb="8"] .cmptbl td{padding:6px 12px}

/* \u2550\u2550 B\u1ED1 c\u1EE5c \u0111\u1EE3t 3 \u2014 theo nhu c\u1EA7u TH\u1EACT c\u1EE7a b\xE0i To\xE1n \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550 */

/* B\u1EA3ng R\u1ED8NG (b\u1EA3ng bi\u1EBFn thi\xEAn): tr\u1EA3i h\u1EBFt b\u1EC1 ngang, c\u1ED9t \u0111\u1EC1u nhau.
   \`h_table\` \u0111\u1EC3 \`table-layout:fixed\` + width auto n\xEAn b\u1EA3ng 10 c\u1ED9t co d\xFAm \u1EDF g\xF3c tr\xE1i,
   ch\u1EEBa 2/3 slide tr\u1ED1ng \u2014 chi\u1EBFu xa g\u1EA7n nh\u01B0 kh\xF4ng \u0111\u1ECDc \u0111\u01B0\u1EE3c. */
/* \`.body\` cao h\u1EBFt ph\u1EA7n th\xE2n slide, n\xEAn kh\u1ED1i con ph\u1EA3i T\u1EF0 C\u0102N GI\u1EEEA \u2014 kh\xF4ng th\xEC b\u1EA3ng/th\u1EBB
   d\xEDnh m\xE9p tr\xEAn, ch\u1EEBa 40% slide tr\u1ED1ng (\u0111\xE3 th\u1EA5y tr\xEAn \u1EA3nh ch\u1EE5p b\u1EA3ng bi\u1EBFn thi\xEAn 6 c\u1ED9t). */
.body.twwrap,.body.fswrap{display:flex;flex-direction:column;justify-content:center}
.twtbl{width:100%;border-collapse:collapse;table-layout:fixed;
 font-size:calc((clamp(13px,calc(150px / var(--tw-n, 6)),26px)) * var(--dk-fs,1))}
.twtbl th,.twtbl td{border:1px solid var(--sl-border);padding:10px 6px;text-align:center;
 color:var(--sl-ink);vertical-align:middle;overflow-wrap:anywhere;line-height:1.35}
.twtbl th{background:var(--sl-navy);color:#fff;font-weight:800}
/* C\u1ED9t \u0111\u1EA7u l\xE0 NH\xC3N H\xC0NG (x \xB7 y\u2032 \xB7 y) \u2014 t\xF4 n\u1EC1n cho m\u1EAFt b\xE1m \u0111\u01B0\u1EE3c khi \u0111\u1ECDc ngang */
.twtbl .tw-h{background:var(--sl-bg2);font-weight:800;color:var(--sl-navy);text-align:right;
 padding-right:12px;width:var(--tw-lab,84px)}
.twtbl tr:nth-child(even) td:not(.tw-h){background:var(--sl-bg2)}
.tw-cap{margin-top:14px;font-size:calc(15px * var(--dk-fs,1));color:var(--sl-muted);text-align:center;font-style:italic}

/* Th\u1EBB \u0111\u1ECBnh ngh\u0129a \u2014 ch\u1EEF d\xE0i tr\xECnh b\xE0y th\xE0nh \u0111o\u1EA1n v\u0103n c\xF3 khung, c\u1EE1 t\u1EF1 co theo \u0111\u1ED9 d\xE0i. */
.defcard{background:var(--sl-card);border:1px solid var(--sl-border);
 border-left:6px solid var(--sl-navy);border-radius:14px;padding:26px 30px;height:100%;
 overflow:hidden;display:flex;flex-direction:column;gap:14px;justify-content:center;box-shadow:var(--sl-sh-lg)}
.dc-p{color:var(--sl-ink);line-height:1.55;overflow-wrap:anywhere}
.defcard[data-sz="l"] .dc-p{font-size:calc(26px * var(--dk-fs,1))}
.defcard[data-sz="m"] .dc-p{font-size:calc(21px * var(--dk-fs,1));line-height:1.5}
.defcard[data-sz="s"] .dc-p{font-size:calc(17px * var(--dk-fs,1));line-height:1.45}
.dc-src{margin-top:auto;padding-top:12px;border-top:1px solid var(--sl-border);
 font-size:calc(14px * var(--dk-fs,1));color:var(--sl-muted);font-style:italic}

/* C\xF4ng th\u1EE9c + c\xE1c b\u01B0\u1EDBc bi\u1EBFn \u0111\u1ED5i */
.fsbox{background:var(--sl-card);border:1px solid var(--sl-border);border-radius:14px;
 padding:18px 22px;text-align:center;margin-bottom:16px;box-shadow:var(--sl-sh-sm)}
.fsbox img{max-width:80%;max-height:110px}
.fs-eq{font-size:calc(30px * var(--dk-fs,1));font-weight:800;color:var(--sl-navy);line-height:1.3;overflow-wrap:anywhere}
.fsteps{list-style:none;display:flex;flex-direction:column;gap:10px;overflow:hidden}
.fsteps li{display:flex;align-items:flex-start;gap:14px}
.fs-n{flex:none;width:26px;height:26px;border-radius:50%;background:var(--sl-blue);color:#fff;
 display:flex;align-items:center;justify-content:center;font-size:calc(14px * var(--dk-fs,1));font-weight:800;margin-top:2px}
.fs-t{font-size:calc(20px * var(--dk-fs,1));line-height:1.4;color:var(--sl-ink);overflow-wrap:anywhere}
`;var Ze=`/**
 * Token giao di\u1EC7n TR\xCCNH S\u1EECA \u2014 theo thang ReUI/shadcn c\u1EE7a app.
 *
 * V\xEC sao CSS thu\u1EA7n ch\u1EE9 kh\xF4ng Tailwind: deck-kit ph\u1EA3i ch\u1EA1y \u0111\u01B0\u1EE3c \u1EDF Angular v\xE0 JS thu\u1EA7n,
 * k\xE9o Tailwind/Radix v\xE0o l\xE0 ph\xE1 m\u1EA5t t\xEDnh \u0111\u1ED9c l\u1EADp \u0111\xF3. N\xEAn b\u1EAFt ch\u01B0\u1EDBc THANG \u0110O c\u1EE7a ReUI
 * (kho\u1EA3ng c\xE1ch 4px, b\xE1n k\xEDnh 6/8/10/12, c\u1EE1 control 32/36) b\u1EB1ng bi\u1EBFn CSS.
 *
 * Ch\u1EC9 \xE1p cho ph\u1EA7n CHROME c\u1EE7a tr\xECnh s\u1EEDa (\`.dk-*\`). B\u1EA3n th\xE2n slide v\u1EABn d\xF9ng token \`--sl-*\`
 * c\u1EE7a theme deck \u2014 hai h\u1EC7 t\xE1ch b\u1EA1ch \u0111\u1EC3 \u0111\u1ED5i theme slide kh\xF4ng k\xE9o theo \u0111\u1ED5i giao di\u1EC7n s\u1EEDa.
 */
.lp-edit {
  /* B\xE1n k\xEDnh \u2014 thang ReUI */
  --dk-r-sm: 6px;
  --dk-r: 8px;
  --dk-r-md: 10px;
  --dk-r-lg: 12px;

  /* Kho\u1EA3ng c\xE1ch \u2014 b\u1ED9i s\u1ED1 4px */
  --dk-1: 4px;
  --dk-2: 8px;
  --dk-3: 12px;
  --dk-4: 16px;
  --dk-6: 24px;

  /* C\u1EE1 control chu\u1EA9n: 32 (nh\u1ECF) \xB7 36 (m\u1EB7c \u0111\u1ECBnh) \u2014 v\xF9ng b\u1EA5m kh\xF4ng d\u01B0\u1EDBi 32px */
  --dk-h-sm: 32px;
  --dk-h: 36px;

  /* M\xE0u \u2014 n\u1EC1n t\u1ED1i cho chrome, t\xE1ch h\u1EB3n v\u1EDBi n\u1EC1n slide \u0111\u1EC3 m\u1EAFt ph\xE2n bi\u1EC7t v\xF9ng l\xE0m vi\u1EC7c */
  --dk-bg: #0f1117;
  --dk-bg-2: #171a22;
  --dk-bg-3: #1f242e;
  --dk-fg: #e7ebf5;
  --dk-fg-2: #9aa6c0;
  --dk-fg-3: #6c7893;
  --dk-border: rgba(255, 255, 255, .09);
  --dk-border-2: rgba(255, 255, 255, .16);

  /* Nh\u1EA5n/c\u1EA3nh b\xE1o \u2014 d\xF9ng chung v\u1EDBi \`--sl-gold\` c\u1EE7a theme \u0111\u1EC3 hai b\xEAn kh\xF4ng ch\u1ECFi nhau */
  --dk-accent: var(--sl-gold, #e0a23a);
  --dk-accent-fg: #1c274c;
  --dk-danger: #f0736a;
  --dk-danger-bg: #3a1d1d;
  --dk-ok: #7fd18a;
  --dk-warn: #e8b339;

  --dk-shadow: 0 4px 14px rgba(0, 0, 0, .35);
  --dk-shadow-lg: 0 18px 48px rgba(0, 0, 0, .5);
  --dk-ring: 0 0 0 3px rgba(224, 162, 58, .28);

  --dk-font: var(--sl-font, system-ui, -apple-system, "Segoe UI", sans-serif);
}

/* Icon SVG nh\xFAng \u2014 \u0103n theo c\u1EE1 ch\u1EEF v\xE0 m\xE0u ch\u1EEF c\u1EE7a n\xFAt ch\u1EE9a n\xF3. */
.dk-i {
  flex: none;
  vertical-align: -.15em;
}
`;var Ye=`/* \`absolute\` ch\u1EE9 KH\xD4NG \`fixed\`: b\u1EA3n c\u0169 lu\xF4n n\u1EB1m trong iframe n\xEAn "c\u1EEDa s\u1ED5" ch\xEDnh l\xE0 khung
   deck. Mount th\u1EB3ng v\xE0o panel c\u1EE7a app th\xEC \`fixed\` khi\u1EBFn rail/console/thanh tr\u1EA1ng th\xE1i b\xE1m
   M\xC0N H\xCCNH \u2014 \u0111\xE8 l\xEAn menu app v\xE0 tr\xE0n ra ngo\xE0i panel. Ph\u1EA7n t\u1EED ch\u1EE9a \u0111\xE3 \`position:relative\`
   (mountDeck \u0111\u1EB7t), n\xEAn \`absolute\` neo \u0111\xFAng v\xE0o khung deck. */

[contenteditable]{outline:1px dashed rgba(38,132,252,.55);outline-offset:3px;border-radius:3px;cursor:text}
[contenteditable]:hover{background:rgba(38,132,252,.05)}
[contenteditable]:focus{outline:2px solid var(--sl-blue);background:rgba(38,132,252,.08)}
ul.bul li{list-style:none}
.edx{margin-left:10px;background:transparent;border:0;color:#c0392b;font-size:20px;line-height:1;cursor:pointer;opacity:.45;vertical-align:middle}
.edx:hover{opacity:1}
.edadd{margin-top:10px;background:transparent;border:1px dashed var(--sl-blue-border);color:var(--sl-blue);border-radius:8px;padding:4px 14px;font-size:15px;cursor:pointer;font-weight:700}
.edadd:hover{background:rgba(38,132,252,.08)}

/* Thumbnail rail tr\xE1i (k\xE9o-th\u1EA3 s\u1EAFp x\u1EBFp, nh\xE2n b\u1EA3n, xo\xE1) + console ph\u1EA3i.
   \`.lp-edit\` n\u1EB1m tr\xEAn <body> \u1EDF b\u1EA3n Python, tr\xEAn ph\u1EA7n t\u1EED host \u1EDF b\u1EA3n th\u01B0 vi\u1EC7n \u2014 b\u1EAFt c\u1EA3 hai. */

/* n\xFAt m\u1EDF b\u1ED9 ch\u1ECDn b\u1ED1 c\u1EE5c + popup picker tr\u1EF1c quan */

/* z-index 200: picker g\u1EAFn th\u1EB3ng v\xE0o <body> n\xEAn n\xF3 n\u1EB1m \u1EDF NG\u1EEE C\u1EA2NH X\u1EBEP CH\u1ED2NG G\u1ED0C, ph\u1EA3i so
   v\u1EDBi c\xE1c l\u1EDBp ph\u1EE7 c\u1EE7a app ch\u1EE7 ch\u1EE9 kh\xF4ng ph\u1EA3i v\u1EDBi \`.dk-toolbar\` (z-30) b\xEAn trong deck. App
   lesson-plan c\xF3 MediaPicker z-100, PreviewModal z-120, JsonModal z-130 \u2014 \u0111\u1EC3 40 th\xEC m\u1EDF picker
   b\u1ED1 c\u1EE5c trong l\xFAc m\u1ED9t trong ba l\u1EDBp \u0111\xF3 \u0111ang m\u1EDF l\xE0 picker CHUI XU\u1ED0NG D\u01AF\u1EDAI: th\u1EA5y m\u1EDD m\u1EDD m\xE0 b\u1EA5m
   kh\xF4ng \u0111\u01B0\u1EE3c. 200 \u0111\u1EC3 c\xF2n ch\u1ED7 tr\u1ED1ng ph\xEDa d\u01B0\u1EDBi cho l\u1EDBp m\u1EDBi c\u1EE7a app ch\u1EE7. */
#lp-picker{position:fixed;inset:0;z-index:200;background:rgba(10,12,18,.55);display:none;align-items:center;justify-content:center}
#lp-picker.show{display:flex}
.pk-box{background:#fff;border-radius:18px;width:min(760px,92vw);max-height:86vh;display:flex;flex-direction:column;box-shadow:0 30px 80px rgba(0,0,0,.5);overflow:hidden}
.pk-hd{display:flex;align-items:center;justify-content:space-between;padding:16px 22px;border-bottom:1px solid #e6e9f0;font-weight:800;font-size:16px;color:#1C274C}
.pk-x{background:transparent;border:0;font-size:19px;cursor:pointer;color:#6b7280;line-height:1}
.pk-body{padding:8px 22px 22px;overflow-y:auto}
.pk-g{font-size:11.5px;font-weight:800;text-transform:uppercase;letter-spacing:.05em;color:#9aa6c0;margin:16px 0 9px}
.pk-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:10px}
.pk-tile{display:flex;flex-direction:column;align-items:center;gap:7px;padding:15px 8px;border:2px solid #e6e9f0;border-radius:12px;background:#fff;cursor:pointer;transition:border-color .12s,background .12s}
.pk-tile:hover{border-color:#8FA9E8;background:#f6f8fc}
.pk-tile.on{border-color:#2B4182;background:#eef3fd}
.pk-lb{font-size:12px;font-weight:600;color:#1C274C;text-align:center;line-height:1.2}
.pk-tile.off{opacity:.4;cursor:not-allowed;background:#f7f8fb;position:relative}
.pk-tile.off:hover{border-color:#e6e9f0;background:#f7f8fb}
.pk-lock{position:absolute;top:6px;right:8px;font-size:12px}
/* mini-preview s\u01A1 \u0111\u1ED3 b\u1ED1 c\u1EE5c trong tile */
/* \xD4 xem tr\u01B0\u1EDBc = slide TH\u1EACT 1280x720 thu nh\u1ECF. Tr\u01B0\u1EDBc \u0111\xE2y l\xE0 s\u01A1 \u0111\u1ED3 v\u1EBD tay (.mp-*): 38 case
   cho 41 b\u1ED1 c\u1EE5c, 3 b\u1ED1 c\u1EE5c r\u01A1i v\xE0o icon chung, v\xE0 kh\xF4ng c\xE1i n\xE0o gi\u1ED1ng th\u1EE9 b\u1EA5m xong s\u1EBD
   nh\u1EADn. Gi\u1EDD nh\xFAng \u0111\xFAng \u0111\u1EA7u ra c\u1EE7a \`renderSlide\`. T\u1EC9 l\u1EC7 76/1280 = .0594 */
.pk-mini{width:76px;height:46px;border-radius:6px;background:#f3f5fa;border:1px solid #e0e5f0;overflow:hidden;flex:none;display:block;position:relative}
.pk-mini>.slide{width:1280px;height:720px;position:absolute;left:0;top:0;transform:scale(.0594);transform-origin:0 0;pointer-events:none;margin:0;border-radius:0}
/* Thumbnail rail tr\xE1i */
/* Preview tr\xE1i \u2014 b\u1EAFt \u0111\u1EA7u D\u01AF\u1EDAI thanh c\xF4ng c\u1EE5 (\`top:0\` th\xEC b\u1ECB thanh che m\u1EA5t thumbnail \u0111\u1EA7u). */
#lp-rail{position:absolute;left:0;top:var(--dk-h-bar,52px);bottom:0;width:150px;z-index:28;
 background:var(--dk-bg);border-right:1px solid var(--dk-border);
 overflow-y:auto;overflow-x:hidden;padding:var(--dk-2) var(--dk-2) 40px;
 display:flex;flex-direction:column;gap:var(--dk-2);scrollbar-width:thin}
#lp-rail::-webkit-scrollbar{width:7px}#lp-rail::-webkit-scrollbar-thumb{background:rgba(255,255,255,.2);border-radius:4px}
.rail-it{position:relative;border-radius:9px;cursor:grab;border:2px solid transparent;background:#0c0e14}
.rail-it.on{border-color:var(--sl-gold)}
.rail-it.drag{opacity:.4}
.rail-thumb{position:relative;width:150px;height:85px;overflow:hidden;border-radius:7px;background:var(--sl-bg2);pointer-events:none}
.rail-thumb>.slide{position:absolute;top:0;left:0;display:block!important;width:1280px;height:720px;
 transform:scale(.1172);transform-origin:top left;background:var(--sl-bg);color:var(--sl-ink);overflow:hidden;box-shadow:none;border-radius:0;animation:none}
.rail-num{position:absolute;left:5px;top:4px;background:rgba(0,0,0,.66);color:#fff;font-size:11px;font-weight:800;padding:1px 7px;border-radius:9px;line-height:1.5}
.rail-del,.rail-dup{position:absolute;top:4px;width:22px;height:22px;border-radius:6px;border:0;color:#fff;font-size:12px;cursor:pointer;opacity:0;transition:opacity .12s;display:flex;align-items:center;justify-content:center;padding:0;line-height:1}
.rail-del{right:5px;background:rgba(192,57,43,.94)}
.rail-dup{right:31px;background:rgba(38,132,252,.94)}
.rail-it:hover .rail-del,.rail-it:hover .rail-dup{opacity:1}
.rail-it.skip{opacity:.5}
.rail-it.skip .rail-thumb{filter:grayscale(1)}
.rail-it.skip .rail-num::after{content:" \xB7\u1EA8N";color:#ff8a80}
/* slide \u1EA9n (skip) \u2014 edit mode hi\u1EC7n m\u1EDD */
#scaler>.slide.active.skipped{opacity:.45}
/* Tr\xECnh chi\u1EBFu (present): \u1EA9n m\u1ECDi c\xF4ng c\u1EE5, slide to\xE0n khung */
.lp-present #lp-rail,.lp-present .dk-toolbar,.lp-present .dk-pop{display:none!important}
.lp-present .stage{left:0!important;right:0!important}

/* \u2550\u2550 L\xE0m \u0111\u1EB9p tr\xECnh s\u1EEDa (P0.4) \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550 */

/* \xD4 t\xECm b\u1ED1 c\u1EE5c trong picker \u2014 38 b\u1ED1 c\u1EE5c th\xEC cu\u1ED9n tay qu\xE1 ch\u1EADm */
.pk-q{flex:1;margin:0 14px;min-width:0;font-family:inherit;font-size:14px;padding:8px 12px;
 border:1px solid #d8dee9;border-radius:9px;background:#f7f9fc;color:#1C274C;outline:none}
.pk-q:focus{border-color:var(--sl-blue,#2684fc);background:#fff;
 box-shadow:0 0 0 3px rgba(38,132,252,.14)}
.pk-q::placeholder{color:#9aa6c0}
.pk-none{padding:34px 22px;text-align:center;color:#8894ab;font-size:14px}
/* \`.pk-tile{display:flex}\` \u0110\xC8 thu\u1ED9c t\xEDnh \`hidden\` (display m\u1EB7c \u0111\u1ECBnh c\u1EE7a hidden ch\u1EC9 l\xE0
   \`display:none\` \u1EDF t\u1EA7ng user-agent) \u2192 l\u1ECDc xong \xF4 v\u1EABn hi\u1EC7n. Ph\u1EA3i ch\u1EB7n t\u01B0\u1EDDng minh. */
.pk-tile[hidden],.pk-grid[hidden],.pk-g[hidden],.pk-none[hidden]{display:none!important}
/* Ti\xEAu \u0111\u1EC1 nh\xF3m D\xCDNH khi cu\u1ED9n \u2014 cu\u1ED9n gi\u1EEFa danh s\xE1ch d\xE0i v\u1EABn bi\u1EBFt \u0111ang \u1EDF nh\xF3m n\xE0o */
.pk-g{position:sticky;top:0;z-index:2;background:#fff}
/* \xD4 \u0111ang r\xEA chu\u1ED9t: n\u1ED5i l\xEAn \u0111\u1EC3 bi\u1EBFt m\xECnh \u0111ang xem tr\u01B0\u1EDBc b\u1ED1 c\u1EE5c n\xE0o */
.pk-tile:not([disabled]):hover{border-color:var(--sl-blue,#2684fc);
 box-shadow:0 6px 18px rgba(38,132,252,.18);transform:translateY(-1px)}
.pk-tile{transition:transform .12s,box-shadow .12s,border-color .12s}
/* Slide \u0111ang \u0111\u01B0\u1EE3c XEM TR\u01AF\u1EDAC (r\xEA chu\u1ED9t \u1EDF picker) \u2014 vi\u1EC1n nh\u1EA5n cho bi\u1EBFt ch\u01B0a ch\u1ED1t */

/* Console ph\u1EA3i: chia nh\xF3m c\xF3 ti\xEAu \u0111\u1EC1, n\xFAt nguy hi\u1EC3m t\xE1ch xu\u1ED1ng cu\u1ED1i */

 text-transform:uppercase;color:#6c7893;padding-bottom:6px;border-bottom:1px solid rgba(255,255,255,.07)}

/* D\u1EA5u th\u1EDDi gian l\u01B0u \u2014 thay cho ch\u1EEF nh\u1EA5p nh\xE1y kh\xF4ng r\xF5 \u0111\xE3 l\u01B0u l\xFAc n\xE0o */

/* L\u01AFU H\u1ECENG ph\u1EA3i N\u1ED4I B\u1EACT: gi\xE1o vi\xEAn b\u1ECF l\u1EE1 d\xF2ng n\xE0y l\xE0 g\xF5 ti\u1EBFp r\u1ED3i m\u1EA5t tr\u1EAFng c\xF4ng. */


/* T\xF4n tr\u1ECDng ng\u01B0\u1EDDi d\xF9ng t\u1EAFt hi\u1EC7u \u1EE9ng chuy\u1EC3n \u0111\u1ED9ng */
@media (prefers-reduced-motion:reduce){
  .pk-tile,.rail-it,.rail-del,.rail-dup{transition:none}
  #scaler>.slide.active{animation:none}
}

/* \xD4 b\u1ED1 c\u1EE5c \u0110\u1ED4I \u0110\u01AF\u1EE2C nh\u01B0ng ch\u1EEF h\u01A1i d\xE0i \u2014 c\u1EA3nh b\xE1o V\xC0NG, kh\xE1c h\u1EB3n \xF4 kho\xE1 (m\u1EDD + \u{1F512}).
   V\u1EABn b\u1EA5m \u0111\u01B0\u1EE3c: GV c\xF3 th\u1EC3 \u0111\u1ECBnh r\xFAt g\u1ECDn ch\u1EEF ngay sau khi \u0111\u1ED5i. */
.pk-tile.tight{border-color:#e8b339;background:#fffdf5}
.pk-tile.tight:hover{border-color:#d99b1f;background:#fff9e8}
.pk-tight{position:absolute;top:6px;right:8px;font-size:9.5px;font-weight:800;
 background:#e8b339;color:#4a3608;padding:1px 5px;border-radius:5px;line-height:1.5}
.pk-tile{position:relative}

/* \u2550\u2550 Thanh c\xF4ng c\u1EE5 TR\xCAN + preview TR\xC1I (thay 3 c\u1ED9t c\u0169) \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550
   Slide r\u1ED9ng 682px thay v\xEC 406px tr\xEAn c\xF9ng m\u1ED9t panel \u2014 g\u1EA5p 1,7 l\u1EA7n. */
.lp-edit .stage{left:150px;right:0;top:var(--dk-h-bar,52px)}
.dk-toolbar{position:absolute;left:0;right:0;top:0;height:var(--dk-h-bar,52px);z-index:30;
 display:flex;align-items:center;gap:var(--dk-3);padding:0 var(--dk-3);
 background:var(--dk-bg);border-bottom:1px solid var(--dk-border);
 font-family:var(--dk-font);color:var(--dk-fg);font-size:13px;
 overflow-x:auto;overflow-y:visible;scrollbar-width:thin}
/* Nh\xF3m n\xFAt, ng\u0103n b\u1EB1ng v\u1EA1ch d\u1ECDc \u2014 m\u1EAFt ph\xE2n bi\u1EC7t \u0111\u01B0\u1EE3c "l\u01B0u" / "thu\u1ED9c t\xEDnh" / "thao t\xE1c" */
.dk-grp{display:flex;align-items:center;gap:var(--dk-1);flex:none;
 padding-right:var(--dk-3);border-right:1px solid var(--dk-border)}
.dk-grp:last-child{border-right:0;padding-right:0}
.dk-grp.dk-right{margin-left:auto}

.dk-btn{display:inline-flex;align-items:center;gap:6px;height:var(--dk-h-sm);
 padding:0 10px;border:1px solid transparent;border-radius:var(--dk-r);
 background:transparent;color:var(--dk-fg);font:inherit;font-weight:600;cursor:pointer;
 white-space:nowrap;transition:background .12s,border-color .12s}
/* N\xFAt \u0111\u1ECBnh d\u1EA1ng ch\u1EEF: nh\xE3n l\xE0 CH\u1EEE (B/I/x\xB2/x\u2082) ch\u1EE9 kh\xF4ng ph\u1EA3i icon \u2014 quy \u01B0\u1EDBc ai c\u0169ng \u0111\u1ECDc \u0111\u01B0\u1EE3c.
   C\u1EE1 c\u1ED1 \u0111\u1ECBnh cho 4 n\xFAt b\u1EB1ng nhau, ch\u1EEF \u1EDF gi\u1EEFa. */
.dk-fmt{min-width:34px;justify-content:center;font-family:Georgia,"Times New Roman",serif;font-size:15px}
.dk-fmt b{font-weight:800}
.dk-fmt i{font-style:italic}
/* \u0110\u1EA9y sup/sub xa h\u01A1n m\u1EB7c \u0111\u1ECBnh: \u1EDF c\u1EE1 n\xFAt nh\u1ECF, \`vertical-align:super|sub\` g\u1ED1c l\u1EC7ch qu\xE1 \xEDt
   n\xEAn hai n\xFAt x\xB2 v\xE0 x\u2082 nh\xECn GI\u1ED0NG H\u1EC6T nhau (\u0111\xE3 th\u1EA5y tr\xEAn \u1EA3nh ch\u1EE5p). */
/* D\u1ECBch sup/sub b\u1EB1ng \`position:relative\` + \`top\` \u2014 \`vertical-align\` g\u1ED1c l\u1EC7ch qu\xE1 \xEDt n\xEAn trong
   n\xFAt nh\u1ECF (flex, c\u0103n gi\u1EEFa) hai n\xFAt x\xB2 v\xE0 x\u2082 nh\xECn GI\u1ED0NG H\u1EC6T nhau. \u0110\xE3 ki\u1EC3m b\u1EB1ng \u1EA3nh ch\u1EE5p. */
.dk-fmt sup,.dk-fmt sub{font-size:11px;font-weight:700;position:relative;vertical-align:baseline}
.dk-fmt sup{top:-5px}
.dk-fmt sub{top:4px}
/* \xD4 m\xE0u t\u1EF1 do d\u01B0\u1EDBi 7 swatch g\u1EE3i \xFD */
.dk-pick{display:flex;align-items:center;gap:8px;margin-top:8px;padding-top:8px;
 border-top:1px solid var(--dk-border);font-size:12.5px;color:var(--dk-fg-2);cursor:pointer}
.dk-pick input[type=color]{width:30px;height:24px;padding:0;border:1px solid var(--dk-border);
 border-radius:6px;background:none;cursor:pointer}
.dk-btn:hover{background:var(--dk-bg-3)}
.dk-btn:focus-visible{outline:none;box-shadow:var(--dk-ring)}
.dk-btn[disabled]{opacity:.4;cursor:not-allowed}
.dk-btn.primary{background:var(--dk-accent);color:var(--dk-accent-fg);border-color:transparent}
.dk-btn.primary:hover{filter:brightness(1.06)}
.dk-btn.danger{color:var(--dk-danger)}
.dk-btn.danger:hover{background:var(--dk-danger-bg)}
.dk-btn.danger-ghost{color:var(--dk-fg-2)}
.dk-btn.ghost{color:var(--dk-fg-2);padding:0 8px}
.dk-caret{opacity:.5;margin-left:-2px}
.dk-lb{line-height:1}
/* Panel h\u1EB9p: gi\u1EA5u ch\u1EEF, gi\u1EEF icon. D\xF9ng CONTAINER QUERY ch\u1EE9 kh\xF4ng \`@media\` \u2014 media \u0111o
   C\u1EECA S\u1ED4, m\xE0 deck n\u1EB1m trong panel h\u1EB9p gi\u1EEFa m\xE0n h\xECnh r\u1ED9ng th\xEC \u0111o c\u1EEDa s\u1ED5 l\xE0 sai h\u1EB3n
   (m\xE0n 1920 nh\u01B0ng panel ch\u1EC9 730px v\u1EABn ph\u1EA3i r\xFAt g\u1ECDn). */
.dk-toolbar{container-type:inline-size;container-name:dktb}
/* V\u1EEBa: \u0111\u1EE7 ch\u1ED7 cho m\u1ECDi nh\xE3n */
@container dktb (max-width:980px){
  /* Nh\xE3n c\u1EE7a nh\xF3m THAO T\xC1C r\xFAt tr\u01B0\u1EDBc \u2014 icon c\xE1c n\xFAt n\xE0y (\uFF0B \u29C9 \u{1F441} \u{1F5D1}) \u0111\xE3 \u0111\u1EE7 r\xF5 ngh\u0129a,
     trong khi "B\u1ED1 c\u1EE5c"/"M\xE0u"/"Ghi ch\xFA" m\u1EA5t ch\u1EEF l\xE0 kh\xF3 \u0111o\xE1n h\u01A1n nhi\u1EC1u. */
  #dk-add .dk-lb,#dk-dup .dk-lb,#dk-skip .dk-lb,#dk-del .dk-lb,#dk-present .dk-lb{display:none}
}
@container dktb (max-width:720px){
  .dk-btn .dk-lb{display:none}
  .dk-btn#dk-layout .dk-lb{display:inline}   /* tr\u1EEB t\xEAn b\u1ED1 c\u1EE5c: \u0111\xF3 l\xE0 TH\xD4NG TIN, kh\xF4ng ph\u1EA3i nh\xE3n n\xFAt */
  .dk-pos{display:none}
}
/* Tr\xECnh duy\u1EC7t ch\u01B0a c\xF3 container query \u2192 l\xF9i v\u1EC1 \u0111o c\u1EEDa s\u1ED5 (v\u1EABn h\u01A1n kh\xF4ng c\xF3 g\xEC) */
@supports not (container-type: inline-size){
  @media (max-width:900px){ .dk-btn .dk-lb{display:none} .dk-btn#dk-layout .dk-lb{display:inline} }
}

.dk-status{font-size:12px;color:var(--dk-fg-2);white-space:nowrap;padding-left:var(--dk-2)}
.dk-status.ed-saved{color:var(--dk-ok);font-weight:700}
.dk-status.ed-dirty{color:var(--dk-warn)}
.dk-status.ed-error{color:#fff;font-weight:800;background:#c0392b;padding:3px 10px;border-radius:var(--dk-r-sm)}
.dk-pos{font-size:12px;color:var(--dk-fg-2);font-variant-numeric:tabular-nums;padding:0 var(--dk-2)}
.dk-pos-sep{opacity:.45;margin:0 2px}

/* Popover \u2014 CSS thu\u1EA7n, kh\xF4ng Radix (gi\u1EEF t\xEDnh \u0111\u1ED9c l\u1EADp cho Angular) */
.dk-pop{position:absolute;z-index:40;min-width:210px;max-width:min(360px,90vw);
 background:var(--dk-bg-2);border:1px solid var(--dk-border-2);border-radius:var(--dk-r-md);
 box-shadow:var(--dk-shadow-lg);padding:var(--dk-3);display:flex;flex-direction:column;gap:var(--dk-2)}
.dk-pop-t{font-size:11px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;color:var(--dk-fg-3)}
.dk-pop-hint{font-size:11.5px;color:var(--dk-fg-2);line-height:1.45}
.dk-sw{display:flex;flex-wrap:wrap;gap:var(--dk-2)}
.dk-swatch{width:28px;height:28px;border-radius:var(--dk-r-sm);border:2px solid transparent;
 cursor:pointer;padding:0;box-shadow:0 2px 6px rgba(0,0,0,.35)}
.dk-swatch.on{border-color:#fff;box-shadow:0 0 0 2px var(--dk-accent)}
.dk-swatch.reset{background:var(--dk-bg-3);color:var(--dk-fg-2);display:flex;
 align-items:center;justify-content:center;font-size:13px}
.dk-ta{width:100%;background:var(--dk-bg);color:var(--dk-fg);border:1px solid var(--dk-border-2);
 border-radius:var(--dk-r);padding:8px 10px;font:inherit;font-size:12.5px;line-height:1.5;resize:vertical}
.dk-ta:focus{outline:none;border-color:var(--dk-accent);box-shadow:var(--dk-ring)}
.dk-w{width:100%;justify-content:center}

/* \`flex:none\` \u2014 thi\u1EBFu l\xE0 flex-column \xC9P thumbnail co l\u1EA1i r\u1ED3i tr\xE0n kh\u1ECFi m\xE0n h\xECnh
   (\u0111\xE3 g\u1EB7p th\u1EADt: thumbnail th\u1EE9 10 l\xF2i ra ngo\xE0i, kh\xF4ng cu\u1ED9n t\u1EDBi \u0111\u01B0\u1EE3c). */
.rail-it{flex:none;aspect-ratio:16/9}
.rail-thumb{width:100%;height:100%}
.rail-dup,.rail-del{display:flex;align-items:center;justify-content:center;font-size:11px}

/* V\xF9ng slide ph\u1EA3i TR\u1EEA \u0111\xFAng chi\u1EC1u cao thanh c\xF4ng c\u1EE5, kh\xF4ng th\xEC slide l\u1EC7ch xu\u1ED1ng d\u01B0\u1EDBi
   (thanh chi\u1EBFm 52px m\xE0 \`.stage\` v\u1EABn t\xEDnh t\u1EEB \u0111\u1EC9nh). */
.lp-edit .stage{top:var(--dk-h-bar,52px);height:auto;bottom:0}
/* Thanh \u0111i\u1EC1u h\u01B0\u1EDBng c\u0169 (\u2039 \u203A \u26F6) tr\xF9ng ch\u1EE9c n\u0103ng v\u1EDBi thumbnail + thanh c\xF4ng c\u1EE5 \u2192 \u1EA9n khi S\u1EECA,
   gi\u1EEF nguy\xEAn khi ch\u1EC9 XEM. */
.lp-edit .nav,.lp-edit #sprog{display:none}
/* Thanh c\xF4ng c\u1EE5 h\u1EB9p: cho cu\u1ED9n ngang v\xE0 gi\u1EEF nh\xF3m cu\u1ED1i lu\xF4n th\u1EA5y \u0111\u01B0\u1EE3c */
.dk-toolbar{scroll-padding-right:var(--dk-3)}
.dk-toolbar::-webkit-scrollbar{height:6px}
.dk-toolbar::-webkit-scrollbar-thumb{background:var(--dk-border-2);border-radius:3px}

/* Ph\u1EA3i \u0111\u1EB7t SAU lu\u1EADt \`.dk-toolbar\` \u2014 c\xF9ng \u0111\u1ED9 \u01B0u ti\xEAn th\xEC lu\u1EADt \u0111\u1EE9ng sau th\u1EAFng, \u0111\u1EC3 tr\u01B0\u1EDBc
   l\xE0 n\u1EC1n c\u1EA3nh b\xE1o kh\xF4ng bao gi\u1EDD hi\u1EC7n (\u0111\xE3 v\u1EA5p: test \u0111\u1ECF m\xE0 m\u1EAFt th\u01B0\u1EDDng kh\xF4ng nh\u1EADn ra). */
.dk-toolbar:has(.ed-error){background:var(--dk-danger-bg);border-bottom-color:#7a3030}

/* Ti\xEAu \u0111\u1EC1 nh\xF3m trong rail \u2014 suy t\u1EEB slide \`section\`/\`hero\` (m\u1ED1c m\u1EDF \u0111\u1EA7u m\u1ED7i ti\u1EBFt).
   D\xEDnh tr\xEAn \u0111\u1EA7u khi cu\u1ED9n: b\xE0i 156 slide th\xEC ph\u1EA3i lu\xF4n bi\u1EBFt \u0111ang \u1EDF ti\u1EBFt n\xE0o. */
.rail-g{position:sticky;top:-4px;z-index:2;font-size:10.5px;font-weight:800;letter-spacing:.04em;
  text-transform:uppercase;color:#9aa6c0;background:var(--dk-bg);padding:7px 4px 5px;
  border-bottom:1px solid var(--dk-border);margin:6px 0 0;
  overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.rail-g:first-child{margin-top:0}
.rail-it[hidden],.rail-g[hidden]{display:none}
/* Tu\u1EF3 ch\u1ECDn trong popover l\u1ECDc */
.dk-fopt{display:block;width:100%;text-align:left;background:none;border:0;border-radius:7px;
  padding:7px 9px;cursor:pointer;color:inherit}
.dk-fopt:hover{background:var(--dk-hover,rgba(255,255,255,.07))}
.dk-fopt.on{background:var(--dk-accent);color:#111}
.dk-fopt b{display:block;font-size:12.5px;font-weight:700}
.dk-fopt span{display:block;font-size:11px;opacity:.7}
.dk-btn.on{background:var(--dk-accent);color:#111}
/* C\u1EA3nh b\xE1o t\u01B0\u01A1ng ph\u1EA3n trong popover m\xE0u \u2014 C\u1EA2NH B\xC1O, kh\xF4ng ch\u1EB7n: m\xE0u nh\u1EA5n c\xF3 l\xFAc ch\u1EC9 \u0111\u1EC3
   trang tr\xED, ch\u1EB7n l\xE0 ph\u1EE7 nh\u1EADn ph\xE1n \u0111o\xE1n c\u1EE7a gi\xE1o vi\xEAn. */
.dk-warn{margin-top:8px;padding:7px 9px;border-radius:7px;font-size:11.5px;line-height:1.45;
  background:#3a2d10;color:#f6d98a;border:1px solid #6b5320}
.dk-warn[hidden]{display:none}
`;var Je=`/* \u2550\u2550 IN / L\u01AFU PDF \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550
   Ch\u1EC9 n\u1EA1p v\xE0o file HTML t\u1EF1 ch\u1EE9a (\`toStandaloneHtml\`) \u2014 KH\xD4NG n\u1EA1p trong app.
   V\xEC sao: panel Slide n\u1EB1m l\u1ECDt gi\u1EEFa giao di\u1EC7n app; in t\u1EEB \u0111\xF3 th\xEC tr\xECnh duy\u1EC7t k\xE9o theo c\u1EA3
   sidebar, thanh c\xF4ng c\u1EE5, menu. B\u1EA3n HTML t\u1EF1 ch\u1EE9a ch\u1EC9 c\xF3 deck n\xEAn in ra \u0111\xFAng th\u1EE9 GV mu\u1ED1n.

   Tr\xEAn m\xE0n h\xECnh, 46 b\u1ED1 c\u1EE5c x\u1EBFp CH\u1ED2NG l\xEAn nhau: \`#scaler>.slide{position:absolute;inset:0;
   display:none}\` v\xE0 ch\u1EC9 \`.active\` m\u1EDBi \`display:block\`. In th\u1EB3ng ra \u0111\u01B0\u1EE3c \u0110\xDANG M\u1ED8T slide.
   N\xEAn kh\u1ED1i \`@media print\` d\u01B0\u1EDBi \u0111\xE2y ph\u1EA3i th\xE1o c\u1EA3 ba th\u1EE9: ch\u1ED3ng l\u1EDBp, \u1EA9n/hi\u1EC7n, v\xE0
   \`transform:scale()\` m\xE0 player \u0111\u1EB7t l\xEAn \`#scaler\` \u0111\u1EC3 v\u1EEBa khung tr\xECnh duy\u1EC7t.

   KH\xD4NG d\xF9ng \`transform:scale\` \u0111\u1EC3 \xE9p slide v\u1EEBa kh\u1ED5 gi\u1EA5y: c\xF9ng l\xFD do \u0111\xE3 ghi \u1EDF \`--dk-fs\`
   trong base.css \u2014 n\xF3 l\xE0m h\u1ED9p bao l\u1EC7ch c\u1EE1 ch\u1EEF. \u1EDE \u0111\xE2y d\xF9ng \`@page{size:landscape}\` + k\xEDch
   th\u01B0\u1EDBc th\u1EADt, \u0111\u1EC3 tr\xECnh duy\u1EC7t t\u1EF1 thu cho v\u1EEBa m\xE9p gi\u1EA5y. */
@media print {
  /* Kh\u1ED5 \u0111\xFAng b\u1EB1ng slide, l\u1EC1 0 \u2014 slide 16:9 t\u1EF1 n\xF3 \u0111\xE3 c\xF3 l\u1EC1 trong (\`--pad\`), th\xEAm l\u1EC1 gi\u1EA5y l\xE0
     th\u1EEBa v\xE0 l\xE0m slide co l\u1EA1i gi\u1EEFa trang tr\u1EAFng.

     \u26A0\uFE0F KH\xD4NG th\xEAm t\u1EEB kho\xE1 \`landscape\` sau k\xEDch th\u01B0\u1EDBc. \`size: <length> <length> landscape\` l\xE0
     CSS SAI: \`landscape\` ch\u1EC9 \u0111i k\xE8m kh\u1ED5 C\xD3 T\xCAN (A4, Letter\u2026). Chrome b\u1ECF nguy\xEAn khai b\xE1o r\u1ED3i
     r\u01A1i v\u1EC1 Letter D\u1ECCC \u2014 \u0111o \u0111\u01B0\u1EE3c 612\xD7792pt, slide b\u1ECB c\u1EAFt m\u1EA5t n\u1EEDa. Ghi k\xEDch th\u01B0\u1EDBc t\u01B0\u1EDDng minh
     l\xE0 \u0111\xE3 ngang r\u1ED3i (1280>720). \u0110o sau khi s\u1EEDa: 960\xD7540pt = \u0111\xFAng 1280\xD7720px \u1EDF 72dpi. */
  @page { size: 1280px 720px; margin: 0; }

  html, body { width: auto; height: auto; overflow: visible; background: #fff; }

  /* N\u1EC1n t\u1ED1i c\u1EE7a khung deck (radial-gradient) t\u1ED1n m\u1EF1c m\xE0 kh\xF4ng mang th\xF4ng tin.

     \`!important\` \u1EDF \`height\`/\`overflow\` l\xE0 B\u1EAET BU\u1ED8C, kh\xF4ng ph\u1EA3i cho ti\u1EC7n: app ch\u1EE7 nh\xE0 \u0111\u1EB7t
     k\xEDch th\u01B0\u1EDBc khung b\u1EB1ng style INLINE (\`<div id="deck" style="height:100vh">\`) v\xE0 \`mountDeck\`
     t\u1EF1 th\xEAm \`overflow:hidden\` c\u0169ng inline. Inline th\u1EAFng m\u1ECDi selector, n\xEAn kh\xF4ng c\xF3
     \`!important\` th\xEC khung v\u1EABn cao 900px trong khi c\xE1c slide x\u1EBFp d\u1ECDc t\u1EDBi 6480px \u21D2 b\u1ECB C\u1EAET c\xF2n
     **\u0111\xFAng 1 trang**. \u0110\xE3 \u0111o: 1 trang thay v\xEC 9. */
  .dk-root {
    height: auto !important; overflow: visible !important;
    background: #fff;
    position: static;
  }

  /* Th\xE1o l\u1EDBp c\u0103n gi\u1EEFa + th\xE1o scale c\u1EE7a player. \`!important\` l\xE0 c\u1EA7n thi\u1EBFt \u1EDF \u0111\xE2y: \`transform\`
     do JS \u0111\u1EB7t inline (\`sc.style.transform\`), specificity th\u01B0\u1EDDng kh\xF4ng th\u1EAFng \u0111\u01B0\u1EE3c. */
  .stage { position: static; display: block; }
  .scaler {
    width: auto !important; height: auto !important;
    transform: none !important;
  }

  /* M\u1ED6I SLIDE M\u1ED8T TRANG. \u0110\xE2y l\xE0 ph\u1EA7n ch\xEDnh:
       \u2022 absolute \u2192 RELATIVE: th\xF4i ch\u1ED3ng l\xEAn nhau nh\u01B0ng V\u1EAAN l\xE0 containing block
       \u2022 display:block cho M\u1ECCI slide, k\u1EC3 c\u1EA3 kh\xF4ng .active
       \u2022 break-after: m\u1ED7i slide chi\u1EBFm tr\u1ECDn m\u1ED9t trang gi\u1EA5y
       \u2022 break-inside:avoid: c\u1EA5m c\u1EAFt \u0111\xF4i m\u1ED9t slide qua hai trang

     \u26A0\uFE0F PH\u1EA2I l\xE0 \`relative\`, KH\xD4NG \u0111\u01B0\u1EE3c \`static\`. 37 lu\u1EADt trong \`base.css\` d\xF9ng
     \`position:absolute\` (\`.hd\`, \`.hero .msg\`, \`.foot\`\u2026) v\xE0 neo v\xE0o \`.slide\` v\xEC slide v\u1ED1n
     \`absolute\`. \u0110\u1ED5i slide th\xE0nh \`static\` l\xE0 **xo\xE1 containing block** \u21D2 ch\xFAng nh\u1EA3y l\xEAn neo v\xE0o
     \`#scaler\` \u21D2 ti\xEAu \u0111\u1EC1 c\u1EE7a C\u1EA2 9 SLIDE ch\u1ED3ng l\xEAn nhau \u1EDF \u0111\u1EA7u trang 1. \u0110\xE3 in ra gi\u1EA5y th\u1EA5y t\u1EADn
     m\u1EAFt; \`relative\` v\u1EEBa v\xE0o \u0111\u01B0\u1EE3c lu\u1ED3ng th\u01B0\u1EDDng v\u1EEBa gi\u1EEF nguy\xEAn m\u1ED1c neo. */
  #scaler > .slide {
    position: relative !important;
    display: block !important;
    width: 1280px; height: 720px;
    margin: 0;
    border-radius: 0;
    box-shadow: none;
    break-inside: avoid; page-break-inside: avoid;
    break-after: page;  page-break-after: always;
    /* B\u1ECF hi\u1EC7u \u1EE9ng chuy\u1EC3n \u2014 animation l\xFAc in cho ra slide m\u1EDD ho\u1EB7c l\u1EC7ch. */
    animation: none !important;
  }
  #scaler > .slide:last-child { break-after: auto; page-break-after: auto; }

  /* Slide GV \u0111\xE3 t\u1EAFt (b\u1ECF qua) th\xEC kh\xF4ng in ra gi\u1EA5y \u2014 c\xF9ng ngh\u0129a v\u1EDBi l\xFAc tr\xECnh chi\u1EBFu. */
  #scaler > .slide.skipped { display: none !important; }

  /* N\u1EC1n m\xE0u/\u1EA3nh c\u1EE7a slide PH\u1EA2I \u0111\u01B0\u1EE3c in. M\u1EB7c \u0111\u1ECBnh tr\xECnh duy\u1EC7t b\u1ECF n\u1EC1n \u0111\u1EC3 ti\u1EBFt ki\u1EC7m m\u1EF1c, m\xE0
     slide t\u1ED1i (\`.dk-dark\`) m\u1EA5t n\u1EC1n th\xEC th\xE0nh ch\u1EEF tr\u1EAFng tr\xEAn gi\u1EA5y tr\u1EAFng \u2014 kh\xF4ng \u0111\u1ECDc \u0111\u01B0\u1EE3c g\xEC. */
  #scaler > .slide, #scaler > .slide * {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  /* \u0110i\u1EC1u khi\u1EC3n ch\u1EC9 c\xF3 ngh\u0129a tr\xEAn m\xE0n h\xECnh. T\xEAn l\u1EA5y t\u1EEB \`renderStage\`/\`renderEditChrome\`:
     nav + thanh ti\u1EBFn \u0111\u1ED9, v\xE0 chrome c\u1EE7a tr\xECnh s\u1EEDa n\u1EBFu ai \u0111\xF3 in l\xFAc \u0111ang b\u1EADt \`edit\`. */
  .nav, #sprog, .dk-toolbar, #lp-rail, #lp-picker { display: none !important; }
}
`;var Xe=Ve,Qe=Ze+Ye,et=Je;function oe(e,t){let n=Be[e.kind]?e.kind:"content",i=Be[n],r=De[n]?`slide ${De[n]}`:"slide chrome dots",o=(t.pos??t.idx)===0?" active":"",l=t.edit&&e.imagePrompt?'<span class="edregen" hidden></span>':"",s=t.isNew?' data-new="1"':"",p=e.skipped?" skipped":"",a=e.accent?` style="--sl-gold:${e.accent};--sl-rail:${e.accent}"`:"",c=e.notes?` data-notes="${u(e.notes)}"`:"",h=(e.title||e.subtitle||A(e.bullets)[0]||n).trim(),x=h?` data-title="${u(h.slice(0,180))}"`:"",v=e.columns||[],C=` data-nb="${A(e.bullets).length}" data-nc="${v.length}" data-nct="${v.filter(D=>D?.title).length}" data-nf="${(e.images||[]).length+(e.image?1:0)}"`,m=e.locked?' data-locked="1"':"",L=wn(e.title),T=L>1?` data-tt="${L}"`:"";return`<section class="${r}${o}${p}" data-index="${t.idx}" data-id="${u(e.id)}" data-kind="${u(n)}"${s}${a}${c}${x}${C}${m}${T}>${l}${i(e,t)}</section>`}function wn(e){let t=(e||"").trim().length;return t<=46?1:t<=92?2:3}function Ne(e,t={}){let n=O(e),i=n.slides.length,r=n.slides.map((o,l)=>oe(o,{idx:l,pos:l,edit:t.edit,assets:n.assets,kicker:o.kicker||"",foot:t.foot??n.foot??"",page:l+1,total:i}));return r.length||r.push('<section class="slide chrome active" data-index="0"><div class="hd"><div class="ttl">Ch\u01B0a c\xF3 slide</div></div></section>'),r.join("")}function En(){return'<div id="dk-toolbar" class="dk-toolbar"></div><aside id="lp-rail"></aside>'}function le(e,t={}){let n=O(e),{w:i,h:r}=n.size||Te;return(t.edit?En():"")+`<div class="stage"><div class="scaler" id="scaler" data-tr="${u(n.transition)}" style="width:${i}px;height:${r}px">${Ne(n,t)}</div></div><div class="nav"><button id="prev">\u2039</button><span class="counter" id="cnt">1 / 1</span><button id="next">\u203A</button><button id="fs">\u26F6</button></div><div id="sprog"></div>`}function se(e,t={}){return`@layer deck-kit {
${Xe+ge(e.theme||Y,".dk-root")+(t.edit?Qe:"")}
}
${et}`}function ae(e,t={}){let n=t.w||1280,i=t.h||720,r=M=>e.querySelector(M),o=r("#scaler"),l=[],s=0,p=()=>{l=Array.from(e.querySelectorAll("#scaler > .slide"))};function a(){if(!o)return;let I=r(".stage")?.getBoundingClientRect(),b=I?.width||0,y=I?.height||0;if(b<2||y<2){let w=t.reserve?t.reserve():(r("#lp-rail")?.offsetWidth||0)+(r("#lp-side")?.offsetWidth||0);b=innerWidth-w,y=innerHeight}let $=Math.min((b-48)/n,(y-96)/i);$>0&&(o.style.transform=`scale(${$})`)}function c(M){if(!l.length)return;s=Math.max(0,Math.min(l.length-1,M)),l.forEach((y,$)=>y.classList.toggle("active",$===s));let I=r("#cnt");I&&(I.textContent=`${s+1} / ${l.length}`);let b=r("#sprog");b&&(b.style.width=`${(s+1)/l.length*100}%`),t.onSlideChange?.(s,l.length)}function h(){let M=e instanceof Document?e.documentElement:e;document.fullscreenElement?document.exitFullscreen():M.requestFullscreen?.()}let x=()=>a(),v=M=>{M.key==="ArrowRight"||M.key==="PageDown"||M.key===" "?(c(s+1),M.preventDefault()):M.key==="ArrowLeft"||M.key==="PageUp"?(c(s-1),M.preventDefault()):M.key==="Home"?c(0):M.key==="End"?c(l.length-1):(M.key==="f"||M.key==="F")&&h()};addEventListener("resize",x);let C=null,m=r(".stage");m&&typeof ResizeObserver<"u"&&(C=new ResizeObserver(()=>a()),C.observe(m)),t.keyboard!==!1&&addEventListener("keydown",v);let L=r("#prev"),T=r("#next"),D=r("#fs"),F=()=>c(s-1),H=()=>c(s+1);return L?.addEventListener("click",F),T?.addEventListener("click",H),D?.addEventListener("click",h),p(),a(),c(0),{show:c,next:H,prev:F,cur:()=>s,count:()=>l.length,fit:a,fullscreen:h,refresh(){p(),s>=l.length&&(s=l.length-1),c(s)},destroy(){removeEventListener("resize",x),C?.disconnect(),C=null,removeEventListener("keydown",v),L?.removeEventListener("click",F),T?.removeEventListener("click",H),D?.removeEventListener("click",h)}}}function tt(e=1280,t=720){let n=ae(document,{w:e,h:t});addEventListener("message",i=>{let r=i.data||{};typeof r.lpGoto=="number"&&n.show(r.lpGoto)});try{parent.postMessage({lpReady:!0,count:n.count()},"*")}catch{}return window.__deck={show:n.show,fit:n.fit,cur:n.cur,refresh:n.refresh},n}var de=[{key:"content",label:"N\u1ED9i dung",group:"C\u01A1 b\u1EA3n",shape:"list",selectable:!0,renders:["title","bullets","image"]},{key:"twocol",label:"Hai c\u1ED9t",group:"C\u01A1 b\u1EA3n",shape:"list",selectable:!0,needs:{bullets:3},renders:["title","bullets"]},{key:"cards",label:"Th\u1EBB l\u01B0\u1EDBi",group:"C\u01A1 b\u1EA3n",shape:"list",selectable:!0,needs:{bullets:2},fits:{bullet:60,bulletCount:6},renders:["title","bullets"]},{key:"numbered",label:"\u0110\xE1nh s\u1ED1",group:"C\u01A1 b\u1EA3n",shape:"list",selectable:!0,needs:{bullets:1},renders:["title","bullets"]},{key:"checklist",label:"Danh s\xE1ch \u2713",group:"C\u01A1 b\u1EA3n",shape:"list",selectable:!0,needs:{bullets:1},renders:["title","bullets"]},{key:"toc",label:"M\u1EE5c l\u1EE5c",group:"C\u01A1 b\u1EA3n",shape:"list",selectable:!0,needs:{bullets:1},renders:["title","bullets"]},{key:"agenda",label:"M\u1EE5c l\u1EE5c c\xF3 m\u1ED1c",group:"C\u01A1 b\u1EA3n",shape:"list",selectable:!0,needs:{bullets:2},renders:["title","bullets"]},{key:"blank",label:"Khung tr\u1EAFng",group:"C\u01A1 b\u1EA3n",shape:"list",selectable:!0,renders:["title","bullets"]},{key:"goals",label:"M\u1EE5c ti\xEAu",group:"C\u01A1 b\u1EA3n",shape:"list",selectable:!0,renders:["title","bullets"]},{key:"remember",label:"Ghi nh\u1EDB",group:"C\u01A1 b\u1EA3n",shape:"list",selectable:!0,renders:["title","bullets"]},{key:"define",label:"\u0110\u1ECBnh ngh\u0129a",group:"Nh\u1EA5n m\u1EA1nh",shape:"list",selectable:!0,renders:["title","bullets"]},{key:"example",label:"V\xED d\u1EE5",group:"Nh\u1EA5n m\u1EA1nh",shape:"list",selectable:!0,renders:["title","bullets"]},{key:"defcard",label:"Th\u1EBB \u0111\u1ECBnh ngh\u0129a",group:"Nh\u1EA5n m\u1EA1nh",shape:"list",selectable:!0,needs:{bullets:1},renders:["title","bullets"]},{key:"bignum",label:"S\u1ED1 l\u1EDBn",group:"S\u1ED1 li\u1EC7u",shape:"columns",selectable:!0,needs:{columnsWithTitle:1},maxColumns:3,fits:{title:60,colTitle:18},renders:["title","columns"]},{key:"metrics",label:"Th\u1EBB s\u1ED1",group:"S\u1ED1 li\u1EC7u",shape:"columns",selectable:!0,needs:{columnsWithTitle:2},maxColumns:4,fits:{title:60,colTitle:22},renders:["title","columns"]},{key:"kpirow",label:"D\xE3y ch\u1EC9 s\u1ED1",group:"S\u1ED1 li\u1EC7u",shape:"columns",selectable:!0,needs:{columnsWithTitle:2},maxColumns:4,fits:{title:60,colTitle:18},renders:["title","columns"]},{key:"three",label:"Ba c\u1ED9t",group:"So s\xE1nh",shape:"columns",selectable:!0,needs:{columns:2},maxColumns:3,fits:{colTitle:40},renders:["title","columns"]},{key:"compare3",label:"So s\xE1nh 3 c\u1ED9t",group:"So s\xE1nh",shape:"columns",selectable:!0,needs:{columnsWithTitle:2},maxColumns:3,fits:{colTitle:40},renders:["title","columns"]},{key:"compare",label:"So s\xE1nh",group:"So s\xE1nh",shape:"columns",selectable:!0,needs:{columns:2},maxColumns:2,fits:{colTitle:40},renders:["title","columns"]},{key:"proscons",label:"\u01AFu / Nh\u01B0\u1EE3c",group:"So s\xE1nh",shape:"columns",selectable:!0,needs:{columns:2},maxColumns:2,renders:["title","columns"]},{key:"quadrant",label:"Ma tr\u1EADn 2\xD72",group:"So s\xE1nh",shape:"columns",selectable:!0,needs:{columns:2},maxColumns:4,renders:["title","columns"]},{key:"comparetable",label:"B\u1EA3ng so s\xE1nh",group:"So s\xE1nh",shape:"columns",selectable:!0,needs:{columns:2},maxColumns:2,renders:["title","columns"]},{key:"tablewide",label:"B\u1EA3ng r\u1ED9ng",group:"So s\xE1nh",shape:"verbatim",selectable:!0,renders:["title","table"]},{key:"feature",label:"\u0110\u1EB7c \u0111i\u1EC3m",group:"So s\xE1nh",shape:"columns",selectable:!0,needs:{columns:2},maxColumns:4,renders:["title","columns"]},{key:"steps",label:"C\xE1c b\u01B0\u1EDBc",group:"Quy tr\xECnh",shape:"list",selectable:!0,needs:{bullets:1},renders:["title","bullets"]},{key:"arrow",label:"M\u0169i t\xEAn",group:"Quy tr\xECnh",shape:"list",selectable:!0,needs:{bullets:1},fits:{bullet:40,bulletCount:4},renders:["title","bullets"]},{key:"timeline",label:"D\xF2ng th\u1EDDi gian",group:"Quy tr\xECnh",shape:"list",selectable:!0,needs:{bullets:1},fits:{bullet:48,bulletCount:5},renders:["title","bullets"]},{key:"vtimeline",label:"M\u1ED1c d\u1ECDc",group:"Quy tr\xECnh",shape:"list",selectable:!0,needs:{bullets:1},renders:["title","bullets"]},{key:"pyramid",label:"Kim t\u1EF1 th\xE1p",group:"Quy tr\xECnh",shape:"list",selectable:!0,needs:{bullets:2},fits:{bullet:48,bulletCount:5},renders:["title","bullets"]},{key:"funnel",label:"Ph\u1EC5u",group:"Quy tr\xECnh",shape:"list",selectable:!0,needs:{bullets:2},fits:{bullet:48,bulletCount:5},renders:["title","bullets"]},{key:"statement",label:"C\xE2u ch\u1ED1t",group:"Nh\u1EA5n m\u1EA1nh",shape:"headline",selectable:!0,hero:!0,fits:{title:120},renders:["title","subtitle"]},{key:"spotlight",label:"\u0110i\u1EC3m nh\u1EA5n",group:"Nh\u1EA5n m\u1EA1nh",shape:"list",selectable:!0,needs:{bullets:1},renders:["title","bullets"]},{key:"quote",label:"Tr\xEDch d\u1EABn",group:"Nh\u1EA5n m\u1EA1nh",shape:"headline",selectable:!0,hero:!0,fits:{title:120},renders:["title","subtitle"]},{key:"quoteauthor",label:"Tr\xEDch d\u1EABn c\xF3 t\xE1c gi\u1EA3",group:"Nh\u1EA5n m\u1EA1nh",shape:"headline",selectable:!0,hero:!0,fits:{title:120},renders:["title","subtitle","image"]},{key:"hero",label:"B\xECa l\u1EDBn",group:"\u0110\u1EB7c bi\u1EC7t",shape:"headline",selectable:!0,hero:!0,fits:{title:70},renders:["title","subtitle"]},{key:"split",label:"Chia \u0111\xF4i",group:"\u0110\u1EB7c bi\u1EC7t",shape:"headline",selectable:!0,hero:!0,renders:["title","subtitle","bullets"]},{key:"section",label:"M\u1EDF ph\u1EA7n",group:"\u0110\u1EB7c bi\u1EC7t",shape:"headline",selectable:!0,hero:!0,fits:{title:90},renders:["title","subtitle"]},{key:"gallery",label:"L\u01B0\u1EDBi \u1EA3nh",group:"\u0110\u1EB7c bi\u1EC7t",shape:"media",selectable:!0,needs:{images:2},renders:["title","images"]},{key:"imageleft",label:"\u1EA2nh tr\xE1i",group:"\u0110\u1EB7c bi\u1EC7t",shape:"media",selectable:!0,needs:{images:1},renders:["title","bullets","image"]},{key:"imageright",label:"\u1EA2nh ph\u1EA3i",group:"\u0110\u1EB7c bi\u1EC7t",shape:"media",selectable:!0,needs:{images:1},renders:["title","bullets","image"]},{key:"formula",label:"C\xF4ng th\u1EE9c",group:"Nguy\xEAn v\u0103n",shape:"verbatim",selectable:!1,renders:["title","formula"]},{key:"figure",label:"H\xECnh",group:"Nguy\xEAn v\u0103n",shape:"verbatim",selectable:!1,renders:["title","image"]},{key:"table",label:"B\u1EA3ng",group:"Nguy\xEAn v\u0103n",shape:"verbatim",selectable:!1,renders:["title","table"]},{key:"formulasteps",label:"C\xF4ng th\u1EE9c + c\xE1c b\u01B0\u1EDBc",group:"Quy tr\xECnh",shape:"list",selectable:!0,needs:{bullets:1},fits:{bullet:70,bulletCount:5},renders:["title","bullets","formula"]},{key:"note",label:"L\u01B0u \xFD",group:"Nguy\xEAn v\u0103n",shape:"verbatim",selectable:!1,renders:["title","bullets"]},{key:"question",label:"C\xE2u h\u1ECFi",group:"Nguy\xEAn v\u0103n",shape:"verbatim",selectable:!1,renders:["title","question"]}],K=Object.fromEntries(de.map(e=>[e.key,e])),hi=de.map(e=>e.key),fe=de.filter(e=>e.selectable),me=["C\u01A1 b\u1EA3n","S\u1ED1 li\u1EC7u","So s\xE1nh","Quy tr\xECnh","Nh\u1EA5n m\u1EA1nh","\u0110\u1EB7c bi\u1EC7t"];var $n=e=>(e||[]).filter(t=>String(t||"").trim()).length,Ln=e=>(e||[]).length,Tn=e=>(e||[]).filter(t=>String(t?.title||"").trim()).length,nt=e=>(e.images||[]).length+(e.image?1:0);function V(e,t){let n=K[t];if(!n)return{ok:!1,reason:"B\u1ED1 c\u1EE5c kh\xF4ng t\u1ED3n t\u1EA1i"};if(!n.selectable)return{ok:!1,reason:"B\u1ED1 c\u1EE5c d\xE0nh cho n\u1ED9i dung nguy\xEAn v\u0103n, kh\xF4ng ch\u1ECDn tay \u0111\u01B0\u1EE3c"};if(e.locked)return{ok:!1,reason:"Slide n\u1ED9i dung nguy\xEAn v\u0103n \u2014 kh\xF4ng \u0111\u1ED5i b\u1ED1 c\u1EE5c"};let i=$n(e.bullets),r=Ln(e.columns),o=Tn(e.columns),l=n.needs||{},s;if(l.images&&nt(e)<l.images)return{ok:!1,reason:`C\u1EA7n \xEDt nh\u1EA5t ${l.images} \u1EA3nh trong slide (hi\u1EC7n ${nt(e)})`};if(l.columns||l.columnsWithTitle){let c=Math.max(l.columns||0,l.columnsWithTitle||0);if((l.columnsWithTitle?Math.max(r,o):r)<c)if(i>=Math.min(2,c))s="bulletsToColumns";else return{ok:!1,reason:`C\u1EA7n \u2265${c} c\u1ED9t, ho\u1EB7c \u22652 \xFD \u0111\u1EC3 t\xE1ch th\xE0nh c\u1ED9t (hi\u1EC7n ${i} \xFD)`}}if(l.bullets&&i<l.bullets)if(r>0)s="columnsToBullets";else return{ok:!1,reason:`C\u1EA7n \xEDt nh\u1EA5t ${l.bullets} \xFD (hi\u1EC7n ${i})`};let p=0;!n.renders.includes("bullets")&&s!=="bulletsToColumns"&&(p+=i),!n.renders.includes("columns")&&s!=="columnsToBullets"&&(p+=r);let a=Sn(e,n,s);return{ok:!0,willHide:p||void 0,transform:s,fitWarning:a.length?a:void 0}}function Sn(e,t,n){let i=t.fits;if(!i)return[];let r=[],o=String(e.title||"").trim();i.title&&o.length>i.title&&r.push(`Ti\xEAu \u0111\u1EC1 ${o.length} k\xFD t\u1EF1 \u2014 b\u1ED1 c\u1EE5c "${t.label}" h\u1EE3p v\u1EDBi ti\xEAu \u0111\u1EC1 d\u01B0\u1EDBi ${i.title}`);let l=(e.bullets||[]).map(s=>String(s||"")).filter(s=>s.trim());if(i.bulletCount&&l.length>i.bulletCount&&r.push(`${l.length} \xFD \u2014 b\u1ED1 c\u1EE5c "${t.label}" v\u1EBD \u0111\u1EB9p nh\u1EA5t v\u1EDBi t\u1ED1i \u0111a ${i.bulletCount} \xFD`),i.bullet){let s=l.reduce((p,a)=>Math.max(p,a.length),0);s>i.bullet&&r.push(`\xDD d\xE0i nh\u1EA5t ${s} k\xFD t\u1EF1 \u2014 b\u1ED1 c\u1EE5c "${t.label}" h\u1EE3p v\u1EDBi \xFD ng\u1EAFn d\u01B0\u1EDBi ${i.bullet}`)}if(i.colTitle){let p=(n==="bulletsToColumns"?l.slice(0,t.maxColumns??4):(e.columns||[]).map(a=>String(a?.title||""))).reduce((a,c)=>Math.max(a,c.length),0);p>i.colTitle&&r.push(`Nh\xE3n c\u1ED9t d\xE0i ${p} k\xFD t\u1EF1 \u2014 b\u1ED1 c\u1EE5c "${t.label}" h\u1EE3p v\u1EDBi nh\xE3n d\u01B0\u1EDBi ${i.colTitle}`)}return r}function Mn(e,t){let n=e.filter(r=>String(r||"").trim());if(!n.length)return[];if(t==="proscons"||t==="comparetable"){let r=Math.ceil(n.length/2);return[{title:t==="proscons"?"\u01AFu \u0111i\u1EC3m":"C\u1ED9t 1",bullets:n.slice(0,r)},{title:t==="proscons"?"Nh\u01B0\u1EE3c \u0111i\u1EC3m":"C\u1ED9t 2",bullets:n.slice(r)}]}let i=K[t]?.maxColumns??4;return n.slice(0,i).map(r=>({title:r,bullets:[]}))}function Hn(e){let t=[];for(let n of e||[]){String(n?.title||"").trim()&&t.push(n.title.trim());for(let i of n?.bullets||[])String(i||"").trim()&&t.push(i)}return t.slice(0,12)}function ee(e,t){let n=V(e,t);if(!n.ok)return e;let i={...e,kind:t};return n.transform==="bulletsToColumns"&&(i.columns=Mn(e.bullets||[],t)),n.transform==="columnsToBullets"&&(i.bullets=Hn(e.columns||[])),i}var An={save:'<path d="M8 22V19C8 17.1144 8 16.1716 8.58579 15.5858C9.17157 15 10.1144 15 12 15C13.8856 15 14.8284 15 15.4142 15.5858C16 16.1716 16 17.1144 16 19V22" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.5"/><path d="M10 7H14" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"/><path d="M3 11.8584C3 7.28199 3 4.99376 4.38674 3.54394C4.43797 3.49038 4.49038 3.43797 4.54394 3.38674C5.99376 2 8.28199 2 12.8584 2C13.943 2 14.4655 2.00376 14.9628 2.18936C15.4417 2.3681 15.8429 2.70239 16.6452 3.37099L18.8411 5.20092C19.9027 6.08561 20.4335 6.52795 20.7168 7.13266C21 7.73737 21 8.42833 21 9.81025V13C21 16.7497 21 18.6246 20.0451 19.9389C19.7367 20.3634 19.3634 20.7367 18.9389 21.0451C17.6246 22 15.7497 22 12 22C8.25027 22 6.3754 22 5.06107 21.0451C4.6366 20.7367 4.26331 20.3634 3.95491 19.9389C3 18.6246 3 16.7497 3 13V11.8584Z" stroke="currentColor" strokeWidth="1.5"/>',add:'<path d="M12 4V20M20 12H4" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"/>',present:'<path d="M18.8906 12.846C18.5371 14.189 16.8667 15.138 13.5257 17.0361C10.296 18.8709 8.6812 19.7884 7.37983 19.4196C6.8418 19.2671 6.35159 18.9776 5.95624 18.5787C5 17.6139 5 15.7426 5 12C5 8.2574 5 6.3861 5.95624 5.42132C6.35159 5.02245 6.8418 4.73288 7.37983 4.58042C8.6812 4.21165 10.296 5.12907 13.5257 6.96393C16.8667 8.86197 18.5371 9.811 18.8906 11.154C19.0365 11.7084 19.0365 12.2916 18.8906 12.846Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.5"/>',layout:'<path d="M10.5 8.75V6.75C10.5 5.10626 10.5 4.28439 10.046 3.73121C9.96291 3.62995 9.87005 3.53709 9.76879 3.45398C9.21561 3 8.39374 3 6.75 3C5.10626 3 4.28439 3 3.73121 3.45398C3.62995 3.53709 3.53709 3.62995 3.45398 3.73121C3 4.28439 3 5.10626 3 6.75V8.75C3 10.3937 3 11.2156 3.45398 11.7688C3.53709 11.8701 3.62995 11.9629 3.73121 12.046C4.28439 12.5 5.10626 12.5 6.75 12.5C8.39374 12.5 9.21561 12.5 9.76879 12.046C9.87005 11.9629 9.96291 11.8701 10.046 11.7688C10.5 11.2156 10.5 10.3937 10.5 8.75Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.5"/><path d="M7.75 15.5H5.75C5.05222 15.5 4.70333 15.5 4.41943 15.5861C3.78023 15.78 3.28002 16.2802 3.08612 16.9194C3 17.2033 3 17.5522 3 18.25C3 18.9478 3 19.2967 3.08612 19.5806C3.28002 20.2198 3.78023 20.72 4.41943 20.9139C4.70333 21 5.05222 21 5.75 21H7.75C8.44778 21 8.79667 21 9.08057 20.9139C9.71977 20.72 10.22 20.2198 10.4139 19.5806C10.5 19.2967 10.5 18.9478 10.5 18.25C10.5 17.5522 10.5 17.2033 10.4139 16.9194C10.22 16.2802 9.71977 15.78 9.08057 15.5861C8.79667 15.5 8.44778 15.5 7.75 15.5Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.5"/><path d="M21 17.25V15.25C21 13.6063 21 12.7844 20.546 12.2312C20.4629 12.1299 20.3701 12.0371 20.2688 11.954C19.7156 11.5 18.8937 11.5 17.25 11.5C15.6063 11.5 14.7844 11.5 14.2312 11.954C14.1299 12.0371 14.0371 12.1299 13.954 12.2312C13.5 12.7844 13.5 13.6063 13.5 15.25V17.25C13.5 18.8937 13.5 19.7156 13.954 20.2688C14.0371 20.3701 14.1299 20.4629 14.2312 20.546C14.7844 21 15.6063 21 17.25 21C18.8937 21 19.7156 21 20.2688 20.546C20.3701 20.4629 20.4629 20.3701 20.546 20.2688C21 19.7156 21 18.8937 21 17.25Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.5"/><path d="M18.25 3H16.25C15.5522 3 15.2033 3 14.9194 3.08612C14.2802 3.28002 13.78 3.78023 13.5861 4.41943C13.5 4.70333 13.5 5.05222 13.5 5.75C13.5 6.44778 13.5 6.79667 13.5861 7.08057C13.78 7.71977 14.2802 8.21998 14.9194 8.41388C15.2033 8.5 15.5522 8.5 16.25 8.5H18.25C18.9478 8.5 19.2967 8.5 19.5806 8.41388C20.2198 8.21998 20.72 7.71977 20.9139 7.08057C21 6.79667 21 6.44778 21 5.75C21 5.05222 21 4.70333 20.9139 4.41943C20.72 3.78023 20.2198 3.28002 19.5806 3.08612C19.2967 3 18.9478 3 18.25 3Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.5"/>',palette:'<path d="M22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C12.8417 22 14 22.1163 14 21C14 20.391 13.6832 19.9212 13.3686 19.4544C12.9082 18.7715 12.4523 18.0953 13 17C13.6667 15.6667 14.7778 15.6667 16.4815 15.6667C17.3334 15.6667 18.3334 15.6667 19.5 15.5C21.601 15.1999 22 13.9084 22 12Z" stroke="currentColor" strokeWidth="1.5"/><circle cx="9.5" cy="8.5" r="1.5" stroke="currentColor" strokeWidth="1.5"/><circle cx="16.5" cy="9.5" r="1.5" stroke="currentColor" strokeWidth="1.5"/><path d="M7.125 15H7M7.25 15C7.25 15.1381 7.13807 15.25 7 15.25C6.86193 15.25 6.75 15.1381 6.75 15C6.75 14.8619 6.86193 14.75 7 14.75C7.13807 14.75 7.25 14.8619 7.25 15Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"/>',image:'<path d="M3 16L7.46967 11.5303C7.80923 11.1908 8.26978 11 8.75 11C9.23022 11 9.69077 11.1908 10.0303 11.5303L14 15.5M15.5 17L14 15.5M21 16L18.5303 13.5303C18.1908 13.1908 17.7302 13 17.25 13C16.7698 13 16.3092 13.1908 15.9697 13.5303L14 15.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"/><path d="M15.5 8C15.7761 8 16 7.77614 16 7.5C16 7.22386 15.7761 7 15.5 7M15.5 8C15.2239 8 15 7.77614 15 7.5C15 7.22386 15.2239 7 15.5 7M15.5 8V7" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"/><path d="M3.69797 19.7472C2.5 18.3446 2.5 16.2297 2.5 12C2.5 7.77027 2.5 5.6554 3.69797 4.25276C3.86808 4.05358 4.05358 3.86808 4.25276 3.69797C5.6554 2.5 7.77027 2.5 12 2.5C16.2297 2.5 18.3446 2.5 19.7472 3.69797C19.9464 3.86808 20.1319 4.05358 20.302 4.25276C21.5 5.6554 21.5 7.77027 21.5 12C21.5 16.2297 21.5 18.3446 20.302 19.7472C20.1319 19.9464 19.9464 20.1319 19.7472 20.302C18.3446 21.5 16.2297 21.5 12 21.5C7.77027 21.5 5.6554 21.5 4.25276 20.302C4.05358 20.1319 3.86808 19.9464 3.69797 19.7472Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"/>',note:'<path d="M12.5 5H11.5C7.72876 5 5.84315 5 4.67157 6.17157C3.5 7.34315 3.5 9.22876 3.5 13V14C3.5 17.7712 3.5 19.6569 4.67157 20.8284C5.84315 22 7.72876 22 11.5 22L12.5 22C16.2712 22 18.1569 22 19.3284 20.8284C20.5 19.6569 20.5 17.7712 20.5 14V13C20.5 9.22876 20.5 7.34315 19.3284 6.17157C18.1569 5 16.2712 5 12.5 5Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"/><path d="M11 7.5C11 8.32843 11.6716 9 12.5 9C13.3284 9 14 8.32843 14 7.5V4C14 2.89543 13.1046 2 12 2C10.8954 2 10 2.89543 10 4V5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"/><path d="M7.5 17.5H12.5M7.5 13.5H16.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"/>',duplicate:'<path d="M9 15C9 12.1716 9 10.7574 9.87868 9.87868C10.7574 9 12.1716 9 15 9L16 9C18.8284 9 20.2426 9 21.1213 9.87868C22 10.7574 22 12.1716 22 15V16C22 18.8284 22 20.2426 21.1213 21.1213C20.2426 22 18.8284 22 16 22H15C12.1716 22 10.7574 22 9.87868 21.1213C9 20.2426 9 18.8284 9 16L9 15Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"/><path d="M16.9999 9C16.9975 6.04291 16.9528 4.51121 16.092 3.46243C15.9258 3.25989 15.7401 3.07418 15.5376 2.90796C14.4312 2 12.7875 2 9.5 2C6.21252 2 4.56878 2 3.46243 2.90796C3.25989 3.07417 3.07418 3.25989 2.90796 3.46243C2 4.56878 2 6.21252 2 9.5C2 12.7875 2 14.4312 2.90796 15.5376C3.07417 15.7401 3.25989 15.9258 3.46243 16.092C4.51121 16.9528 6.04291 16.9975 9 16.9999" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"/>',hide:'<path d="M19.439 15.439C20.3636 14.5212 21.0775 13.6091 21.544 12.955C21.848 12.5287 22 12.3155 22 12C22 11.6845 21.848 11.4713 21.544 11.045C20.1779 9.12944 16.6892 5 12 5C11.0922 5 10.2294 5.15476 9.41827 5.41827M6.74742 6.74742C4.73118 8.1072 3.24215 9.94266 2.45604 11.045C2.15201 11.4713 2 11.6845 2 12C2 12.3155 2.15201 12.5287 2.45604 12.955C3.8221 14.8706 7.31078 19 12 19C13.9908 19 15.7651 18.2557 17.2526 17.2526" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"/><path d="M9.85786 10C9.32783 10.53 9 11.2623 9 12.0711C9 13.6887 10.3113 15 11.9289 15C12.7377 15 13.47 14.6722 14 14.1421" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5"/><path d="M3 3L21 21" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"/>',show:'<path d="M21.544 11.045C21.848 11.4713 22 11.6845 22 12C22 12.3155 21.848 12.5287 21.544 12.955C20.1779 14.8706 16.6892 19 12 19C7.31078 19 3.8221 14.8706 2.45604 12.955C2.15201 12.5287 2 12.3155 2 12C2 11.6845 2.15201 11.4713 2.45604 11.045C3.8221 9.12944 7.31078 5 12 5C16.6892 5 20.1779 9.12944 21.544 11.045Z" stroke="currentColor" strokeWidth="1.5"/><path d="M15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15C13.6569 15 15 13.6569 15 12Z" stroke="currentColor" strokeWidth="1.5"/>',trash:'<path d="M19.5 5.5L18.8803 15.5251C18.7219 18.0864 18.6428 19.3671 18.0008 20.2879C17.6833 20.7431 17.2747 21.1273 16.8007 21.416C15.8421 22 14.559 22 11.9927 22C9.42312 22 8.1383 22 7.17905 21.4149C6.7048 21.1257 6.296 20.7408 5.97868 20.2848C5.33688 19.3626 5.25945 18.0801 5.10461 15.5152L4.5 5.5" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5"/><path d="M3 5.5H21M16.0557 5.5L15.3731 4.09173C14.9196 3.15626 14.6928 2.68852 14.3017 2.39681C14.215 2.3321 14.1231 2.27454 14.027 2.2247C13.5939 2 13.0741 2 12.0345 2C10.9688 2 10.436 2 9.99568 2.23412C9.8981 2.28601 9.80498 2.3459 9.71729 2.41317C9.32164 2.7167 9.10063 3.20155 8.65861 4.17126L8.05292 5.5" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5"/><path d="M9.5 16.5L9.5 10.5" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5"/><path d="M14.5 16.5L14.5 10.5" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5"/>',reset:'<path d="M20.5 5.5H9.5C5.78672 5.5 3 8.18503 3 12" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"/><path d="M3.5 18.5H14.5C18.2133 18.5 21 15.815 21 12" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"/><path d="M18.5 3C18.5 3 21 4.84122 21 5.50002C21 6.15882 18.5 8 18.5 8" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"/><path d="M5.49998 16C5.49998 16 3.00001 17.8412 3 18.5C2.99999 19.1588 5.5 21 5.5 21" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"/>',close:'<path d="M18 6L6.00081 17.9992M17.9992 18L6 6.00085" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"/>',search:'<path d="M17 17L21 21" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"/><path d="M19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19C15.4183 19 19 15.4183 19 11Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"/>',lock:'<path d="M4.26781 18.8447C4.49269 20.515 5.87613 21.8235 7.55966 21.9009C8.97627 21.966 10.4153 22 12 22C13.5847 22 15.0237 21.966 16.4403 21.9009C18.1239 21.8235 19.5073 20.515 19.7322 18.8447C19.879 17.7547 20 16.6376 20 15.5C20 14.3624 19.879 13.2453 19.7322 12.1553C19.5073 10.485 18.1239 9.17649 16.4403 9.09909C15.0237 9.03397 13.5847 9 12 9C10.4153 9 8.97627 9.03397 7.55966 9.09909C5.87613 9.17649 4.49269 10.485 4.26781 12.1553C4.12104 13.2453 4 14.3624 4 15.5C4 16.6376 4.12104 17.7547 4.26781 18.8447Z" stroke="currentColor" strokeWidth="1.5"/><path d="M7.5 9V6.5C7.5 4.01472 9.51472 2 12 2C14.4853 2 16.5 4.01472 16.5 6.5V9" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"/><path d="M12.125 15.5H12M12.25 15.5C12.25 15.6381 12.1381 15.75 12 15.75C11.8619 15.75 11.75 15.6381 11.75 15.5C11.75 15.3619 11.8619 15.25 12 15.25C12.1381 15.25 12.25 15.3619 12.25 15.5Z" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5"/>',warn:'<path d="M13.9248 21H10.0752C5.44476 21 3.12955 21 2.27636 19.4939C1.42317 17.9879 2.60736 15.9914 4.97574 11.9985L6.90057 8.75333C9.17559 4.91778 10.3131 3 12 3C13.6869 3 14.8244 4.91777 17.0994 8.75332L19.0243 11.9985C21.3926 15.9914 22.5768 17.9879 21.7236 19.4939C20.8704 21 18.5552 21 13.9248 21Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"/><path d="M12 9V13" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"/><path d="M12.125 16.75H12M12.25 16.75C12.25 16.8881 12.1381 17 12 17C11.8619 17 11.75 16.8881 11.75 16.75C11.75 16.6119 11.8619 16.5 12 16.5C12.1381 16.5 12.25 16.6119 12.25 16.75Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"/>',drag:'<path d="M16 6C16 6.55228 15.5523 7 15 7C14.4477 7 14 6.55228 14 6C14 5.44772 14.4477 5 15 5C15.5523 5 16 5.44772 16 6Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"/><path d="M10 6C10 6.55228 9.55228 7 9 7C8.44772 7 8 6.55228 8 6C8 5.44772 8.44772 5 9 5C9.55228 5 10 5.44772 10 6Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"/><path d="M16 18C16 18.5523 15.5523 19 15 19C14.4477 19 14 18.5523 14 18C14 17.4477 14.4477 17 15 17C15.5523 17 16 17.4477 16 18Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"/><path d="M16 12C16 12.5523 15.5523 13 15 13C14.4477 13 14 12.5523 14 12C14 11.4477 14.4477 11 15 11C15.5523 11 16 11.4477 16 12Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"/><path d="M10 18C10 18.5523 9.55228 19 9 19C8.44772 19 8 18.5523 8 18C8 17.4477 8.44772 17 9 17C9.55228 17 10 17.4477 10 18Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"/><path d="M10 12C10 12.5523 9.55228 13 9 13C8.44772 13 8 12.5523 8 12C8 11.4477 8.44772 11 9 11C9.55228 11 10 11.4477 10 12Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"/>',regen:'<path d="M13.9258 12.7775L11.7775 10.6292C11.4847 10.3364 11.3383 10.19 11.1803 10.1117C10.8798 9.96277 10.527 9.96277 10.2264 10.1117C10.0685 10.19 9.92207 10.3364 9.62923 10.6292C9.33638 10.9221 9.18996 11.0685 9.11169 11.2264C8.96277 11.527 8.96277 11.8798 9.11169 12.1803C9.18996 12.3383 9.33638 12.4847 9.62923 12.7775L11.7775 14.9258M13.9258 12.7775L20.3708 19.2225C20.6636 19.5153 20.81 19.6617 20.8883 19.8197C21.0372 20.1202 21.0372 20.473 20.8883 20.7736C20.81 20.9315 20.6636 21.0779 20.3708 21.3708C20.0779 21.6636 19.9315 21.81 19.7736 21.8883C19.473 22.0372 19.1202 22.0372 18.8197 21.8883C18.6617 21.81 18.5153 21.6636 18.2225 21.3708L11.7775 14.9258M13.9258 12.7775L11.7775 14.9258" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"/><path d="M17 2L17.2948 2.7966C17.6813 3.84117 17.8746 4.36345 18.2556 4.74445C18.6366 5.12545 19.1588 5.31871 20.2034 5.70523L21 6L20.2034 6.29477C19.1588 6.68129 18.6366 6.87456 18.2556 7.25555C17.8746 7.63655 17.6813 8.15883 17.2948 9.2034L17 10L16.7052 9.2034C16.3187 8.15884 16.1254 7.63655 15.7444 7.25555C15.3634 6.87455 14.8412 6.68129 13.7966 6.29477L13 6L13.7966 5.70523C14.8412 5.31871 15.3634 5.12545 15.7444 4.74445C16.1254 4.36345 16.3187 3.84117 16.7052 2.7966L17 2Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.5"/><path d="M6 4L6.22108 4.59745C6.51097 5.38087 6.65592 5.77259 6.94167 6.05834C7.22741 6.34408 7.61913 6.48903 8.40255 6.77892L9 7L8.40255 7.22108C7.61913 7.51097 7.22741 7.65592 6.94166 7.94167C6.65592 8.22741 6.51097 8.61913 6.22108 9.40255L6 10L5.77892 9.40255C5.48903 8.61913 5.34408 8.22741 5.05833 7.94167C4.77259 7.65592 4.38087 7.51097 3.59745 7.22108L3 7L3.59745 6.77892C4.38087 6.48903 4.77259 6.34408 5.05833 6.05833C5.34408 5.77259 5.48903 5.38087 5.77892 4.59745L6 4Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.5"/>',check:'<path d="M5 14L8.5 17.5L19 6.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"/>',chevron:'<path d="M18 9.00005C18 9.00005 13.5811 15 12 15C10.4188 15 6 9 6 9" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"/>'};function j(e,t=""){let n=An[e];return n?`<svg class="dk-i ${t}" viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${n}</svg>`:""}var J=null;function Bn(){typeof window<"u"&&(window.__dkRailClones=(window.__dkRailClones||0)+1)}function it(e){return(e.dataset.kind||"")+"|"+(e.classList.contains("skipped")?"1":"0")+"|"+(e.getAttribute("style")||"")+"|"+e.innerHTML.length+"|"+e.innerHTML}var Dn=0;function zn(e){let t=e.dataset.railSid;return t||(t=e.dataset.id||`tmp${++Dn}`,e.dataset.railSid=t),t}function Nn(e){let t=e.dataset.kind||"";return t!=="section"&&t!=="hero"?null:(e.querySelector(".sec-ttl,.hbig")?.textContent||e.dataset.title||"").trim()||null}var qe="";function ot(e,t){let n=e.querySelector("#lp-rail")||document.getElementById("lp-rail");if(!n)return;let i=Array.from(e.querySelectorAll("#scaler > .slide")),r=new Map;n.querySelectorAll(".rail-it").forEach(s=>{let p=s.dataset.sid;p&&r.set(p,s)});let o=[];i.forEach((s,p)=>{let a=zn(s),c=r.get(a);if(c){r.delete(a);let x=it(s);if(c.dataset.sig!==x){let v=c.querySelector(".rail-thumb");v&&v.replaceWith(rt(s)),c.dataset.sig=x}}else{c=document.createElement("div"),c.dataset.sid=a,c.draggable=!0,c.appendChild(rt(s)),c.dataset.sig=it(s);let x=document.createElement("span");x.className="rail-num",c.appendChild(x);let v=document.createElement("button");v.className="rail-dup",v.title="Nh\xE2n b\u1EA3n",v.innerHTML=j("duplicate"),c.appendChild(v);let C=document.createElement("button");C.className="rail-del",C.title="Xo\xE1 slide",C.innerHTML=j("trash"),c.appendChild(C)}c.className="rail-it"+(s.classList.contains("active")?" on":"")+(s.classList.contains("skipped")?" skip":""),s.dataset.locked==="1"?c.dataset.locked="1":delete c.dataset.locked;let h=c.querySelector(".rail-num");h&&(h.textContent=String(p+1)),qn(c,s,p,t),o.push(c)}),r.forEach(s=>s.remove()),n.querySelectorAll(".rail-g").forEach(s=>s.remove());let l=[];i.forEach((s,p)=>{let a=Nn(s);if(a){let c=document.createElement("div");c.className="rail-g",c.textContent=a,c.title=a,l.push(c)}l.push(o[p])}),l.forEach((s,p)=>{n.children[p]!==s&&n.insertBefore(s,n.children[p]||null)}),lt(n)}function lt(e){let t=qe;e.querySelectorAll(".rail-it").forEach(n=>{let i=t==="skip"&&!n.classList.contains("skip")||t==="lock"&&n.dataset.locked!=="1";n.hidden=i}),e.querySelectorAll(".rail-g").forEach(n=>{let i=n.nextElementSibling,r=!1;for(;i&&!i.classList.contains("rail-g");){if(i.classList.contains("rail-it")&&!i.hidden){r=!0;break}i=i.nextElementSibling}n.hidden=!r})}function st(e,t){qe=t;let n=e.querySelector("#lp-rail")||document.getElementById("lp-rail");n&&lt(n)}function Fe(){return qe}function qn(e,t,n,i){let r=e.querySelector(".rail-dup"),o=e.querySelector(".rail-del");e.onclick=l=>{l.target===r||l.target===o||i.onGoto(n)},e.ondragstart=()=>{J=t,e.classList.add("drag")},e.ondragend=()=>e.classList.remove("drag"),e.ondragover=l=>l.preventDefault(),e.ondrop=l=>{if(l.preventDefault(),!J||J===t)return;let s=J.parentNode,p=J.nextSibling,a=e.getBoundingClientRect(),c=l.clientY-a.top>a.height/2;t.parentNode.insertBefore(J,c?t.nextSibling:t);let h=J;i.pushUndo(()=>{s.insertBefore(h,p)}),J=null,i.onSync("\u0110\xE3 \u0111\u1ED5i th\u1EE9 t\u1EF1 \u2014 Ctrl+Z \u0111\u1EC3 ho\xE0n t\xE1c")},r&&(r.onclick=l=>{l.stopPropagation(),i.onDup(t)}),o&&(o.onclick=l=>{l.stopPropagation(),i.onDel(t)})}function at(e,t){let n=e.querySelector("#lp-rail")||document.getElementById("lp-rail");if(!n)return;let i=n.querySelectorAll(".rail-it");i.forEach((o,l)=>o.classList.toggle("on",l===t));let r=i[t];r&&typeof r.scrollIntoView=="function"&&r.scrollIntoView({block:"nearest"})}function rt(e){Bn();let t=document.createElement("div");t.className="rail-thumb";let n=e.cloneNode(!0);n.classList.remove("active"),n.removeAttribute("data-index"),n.removeAttribute("data-id"),n.removeAttribute("data-new"),n.removeAttribute("data-rail-sid");let i=n.querySelector(".slidebar");return i&&i.remove(),n.querySelectorAll("[data-e]").forEach(r=>r.removeAttribute("data-e")),n.querySelectorAll("[contenteditable]").forEach(r=>r.setAttribute("contenteditable","false")),t.appendChild(n),t}var ke=null;function ct(e,t,n,i){let r=document.getElementById("lp-picker");r||(r=document.createElement("div"),r.id="lp-picker",document.body.appendChild(r));let o=+(n.dataset.nb||0),l=+(n.dataset.nc||0),s=+(n.dataset.nct||0),p=+(n.dataset.nf||0),a=b=>Array.from(n.querySelectorAll(b)).map(y=>(y.innerText||"").replace(/\s+/g," ").trim()).filter(Boolean),c=a("[data-e*='.bullets.']"),h=c.length?c:a("ul.bul li"),x=a("[data-e$='.title'][data-e*='.columns.'], .col .ch, .c3-h, .metric .val, .kpi-v"),v={id:n.dataset.id||String(e),kind:n.dataset.kind||"content",title:(n.querySelector(".ttl,.msg,.qmsg,.sec-ttl,.hbig")?.innerText||"").trim(),bullets:h.length?h:Array.from({length:o},(b,y)=>`\xFD ${y+1}`),columns:(x.length?x:Array.from({length:l},(b,y)=>y<s?`c\u1ED9t ${y+1}`:"")).map(b=>({title:b,bullets:[]})),images:Array.from({length:p},(b,y)=>({asset:`pv${y}`})),locked:n.dataset.locked==="1"},C="data:image/svg+xml;utf8,"+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="8" height="5"><rect width="8" height="5" fill="%23c7cede"/></svg>'),m=Array.from(n.querySelectorAll("img")).map(b=>b.getAttribute("src")||"").filter(Boolean),L={};for(let b=0;b<Math.max(p,4);b++)L[`pv${b}`]=m[b]||C;let T='<div class="pk-box"><div class="pk-hd">Ch\u1ECDn b\u1ED1 c\u1EE5c slide<input id="pk-q" class="pk-q" type="search" placeholder="T\xECm b\u1ED1 c\u1EE5c\u2026 (g\xF5 t\xEAn)" autocomplete="off"><button class="pk-x" title="\u0110\xF3ng">\u2715</button></div><div class="pk-body">';me.forEach(b=>{let y=fe.filter($=>$.group===b);y.length&&(T+=`<div class="pk-g" data-g="${b}">${b}</div><div class="pk-grid" data-g="${b}">`,y.forEach($=>{let w=V(v,$.key),P=w.ok?"":w.reason||"Kh\xF4ng \u0111\u1EE7 d\u1EEF li\u1EC7u",U=w.ok&&w.willHide?` data-hide="${w.willHide}"`:"",z=w.fitWarning||[],ne=w.ok?z.join(" \xB7 "):P;T+=`<button class="pk-tile${$.key===t?" on":""}${w.ok?"":" off"}${w.ok&&z.length?" tight":""}" data-k="${$.key}" data-s="${dt($.label+" "+$.key+" "+$.group)}"${w.ok?"":" disabled"}${ne?` title="${u(ne)}"`:""}${U}><span class="pk-mini" data-pv="1"></span><span class="pk-lb">${$.label}</span>`+(w.ok?"":'<span class="pk-lock">\u{1F512}</span>')+(w.willHide?`<span class="pk-warn">\u26A0 \u1EA8n ${w.willHide}</span>`:"")+(w.ok&&z.length?'<span class="pk-tight">Ch\u1EEF h\u01A1i d\xE0i</span>':"")+"</button>"}),T+="</div>")}),T+='<div class="pk-none" hidden>Kh\xF4ng c\xF3 b\u1ED1 c\u1EE5c n\xE0o kh\u1EDBp</div></div></div>',r.innerHTML=T,r.classList.add("show"),r.querySelector(".pk-x").addEventListener("click",()=>ce()),r.onclick=b=>{b.target===r&&ce()};let D=Array.from(r.querySelectorAll(".pk-tile")),F=new Map,H=b=>{let y=b.querySelector(".pk-mini[data-pv]");if(!y||y.dataset.done)return;let $=b.getAttribute("data-k"),w=F.get($);if(w==null){let U=K[$]?.renders||[],z={...ee(v,$),kind:$};U.includes("images")&&!(z.images||[]).length&&(z={...z,images:[{asset:"pv0"},{asset:"pv1"},{asset:"pv2"}]}),U.includes("image")&&!z.image&&(z={...z,image:{asset:"pv0"}}),w=oe(z,{idx:0,pos:1,foot:"",assets:L}),F.set($,w)}y.innerHTML=w,y.dataset.done="1"};if(typeof IntersectionObserver=="function"){ke?.disconnect();let b=new IntersectionObserver(y=>{y.forEach($=>{$.isIntersecting&&(H($.target),b.unobserve($.target))})},{root:r.querySelector(".pk-body"),rootMargin:"160px"});ke=b,D.forEach(y=>b.observe(y))}else D.forEach(H);D.forEach(b=>{b.onclick=()=>{b.disabled||(i.onSelect(b.getAttribute("data-k"),e,n),ce())},b.onmouseenter=()=>H(b),b.onfocus=()=>H(b)});let M=r.querySelector("#pk-q"),I=r.querySelector(".pk-none");if(M){let b=()=>{let y=dt(M.value),$=0;D.forEach(w=>{let P=!y||(w.getAttribute("data-s")||"").includes(y);w.hidden=!P,P&&$++}),r.querySelectorAll(".pk-grid").forEach(w=>{let P=Array.from(w.querySelectorAll(".pk-tile")).some(z=>!z.hidden);w.hidden=!P;let U=r.querySelector(`.pk-g[data-g="${w.dataset.g}"]`);U&&(U.hidden=!P)}),I&&(I.hidden=$>0)};M.oninput=b,M.onkeydown=y=>{if(y.key==="Escape"&&(M.value?(M.value="",b()):ce(),y.stopPropagation()),y.key==="Enter"){let $=D.find(w=>!w.hidden&&!w.disabled);$&&$.click()}},setTimeout(()=>M.focus(),30)}r.onkeydown=b=>{b.key==="Escape"&&ce()}}function dt(e){return(e||"").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/\u0111/g,"d")}function ce(){let e=document.getElementById("lp-picker");e&&e.classList.remove("show"),ke?.disconnect(),ke=null}function pt(e){let t=(e||"").trim();if(!t)return null;let n=t.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);if(n){let r=n[1],o=r.length===3?[r[0]+r[0],r[1]+r[1],r[2]+r[2]]:[r.slice(0,2),r.slice(2,4),r.slice(4,6)];return[parseInt(o[0],16),parseInt(o[1],16),parseInt(o[2],16)]}let i=t.match(/^rgba?\(\s*(\d+)[,\s]+(\d+)[,\s]+(\d+)/i);return i?[+i[1],+i[2],+i[3]]:null}function ut([e,t,n]){let i=r=>{let o=r/255;return o<=.03928?o/12.92:Math.pow((o+.055)/1.055,2.4)};return .2126*i(e)+.7152*i(t)+.0722*i(n)}function ht(e,t){let n=pt(e),i=pt(t);if(!n||!i)return null;let r=ut(n),o=ut(i),l=Math.max(r,o),s=Math.min(r,o);return(l+.05)/(s+.05)}function gt(e,t,n){let i=ht(e,t),r=ht(n,e),o=[i,r].filter(s=>s!=null),l=o.length?Math.min(...o):null;return{asText:i,asBg:r,worst:l,low:l!=null&&l<4.5}}var Fn=["#5b8def","#46b083","#e0a23a","#e8503a","#7a5ae0","#2B4182","#0E9F6E"];function ve(e,t,n){return`<button class="dk-btn dk-fmt" data-cmd="${e}" title="${u(n)}" tabindex="-1">${t}</button>`}var G=(e,t,n,i,r="")=>`<button id="${e}" class="dk-btn ${r}" title="${u(i)}">${j(t)}<span class="dk-lb">${u(n)}</span></button>`;function bt(e,t,n){let i=e.querySelector("#dk-toolbar");if(!i)return;let r=e.querySelector("#scaler > .slide.active")||e.querySelector("#scaler > .slide");if(!r){i.innerHTML="";return}let o=+(r.dataset.index||0),l=r.dataset.kind||"content",s=e.querySelectorAll("#scaler > .slide"),p=Array.from(s).indexOf(r),a=K[l],c=r.classList.contains("skipped"),h=r.dataset.locked==="1",x=!!a?.renders.some(T=>T==="image"||T==="images"),v=!!r.querySelector(".two img,.bigfig img,.fig img,.gcell img,.qav"),C=!!r.querySelector(".edregen"),m="";m+='<div class="dk-grp">',m+=G("dk-save","save","L\u01B0u","L\u01B0u ngay (Ctrl+S)","primary"),m+='<span id="edmsg" class="dk-status"></span>',m+="</div>",m+='<div class="dk-grp">',m+=`<button id="dk-layout" class="dk-btn" title="\u0110\u1ED5i b\u1ED1 c\u1EE5c \u2014 c\xF3 \xF4 t\xECm ki\u1EBFm, r\xEA chu\u1ED9t \u0111\u1EC3 xem tr\u01B0\u1EDBc"${h?" disabled":""}>${j("layout")}<span class="dk-lb">${u(a?.label||l)}</span>${j("chevron","dk-caret")}</button>`,m+=`<button id="dk-color" class="dk-btn" title="M\xE0u nh\u1EA5n c\u1EE7a slide n\xE0y">${j("palette")}<span class="dk-lb">M\xE0u</span>${j("chevron","dk-caret")}</button>`,x&&(m+=G("dk-img","image",v?"\u0110\u1ED5i \u1EA3nh":"Th\xEAm \u1EA3nh","Ch\u1ECDn \u1EA3nh minh ho\u1EA1 cho slide"),v&&(m+=G("dk-imgx","trash","G\u1EE1 \u1EA3nh","G\u1EE1 \u1EA3nh kh\u1ECFi slide","danger-ghost"))),C&&(m+=G("dk-regen","regen","V\u1EBD l\u1EA1i \u1EA3nh","V\u1EBD l\u1EA1i \u1EA3nh b\u1EB1ng AI (~1 ph\xFAt)")),m+=G("dk-notes","note","Ghi ch\xFA","Ghi ch\xFA/\u0111\xE1p \xE1n cho Presenter View (kh\xF4ng hi\u1EC7n tr\xEAn slide)"),m+="</div>",m+='<div class="dk-grp" id="dk-fmt-grp">',m+=ve("bold","<b>B</b>","\u0110\u1EADm (Ctrl+B)"),m+=ve("italic","<i>I</i>","Nghi\xEAng (Ctrl+I)"),m+=ve("superscript","x<sup>2</sup>","S\u1ED1 m\u0169 \u2014 x\xB2"),m+=ve("subscript","x<sub>2</sub>","Ch\u1EC9 s\u1ED1 d\u01B0\u1EDBi \u2014 x\u2082"),m+="</div>",m+='<div class="dk-grp">',m+=G("dk-add","add","Th\xEAm","Th\xEAm slide tr\u1ED1ng sau slide n\xE0y"),m+=G("dk-dup","duplicate","Nh\xE2n b\u1EA3n","T\u1EA1o b\u1EA3n sao ngay d\u01B0\u1EDBi slide n\xE0y"),m+=G("dk-skip",c?"show":"hide",c?"B\u1ECF \u1EA9n":"\u1EA8n",c?"Cho slide hi\u1EC7n l\u1EA1i khi tr\xECnh chi\u1EBFu":"\u1EA8n kh\u1ECFi tr\xECnh chi\u1EBFu v\xE0 b\u1EA3n xu\u1EA5t"),m+=G("dk-del","trash","Xo\xE1","Xo\xE1 slide (Ctrl+Z \u0111\u1EC3 l\u1EA5y l\u1EA1i)","danger"),m+="</div>";let L=Fe();m+='<div class="dk-grp" id="dk-filter-grp">',m+=`<button id="dk-filter" class="dk-btn${L?" on":""}" title="L\u1ECDc danh s\xE1ch slide b\xEAn tr\xE1i">${j("hide")}<span class="dk-lb">${L==="skip"?"\u0110ang \u1EA9n":L==="lock"?"Nguy\xEAn v\u0103n":"L\u1ECDc"}</span>${j("chevron","dk-caret")}</button>`,m+="</div>",m+='<div class="dk-grp dk-right">',m+=`<span class="dk-pos">${p+1}<span class="dk-pos-sep">/</span>${s.length}</span>`,m+=G("dk-present","present","Tr\xECnh chi\u1EBFu","Tr\xECnh chi\u1EBFu to\xE0n m\xE0n h\xECnh (Esc \u0111\u1EC3 tho\xE1t)"),m+=`<button id="dk-reset" class="dk-btn ghost" title="\u0110\u1EB7t l\u1EA1i slide v\u1EC1 b\u1EA3n AI d\xE0n ban \u0111\u1EA7u">${j("reset")}</button>`,m+="</div>",i.innerHTML=m,In(e,i,r,o,l,t,n)}function In(e,t,n,i,r,o,l){let s=(p,a)=>{let c=t.querySelector("#"+p);c&&(c.onclick=a)};t.querySelectorAll(".dk-fmt").forEach(p=>{p.addEventListener("mousedown",a=>{a.preventDefault();let h=(e.getRootNode().getSelection?.()||window.getSelection())?.anchorNode;if(!(h&&(h.nodeType===1?h:h.parentElement))?.closest("[contenteditable='true']")){l.onMsg("B\xF4i \u0111en ch\u1EEF tr\xEAn slide tr\u01B0\u1EDBc r\u1ED3i m\u1EDBi b\u1EA5m \u0111\u1ECBnh d\u1EA1ng");return}document.execCommand(p.dataset.cmd||"bold"),l.onSave(!1)})}),s("dk-save",()=>l.onSave(!1)),s("dk-add",()=>l.onAddSlide()),s("dk-dup",()=>l.onDup(n)),s("dk-del",()=>l.onDel(n)),s("dk-present",()=>l.onPresent()),s("dk-reset",()=>l.onReset?.()),s("dk-layout",()=>ct(i,r,n,{onSelect:(p,a,c)=>{let h=l.onAdapt(p,a,c);o.kinds[a]=p,h&&l.onMsg(h),l.onSave(!0)}})),s("dk-skip",()=>{let p=n.classList.toggle("skipped");p?o.skipped[i]=!0:delete o.skipped[i],l.onSync(),l.scheduleSave(p?"\u0110\xE3 \u1EA9n slide kh\u1ECFi tr\xECnh chi\u1EBFu":"\u0110\xE3 b\u1ECF \u1EA9n slide")}),s("dk-color",p=>{let a=(n.style.getPropertyValue("--sl-gold")||"").trim().toLowerCase();Ie(t,p.currentTarget,'<div class="dk-pop-t">M\xE0u nh\u1EA5n slide</div><div class="dk-sw">'+Fn.map(c=>`<button class="dk-swatch${c.toLowerCase()===a?" on":""}" data-c="${c}" style="background:${c}" title="${c}"></button>`).join("")+`<button class="dk-swatch reset" data-c="" title="Theo m\xE0u theme">${j("reset")}</button></div><label class="dk-pick"><input type="color" id="dk-pick" value="${a||"#2b4182"}"><span>M\xE0u kh\xE1c\u2026</span></label><div class="dk-warn" id="dk-cwarn" hidden></div>`,c=>{let h=c.querySelector("#dk-cwarn"),x=getComputedStyle(n),v=m=>{if(!h)return;if(!m){h.hidden=!0;return}let L=gt(m,x.getPropertyValue("--sl-bg")||"#ffffff",x.getPropertyValue("--sl-navy2")||"#0f2977");L.low&&L.worst!=null?(h.hidden=!1,h.textContent=`\u26A0 T\u01B0\u01A1ng ph\u1EA3n th\u1EA5p (${L.worst.toFixed(1)}:1 \u2014 n\xEAn \u2265 4,5:1). Ch\u1EEF d\xF9ng m\xE0u n\xE0y c\xF3 th\u1EC3 kh\xF3 \u0111\u1ECDc. V\u1EABn d\xF9ng \u0111\u01B0\u1EE3c n\u1EBFu ch\u1EC9 \u0111\u1EC3 trang tr\xED.`):h.hidden=!0};v(a);let C=c.querySelector("#dk-pick");if(C){let m=(L,T)=>{let D=n.style.getPropertyValue("--sl-gold");o.accents[i]=L,n.style.setProperty("--sl-gold",L),n.style.setProperty("--sl-rail",L),T&&(l.pushUndo(()=>{D?(n.style.setProperty("--sl-gold",D),n.style.setProperty("--sl-rail",D),o.accents[i]=D):(n.style.removeProperty("--sl-gold"),n.style.removeProperty("--sl-rail"),o.accents[i]=""),l.onSave(!1)}),l.onSave(!1))};C.oninput=()=>{m(C.value,!1),v(C.value)},C.onchange=()=>m(C.value,!0)}c.querySelectorAll(".dk-swatch").forEach(m=>{m.onclick=()=>{let L=m.getAttribute("data-c")||"";v(L);let T=n.style.getPropertyValue("--sl-gold");o.accents[i]=L,L?(n.style.setProperty("--sl-gold",L),n.style.setProperty("--sl-rail",L)):(n.style.removeProperty("--sl-gold"),n.style.removeProperty("--sl-rail")),l.pushUndo(()=>{T?(n.style.setProperty("--sl-gold",T),n.style.setProperty("--sl-rail",T),o.accents[i]=T):(n.style.removeProperty("--sl-gold"),n.style.removeProperty("--sl-rail"),delete o.accents[i])}),te(),l.onSync(),l.scheduleSave("\u0110\xE3 \u0111\u1ED5i m\xE0u nh\u1EA5n")}})})}),s("dk-filter",p=>{let a=Fe(),c=(h,x,v)=>`<button class="dk-fopt${a===h?" on":""}" data-f="${h}"><b>${u(x)}</b><span>${u(v)}</span></button>`;Ie(t,p.currentTarget,'<div class="dk-pop-t">Hi\u1EC7n slide n\xE0o \u1EDF c\u1ED9t tr\xE1i</div>'+c("","T\u1EA5t c\u1EA3","to\xE0n b\u1ED9 slide c\u1EE7a b\xE0i")+c("skip","Ch\u1EC9 slide \u0111ang \u1EA9n","slide kh\xF4ng tr\xECnh chi\u1EBFu/xu\u1EA5t")+c("lock","Ch\u1EC9 slide nguy\xEAn v\u0103n","l\u1EA5y t\u1EEB gi\xE1o \xE1n \u2014 s\u1EEDa kh\xF4ng \u0103n"),h=>{h.querySelectorAll(".dk-fopt").forEach(x=>{x.onclick=()=>{st(e,x.getAttribute("data-f")||""),te(),l.onSync()}})})}),s("dk-notes",p=>{let a=n.dataset.notes||"";Ie(t,p.currentTarget,`<div class="dk-pop-t">Ghi ch\xFA / \u0111\xE1p \xE1n</div><div class="dk-pop-hint">Kh\xF4ng hi\u1EC7n tr\xEAn slide \u2014 ch\u1EC9 v\xE0o ph\u1EA7n Notes khi xu\u1EA5t .pptx (m\u1EDF Presenter View \u0111\u1EC3 xem).</div><textarea id="dk-notes-ta" class="dk-ta" rows="6" placeholder="V\xED d\u1EE5: \u0110\xC1P \xC1N A \u2014 v\xEC \u2026">${u(a)}</textarea><button id="dk-notes-ok" class="dk-btn primary dk-w">L\u01B0u ghi ch\xFA</button>`,c=>{let h=c.querySelector("#dk-notes-ta");h?.focus();let x=()=>{let C=h?.value||"";return C===(n.dataset.notes||"")?!1:(n.dataset.notes=C,l.onNotes?.(i,C),!0)};je=()=>{x()&&l.scheduleSave("\u0110\xE3 s\u1EEDa ghi ch\xFA")};let v=c.querySelector("#dk-notes-ok");v&&(v.onclick=()=>{let C=x();te(),C&&l.scheduleSave("\u0110\xE3 s\u1EEDa ghi ch\xFA")})})}),s("dk-img",()=>{let p=document.createElement("input");p.type="file",p.accept="image/*",p.onchange=()=>{let a=p.files?.[0];a&&(l.onMsg("\u0110ang x\u1EED l\xFD \u1EA3nh\u2026"),Rn(a,c=>{l.onRequestImage?.(i,c),l.onMsg("\u0110\xE3 g\u1EEDi \u1EA3nh cho h\u1EC7 th\u1ED1ng x\u1EED l\xFD")}))},p.click()}),s("dk-imgx",()=>{l.onRequestImage?.(i,null),l.onMsg("\u0110\xE3 y\xEAu c\u1EA7u g\u1EE1 \u1EA3nh")}),s("dk-regen",()=>{let p=window.prompt("M\xF4 t\u1EA3 \u1EA3nh m\u1EDBi (b\u1ECF tr\u1ED1ng = v\u1EBD l\u1EA1i theo m\xF4 t\u1EA3 c\u0169):","");p!==null&&(l.onRequestRegenImage?.(i,(p||"").trim()),l.onMsg("\u0110\xE3 g\u1EEDi y\xEAu c\u1EA7u v\u1EBD l\u1EA1i \u1EA3nh"))})}var xe=null,Re=null,je=null;function te(){let e=je;je=null;try{e?.()}catch{}xe?.remove(),xe=null,Re?.(),Re=null}function Ie(e,t,n,i){let r=xe?.dataset.for===t.id;if(te(),r)return;let o=document.createElement("div");o.className="dk-pop",o.dataset.for=t.id,o.innerHTML=n;let l=e.closest(".dk-root")||e.parentElement||e;l.appendChild(o);let s=t.getBoundingClientRect(),p=e.getBoundingClientRect(),a=l.getBoundingClientRect();o.style.top=`${s.bottom-a.top+6}px`,o.style.left=`${Math.max(4,Math.min(s.left-a.left,p.right-a.left-o.offsetWidth-4))}px`,xe=o,i?.(o);let c=()=>{let v=document.activeElement;return!!v&&v.tagName==="INPUT"&&(v.type==="color"||v.type==="file")&&o.contains(v)},h=v=>{c()||!o.contains(v.target)&&!t.contains(v.target)&&te()},x=v=>{v.key==="Escape"&&te()};setTimeout(()=>document.addEventListener("mousedown",h),0),document.addEventListener("keydown",x),Re=()=>{document.removeEventListener("mousedown",h),document.removeEventListener("keydown",x)}}function Rn(e,t){let n=new FileReader;n.onload=()=>{let i=new Image;i.onload=()=>{let o=i.width,l=i.height;if(o>1400||l>1400){let p=Math.min(1400/o,1400/l);o=Math.round(o*p),l=Math.round(l*p)}let s=document.createElement("canvas");s.width=o,s.height=l,s.getContext("2d").drawImage(i,0,0,o,l);try{t(s.toDataURL("image/webp",.82))}catch{t(s.toDataURL("image/png"))}},i.src=n.result},n.readAsDataURL(e)}function ft(e){let t=n=>{if(n.nodeType===3)return n.textContent||"";if(n.nodeType!==1)return"";let i=n,r=Array.from(i.childNodes).map(t).join(""),o=i.tagName.toLowerCase();return o==="b"||o==="strong"?`<b>${r}</b>`:o==="i"||o==="em"?`<i>${r}</i>`:o==="sup"||o==="sub"?`<${o}>${r}</${o}>`:o==="br"?" ":o==="button"?"":r};return t(e).replace(/\s+/g," ").trim()}function ye(e,t){let n={};e.querySelectorAll("#scaler > .slide[data-index]").forEach(o=>{if(o.dataset.new)return;let l=o.dataset.index;o.querySelectorAll("[data-e]").forEach(s=>{let p=(s.getAttribute("data-e")||"").split("."),a=ft(s),c=n[l]=n[l]||{},h=p[1];if(h==="bullets")(c.bullets=c.bullets||[]).push(a);else if(h==="columns"){let x=+p[2];c.columns=c.columns||[];let v=c.columns[x]=c.columns[x]||{title:"",bullets:[]};p[3]==="title"?v.title=a:v.bullets.push(a)}else if(h==="table"){let x=+p[2],v=+p[3];c.table=c.table||[],c.table[x]=c.table[x]||[],c.table[x][v]=a}else h==="question"?(c.question=c.question||{},p[2]==="stem"?c.question.stem=a:p[2]==="options"&&((c.question.options=c.question.options||[])[+p[3]]=a)):h==="image"&&p[2]==="title"?c.image_title=a:h==="images"&&p[3]==="title"?(c.images_title=c.images_title||[])[+p[2]]=a:c[h]=a})}),Object.keys(t.kinds).forEach(o=>{n[o]=n[o]||{},n[o].kind=t.kinds[o]}),Object.keys(t.accents).forEach(o=>{n[o]=n[o]||{},n[o].accent=t.accents[o]}),Object.keys(t.columns).forEach(o=>{n[o]=n[o]||{},n[o].columns=t.columns[o]}),Object.keys(t.bullets).forEach(o=>{n[o]=n[o]||{},n[o].bullets=t.bullets[o]});let i=[];Object.keys(t.skipped).forEach(o=>{t.skipped[o]&&i.push(+o)}),n.skipped=i;let r=[];return e.querySelectorAll("#scaler > .slide").forEach(o=>{o.dataset.new?r.push({new:jn(o)}):o.dataset.index!=null&&r.push({ref:+o.dataset.index})}),n.structure=r,n}function jn(e){let t={kind:e.dataset.kind||"content",title:"",subtitle:"",bullets:[],columns:[]};return e.querySelectorAll("[data-e]").forEach(n=>{let i=(n.getAttribute("data-e")||"").split("."),r=i[1],o=ft(n);if(r==="title")t.title=o;else if(r==="subtitle")t.subtitle=o;else if(r==="bullets")o&&t.bullets.push(o);else if(r==="columns"){let l=+i[2];t.columns[l]=t.columns[l]||{title:"",bullets:[]},i[3]==="title"?t.columns[l].title=o:o&&t.columns[l].bullets.push(o)}}),t.columns.length||delete t.columns,t.subtitle||delete t.subtitle,t}function mt(){return{kinds:{},accents:{},skipped:{},columns:{},bullets:{}}}function kt(e){return(e.innerText||"").replace(/\s+/g," ").trim()}function vt(e){let t=[];return e.querySelectorAll("[data-e]").forEach(n=>{if((n.getAttribute("data-e")||"").split(".")[1]==="bullets"){let r=kt(n);r&&t.push(r)}}),t}function xt(e){let t={};return e.querySelectorAll("[data-e]").forEach(n=>{let i=(n.getAttribute("data-e")||"").split(".");if(i[1]!=="columns")return;let r=+i[2],o=kt(n);t[r]=t[r]||{title:"",bullets:[]},i[3]==="title"?t[r].title=o:o&&t[r].bullets.push(o)}),Object.keys(t).sort((n,i)=>+n-+i).map(n=>t[+n])}function yt(e,t){if(!t.length)return[];if(e==="proscons"||e==="comparetable"){let i=Math.ceil(t.length/2);return[{title:e==="proscons"?"\u01AFu \u0111i\u1EC3m":"C\u1ED9t 1",bullets:t.slice(0,i)},{title:e==="proscons"?"Nh\u01B0\u1EE3c \u0111i\u1EC3m":"C\u1ED9t 2",bullets:t.slice(i)}]}let n=e==="bignum"||e==="three"||e==="compare"?3:4;return t.slice(0,n).map(i=>({title:i,bullets:[]}))}function Ct(e){let t=[];return e.forEach(n=>{n.title&&t.push(n.title),n.bullets.forEach(i=>t.push(i))}),t.slice(0,12)}function wt(){return'<div class="slidebar"><button class="edmv" data-d="-1" title="Chuy\u1EC3n l\xEAn">\u25B2</button><button class="edmv" data-d="1" title="Chuy\u1EC3n xu\u1ED1ng">\u25BC</button><button class="eddel" title="Xo\xE1 slide n\xE0y">\u2715</button></div><div class="hd"><div class="kick"></div><div class="ttl" contenteditable="true" data-e="n.title">Ti\xEAu \u0111\u1EC1 slide m\u1EDBi</div></div><div class="rule"></div><div class="foot"></div><div class="pgno"></div><div class="body"><ul class="bul" data-base="n.bullets"><li><span contenteditable="true" data-e="n.bullets.0">N\u1ED9i dung\u2026</span><button class="edx" title="Xo\xE1 \xFD">\xD7</button></li></ul><button class="edadd" data-base="n.bullets">+ \xFD</button></div>'}var Et={compact:"48px",normal:"64px",roomy:"80px"};function Pn(e,t){let n=Number(t?.fontScale);e.style.setProperty("--dk-fs",String(Number.isFinite(n)?Math.min(1.6,Math.max(.6,n)):1));let i=String(t?.fontFamily||"").trim();i?e.style.setProperty("--sl-font",i):e.style.removeProperty("--sl-font");let r=Et[t?.density||""];r?e.style.setProperty("--dk-pad",r):e.style.removeProperty("--dk-pad")}function Ce(e,t,n={}){let i=O(t);n.theme&&(i.theme=n.theme),n.transition&&(i.transition=n.transition);let r=O(JSON.parse(JSON.stringify(t))),o=!!n.edit,l=new Map,s=[],p=[],a=null,c=null,h=null,x=mt(),v=[],C=(d,g)=>l.get(d)?.forEach(f=>{try{f(g)}catch{o&&H(`\u26A0 App ch\u1EE7 b\xE1o l\u1ED7i khi x\u1EED l\xFD "${d}"`,"ed-error")}});function m(){let d=a?.cur()??0;e.innerHTML=le(i,{edit:o,foot:n.foot}),h||(h=document.createElement("style")),e.prepend(h),h.textContent=se(i,{edit:o}),be(e,i.theme||Y),e.classList.toggle("lp-edit",o),getComputedStyle(e).position==="static"&&(e.style.position="relative"),e.style.overflow=e.style.overflow||"hidden",e.classList.add("dk-root"),Pn(e,i.display),a?.destroy(),a=ae(e,{w:i.size?.w,h:i.size?.h,keyboard:n.keyboard,onSlideChange:(g,f)=>{C("slideChange",{index:g,total:f}),o&&(at(e,g),$())}}),a.show(Math.min(d,i.slides.length-1)),o&&(U(),y())}function L(){s.push(JSON.stringify(i)),s.length>60&&s.shift(),p.length=0}function T(d){v.push(d),v.length>80&&v.shift()}function D(){let d=v.pop();if(!d)return!1;try{d()}catch{}return a?.refresh(),y(),!0}function F(d=!0){d&&m(),C("change",i),n.autoSaveMs!==0&&(clearTimeout(c),c=setTimeout(()=>C("save",Ee.getPatch()),n.autoSaveMs??1200))}function H(d,g=""){let f=e.querySelector("#edmsg");f&&(f.textContent=d,f.className=g?`dk-status ${g}`:"dk-status")}let M=()=>new Date().toLocaleTimeString("vi-VN",{hour:"2-digit",minute:"2-digit"}),I="";function b(d){clearTimeout(c),I=d||"",H(d||"C\xF3 thay \u0111\u1ED5i ch\u01B0a l\u01B0u\u2026","ed-dirty"),c=setTimeout(()=>{H(I?`${I} \xB7 \u0110ang l\u01B0u\u2026`:"\u0110ang l\u01B0u\u2026","ed-dirty"),C("save",ye(e,x))},n.autoSaveMs??1200)}function y(){o&&(ot(e,{onSync:d=>{a?.refresh(),y(),b(d)},onMsg:H,pushUndo:T,onGoto:d=>a?.show(d),onDup:Oe,onDel:we}),$())}function $(){o&&bt(e,x,{onMsg:H,onSave:d=>{clearTimeout(c),H(d?"\u0110ang \u0111\u1ED5i b\u1ED1 c\u1EE5c\u2026":"\u0110ang l\u01B0u\u2026","ed-dirty"),C("save",ye(e,x)),d&&setTimeout(()=>m(),100)},onRequestImage:(d,g)=>C("requestImage",{index:d,dataUrl:g}),onRequestRegenImage:(d,g)=>C("requestRegenImage",{index:d,prompt:g}),onReset:()=>C("reset"),pushUndo:T,scheduleSave:b,onAddSlide:z,onPresent:()=>Ee.present(!e.classList.contains("lp-present")),onDup:Oe,onDel:we,onSync:y,onAdapt:(d,g,f)=>{let B=i.slides[g];if(!B)return"";let S=V(B,d);if(!S.ok)return"";if(S.transform==="bulletsToColumns"){let N=vt(f);if(N.length)return x.columns[g]=yt(d,N),"\u0110\xE3 t\xE1ch \xFD th\xE0nh c\u1ED9t cho b\u1ED1 c\u1EE5c m\u1EDBi"}if(S.transform==="columnsToBullets"){let N=Ct(xt(f));if(N.length)return x.bullets[g]=N,"\u0110\xE3 g\u1ED9p c\u1ED9t th\xE0nh c\xE1c \xFD"}return S.willHide?`B\u1ED1 c\u1EE5c m\u1EDBi kh\xF4ng v\u1EBD ${S.willHide} ph\u1EA7n n\u1ED9i dung \u2014 d\u1EEF li\u1EC7u v\u1EABn c\xF2n, \u0111\u1ED5i l\u1EA1i l\xE0 th\u1EA5y`:""}})}let w=null,P=!1;function U(){e.querySelector("#edreset")?.addEventListener("click",()=>C("reset")),!P&&(P=!0,e.addEventListener("click",d=>{let g=d.target;if(g.classList){if(g.classList.contains("edx")){let f=g.closest("li");if(f){let B=f.parentNode,S=f.nextSibling;f.remove(),T(()=>B?.insertBefore(f,S))}b(),d.preventDefault()}else if(g.classList.contains("eddel")){let f=g.closest(".slide");f&&we(f),d.preventDefault(),d.stopPropagation()}else if(g.classList.contains("edmv")){let f=g.closest(".slide"),B=+(g.getAttribute("data-d")||0),S=B<0?f.previousElementSibling:f.nextElementSibling;if(f&&S&&S.classList.contains("slide")){let N=f.parentNode,_=f.nextSibling;B<0?N.insertBefore(f,S):N.insertBefore(S,f),T(()=>N.insertBefore(f,_)),a?.refresh(),y(),b("\u0110\xE3 \u0111\u1ED5i th\u1EE9 t\u1EF1 \u2014 Ctrl+Z \u0111\u1EC3 ho\xE0n t\xE1c")}d.preventDefault(),d.stopPropagation()}else if(g.classList.contains("edadd")){let f=g.getAttribute("data-base")||"",B=g.previousElementSibling;if(B&&B.classList.contains("bul")){let S=document.createElement("li");S.innerHTML=`<span contenteditable="true" data-e="${f}.x">\xDD m\u1EDBi</span><button class="edx" title="Xo\xE1 \xFD">\xD7</button>`,B.appendChild(S),T(()=>S.remove()),ne(S.querySelector("span")),b()}d.preventDefault()}}},!0),e.addEventListener("input",d=>{d.target?.isContentEditable&&b()},!0),e.addEventListener("focusin",d=>{let g=d.target;g?.isContentEditable&&g.setAttribute("data-prev",g.innerHTML)},!0),e.addEventListener("focusout",d=>{let g=d.target;if(!g?.isContentEditable)return;let f=g.getAttribute("data-prev");f!=null&&f!==g.innerHTML&&T(()=>{g.innerHTML=f}),g.removeAttribute("data-prev")},!0),e.addEventListener("keydown",d=>{!(d.ctrlKey||d.metaKey)||d.key!=="s"&&d.key!=="S"||(clearTimeout(c),H("\u0110ang l\u01B0u\u2026","ed-dirty"),C("save",ye(e,x)),d.preventDefault(),d.stopPropagation())},!0),w=d=>{let g=d.altKey&&(d.key==="ArrowUp"||d.key==="ArrowDown"),f=(d.ctrlKey||d.metaKey)&&(d.key==="z"||d.key==="Z");if(!g&&!f||!o||!document.body.contains(e))return;let B=document.activeElement;if(B&&B!==document.body&&!e.contains(B))return;if(d.key==="z"||d.key==="Z"){if(!D()){H("Ch\u01B0a c\xF3 thao t\xE1c n\xE0o \u0111\u1EC3 ho\xE0n t\xE1c"),d.preventDefault();return}H("\u0110\xE3 ho\xE0n t\xE1c thao t\xE1c v\u1EEBa r\u1ED3i"),d.preventDefault(),d.stopPropagation();return}let S=e.querySelector("#scaler > .slide.active");if(!S||!S.parentNode)return;let N=d.key==="ArrowUp",_=N?S.previousElementSibling:S.nextElementSibling;if(!_)return;let $e=S.parentNode,$t=S.nextSibling;N?$e.insertBefore(S,_):$e.insertBefore(S,_.nextSibling),T(()=>{$e.insertBefore(S,$t)}),a?.refresh(),y(),b(`\u0110\xE3 chuy\u1EC3n slide ${N?"l\xEAn":"xu\u1ED1ng"} \u2014 Ctrl+Z \u0111\u1EC3 ho\xE0n t\xE1c`),d.preventDefault(),d.stopPropagation()},document.addEventListener("keydown",w,!0))}function z(){let d=e.querySelector("#scaler");if(!d)return;let g=e.querySelector("#scaler > .slide.active"),f=document.createElement("section");f.className="slide chrome dots",f.setAttribute("data-new","1"),f.setAttribute("data-kind","content"),f.setAttribute("data-nb","1"),f.innerHTML=wt(),g?.nextSibling?d.insertBefore(f,g.nextSibling):d.appendChild(f),T(()=>{f.remove(),a?.refresh()}),a?.refresh();let B=Array.from(e.querySelectorAll("#scaler > .slide")).indexOf(f);B>=0&&a?.show(B),y(),ne(f.querySelector(".ttl")),H("\u0110\xE3 th\xEAm slide m\u1EDBi \xB7 s\u1EEDa n\u1ED9i dung r\u1ED3i L\u01B0u")}function ne(d){if(!d)return;d.focus();let g=document.createRange();g.selectNodeContents(d);let f=getSelection();f&&(f.removeAllRanges(),f.addRange(g))}function Oe(d){let g=d.cloneNode(!0);g.setAttribute("data-new","1"),g.removeAttribute("data-index"),g.classList.remove("active"),d.parentNode.insertBefore(g,d.nextSibling),T(()=>g.remove()),a?.refresh(),y(),b("\u0110\xE3 nh\xE2n b\u1EA3n slide \u2014 Ctrl+Z \u0111\u1EC3 b\u1ECF")}function we(d){if(e.querySelectorAll("#scaler > .slide").length<=1){H("Kh\xF4ng xo\xE1 \u0111\u01B0\u1EE3c: deck ph\u1EA3i c\xF2n \xEDt nh\u1EA5t 1 slide","ed-error");return}let f=d.classList.contains("active"),B=d.nextElementSibling||d.previousElementSibling,S=d.parentNode,N=d.nextSibling;if(d.remove(),T(()=>{S.insertBefore(d,N),a?.refresh();let _=Array.from(e.querySelectorAll("#scaler > .slide")).indexOf(d);_>=0&&a?.show(_)}),a?.refresh(),f&&B){let _=Array.from(e.querySelectorAll("#scaler > .slide")).indexOf(B);_>=0&&a?.show(_)}y(),b("\u0110\xE3 xo\xE1 slide \u2014 Ctrl+Z \u0111\u1EC3 l\u1EA5y l\u1EA1i")}let Ee={goto:d=>a?.show(d),next:()=>a?.next(),prev:()=>a?.prev(),current:()=>a?.cur()??0,count:()=>i.slides.length,present(d){e.classList.toggle("lp-present",d),d?a?.fullscreen():document.fullscreenElement&&document.exitFullscreen()},fit:()=>a?.fit(),setEditMode(d){o=d,m()},setTheme(d){L(),i.theme=d,F()},setTransition(d){L(),i.transition=d,F()},undo(){if(o){D()&&H("\u0110\xE3 ho\xE0n t\xE1c thao t\xE1c v\u1EEBa r\u1ED3i");return}let d=s.pop();d&&(p.push(JSON.stringify(i)),i=JSON.parse(d),F())},redo(){if(o)return;let d=p.pop();d&&(s.push(JSON.stringify(i)),i=JSON.parse(d),F())},getDeck:()=>JSON.parse(JSON.stringify(i)),getPatch:()=>Pe(r,i),setDeck(d){L(),i=O(d),F()},canSetKind(d,g){return V(i.slides[d],g)},setKind(d,g){let f=i.slides[d];return!f||!V(f,g).ok?!1:(L(),i.slides[d]=ee(f,g),F(),!0)},toHTML(){return _e(i,n.foot)},setSaveState(d,g){if(d==="saving")return H("\u0110ang l\u01B0u\u2026","ed-dirty");if(d==="saved")return I="",H(`\u2713 \u0110\xE3 l\u01B0u ${M()}`,"ed-saved");if(d==="dirty")return H("C\xF3 thay \u0111\u1ED5i ch\u01B0a l\u01B0u\u2026","ed-dirty");H(`\u26A0 L\u01AFU H\u1ECENG${g?` \u2014 ${g}`:""} \xB7 Ctrl+S \u0111\u1EC3 th\u1EED l\u1EA1i`,"ed-error")},on(d,g){return l.has(d)||l.set(d,new Set),l.get(d).add(g),()=>l.get(d)?.delete(g)},destroy(){clearTimeout(c),w&&(document.removeEventListener("keydown",w,!0),w=null),a?.destroy(),l.clear(),e.innerHTML="",h=null}};return m(),C("ready",{count:i.slides.length}),Ee}function Pe(e,t){let n=new Map(e.slides.map(l=>[l.id,l])),i={},r=[];for(let l of t.slides){let s=n.get(l.id);if(!s){r.push(l);continue}let p={};for(let a of Object.keys(l))a!=="id"&&JSON.stringify(l[a])!==JSON.stringify(s[a])&&(p[a]=l[a]);Object.keys(p).length&&(i[l.id]=p)}let o=new Set(t.slides.map(l=>l.id));return{slides:i,added:r,order:t.slides.map(l=>l.id),removed:e.slides.filter(l=>!o.has(l.id)).map(l=>l.id),skipped:t.slides.filter(l=>l.skipped).map(l=>l.id)}}function _e(e,t){let n=O(e),i=n.title||"B\xE0i gi\u1EA3ng",r="html,body{margin:0;height:100%;background:#0d0f14;overflow:hidden}",o=W[n.theme||Y]||W[Y],l=Object.entries(o.tokens).map(([h,x])=>`--sl-${h}:${String(x).replace(/[;"<>]/g,"")}`).join(";"),s=Number(n.display?.fontScale),p=Number.isFinite(s)?Math.min(1.6,Math.max(.6,s)):1,a=Et[n.display?.density||""],c=`--dk-fs:${p}`+(a?`;--dk-pad:${a}`:"");return`<!DOCTYPE html><html lang="vi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${i.replace(/[<>&]/g,"")}</title><style>${r}${se(n)}</style></head><body><div class="dk-root" data-theme="${u(o.key)}" data-dark="${o.dark?1:0}" style="height:100%;${l};${c}">`+le(n,{foot:t})+`</div><script>(${_n.toString()})(${n.size?.w||1280},${n.size?.h||720})</script></body></html>`}function _n(e,t){let n=Array.from(document.querySelectorAll("#scaler > .slide")),i=document.getElementById("scaler"),r=0,o=()=>{let a=Math.min((innerWidth-48)/e,(innerHeight-96)/t);a>0&&(i.style.transform=`scale(${a})`)},l=a=>{r=Math.max(0,Math.min(n.length-1,a)),n.forEach((x,v)=>x.classList.toggle("active",v===r));let c=document.getElementById("cnt");c&&(c.textContent=`${r+1} / ${n.length}`);let h=document.getElementById("sprog");h&&(h.style.width=`${(r+1)/n.length*100}%`)};addEventListener("resize",o),addEventListener("keydown",a=>{a.key==="ArrowRight"||a.key==="PageDown"||a.key===" "?(l(r+1),a.preventDefault()):a.key==="ArrowLeft"||a.key==="PageUp"?(l(r-1),a.preventDefault()):a.key==="Home"?l(0):a.key==="End"?l(n.length-1):(a.key==="f"||a.key==="F")&&(document.fullscreenElement?document.exitFullscreen():document.documentElement.requestFullscreen?.())}),document.getElementById("prev").onclick=()=>l(r-1),document.getElementById("next").onclick=()=>l(r+1);let s=document.getElementById("fs");s&&(s.onclick=()=>document.fullscreenElement?document.exitFullscreen():document.documentElement.requestFullscreen?.());let p=document.querySelector(".nav");if(p){let a=document.createElement("button");a.textContent="\u2399",a.title="In / L\u01B0u PDF (Ctrl+P)",a.onclick=()=>print(),p.appendChild(a)}o(),l(0)}function On(e="deck",t="deck-json"){let n=document.getElementById(e),i=document.getElementById(t)?.textContent;if(!n||!i)return;let r;try{r=JSON.parse(i)}catch(l){n.textContent=`Kh\xF4ng \u0111\u1ECDc \u0111\u01B0\u1EE3c d\u1EEF li\u1EC7u slide (JSON h\u1ECFng): ${l.message}`;return}let o=Ce(n,r,{edit:new URLSearchParams(location.search).get("edit")==="1"});window.__deckHandle=o}return At(Gn);})();
