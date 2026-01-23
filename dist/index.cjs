'use strict';var server=require('@minejs/server'),i18n=require('@minejs/i18n');async function h(t,e="",n="en"){if(!t)return e;if(t.includes(".")&&/^[a-z0-9._]+$/.test(t))try{return await server.tLangAsync(n,t,void 0)||t}catch{return t}return t}async function m(t,e="",n="en"){return await h(t,e,n)}async function E(t,e="en"){return !t||t.length===0?"":t.map(async r=>await h(r,"",e)).filter(Boolean).join(", ")}async function P(t,e="en"){if(!t)return "Page";let n=await h(t,"",e);try{return v(await n,e)}catch{return n}}async function v(t,e="en"){let n=await server.tLangAsync(e,"app.name",void 0);return i18n.isRTL()?`${n} - ${t}`:`${t} - ${n}`}async function S(t,e,n="en"){let r=t.canonical||`${e.baseUrl}${t.path}`,o=t.robots||e.defaultRobots||"index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",i=await P(t.title,n),s=await m(t.description,e.defaultDescription||"A modern single-page application",n),a=await E(t.keywords||e.defaultKeywords,n),c=await m(t.expertise,"",n),p=await m(t.experience,"",n),l=await m(t.authority,"",n),u=t.contentType==="article"?"article":"website";return `<!-- \u{1F50D} Core SEO Meta Tags -->
                <meta charset="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>${i}</title>
                <meta name="description" content="${s}" />
                ${a?`<meta name="keywords" content="${a}" />`:""}
                <meta name="robots" content="${o}" />
                <meta name="language" content="en" />
                <meta http-equiv="content-language" content="en-us" />
                <!-- \u{1F465} E-E-A-T Signals for AI Search -->
                ${e.author?`<meta name="author" content="${e.author}" />`:""}
                ${c?`<meta name="expertise" content="${c}" />`:""}
                ${p?`<meta name="experience" content="${p}" />`:""}
                ${l?`<meta name="authority" content="${l}" />`:""}
                <!-- \u{1F4F1} Mobile & Performance -->
                <meta name="mobile-web-app-capable" content="yes" />
                <meta name="apple-mobile-web-app-capable" content="yes" />
                <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
                <meta name="theme-color" content="#000000" />
                <!-- \u{1F517} Canonical & Prefetch -->
                <link rel="canonical" href="${r}" />
                <!-- \u26A1 Performance & Security -->
                <meta name="format-detection" content="telephone=no" />
                <meta http-equiv="x-ua-compatible" content="IE=edge" />
                <!-- \u{1F4D8} Open Graph Protocol (Social Media) -->
                <meta property="og:type" content="${u}" />
                <meta property="og:title" content="${i}" />
                <meta property="og:description" content="${s}" />
                <meta property="og:url" content="${r}" />
                <meta property="og:locale" content="en_US" />
                ${e.author?`<meta property="og:site_name" content="${e.author}" />`:""}
                ${t.ogImage?`<meta property="og:image" content="${t.ogImage}" />`:""}
                ${t.ogImage?`<meta property="og:image:alt" content="${i}" />`:""}
        `}async function x(t,e,n="WebPage",r="en"){let o=t.canonical||`${e.baseUrl}${t.path}`,i=await P(t.title,r),s=await m(t.description,e.defaultDescription,r),a=await m(t.expertise,""),c=await m(t.experience,""),p=await m(t.authority,""),l={"@context":"https://schema.org","@type":n,name:i,url:o,description:s,inLanguage:"en",...t.contentType&&{genre:t.contentType},...e.author&&{author:{"@type":"Person",name:e.author,...e.authorUrl&&{url:e.authorUrl}}},...(await a||await c||p)&&{creator:{"@type":"Person",name:e.author||"Unknown",...a&&{expertise:a},...c&&{experience:c},...p&&{authority:p}}}};return `<script type="application/ld+json">
${JSON.stringify(l,null,2).split(`
`).map(g=>g&&`    ${g}`).join(`
`)}
</script>`}var R=["area","base","br","col","embed","hr","img","input","link","meta","param","source","track","wbr"];function L(t){let e=[],n=/(<[^>]+>)|([^<]+)/g,r;for(;(r=n.exec(t))!==null;)r[1]?e.push({type:"tag",value:r[1]}):r[2]&&r[2].trim().length>0&&e.push({type:"text",value:r[2]});return e}function M(t,e=4){let n=" ".repeat(e),r=[],o=0;for(let i=0;i<t.length;i++){let s=t[i],a=s.value.trim();a.startsWith("</")&&(o=Math.max(0,o-1));let c=n.repeat(o);if(!(s.type==="text"&&a.length===0)&&(s.type==="text"&&r.length>0&&!r[r.length-1].trim().endsWith(">")?r[r.length-1]+=a:r.push(c+a),a.startsWith("<")&&!a.startsWith("</"))){if(a.startsWith("<!DOCTYPE")||a.startsWith("<!--"))continue;let p=a.match(/<([A-Za-z][A-Za-z0-9\\-]*)/i),l=p?p[1].toLowerCase():"",u=R.includes(l),g=a.endsWith("/>");!u&&!g&&o++;}}return r}function w(t,e=4){let n=t.split(`
`).map(i=>i.trim()).filter(i=>i.length>0).join(""),r=L(n);return M(r,e).join(`
`)}function k(t){let e={defaultLanguage:t?.defaultLanguage||"en",supportedLanguages:t?.supportedLanguages||["en"],basePath:t?.basePath||"i18n/",fileExtension:t?.fileExtension||"json"},n=e.basePath;return n=n.replace(/\\/g,"/"),n.includes("shared/static")?n="static"+(n.split("shared/static")[1]||""):n.startsWith("./")?n=n.slice(2):n.startsWith("/")&&(n=n.slice(1)),n.endsWith("/")||(n+="/"),`<meta name="app-i18n" content='${JSON.stringify({defaultLanguage:e.defaultLanguage,supportedLanguages:e.supportedLanguages,basePath:n,fileExtension:e.fileExtension})}' />`}async function y(t,e,n,r="en"){let o=t.clientScriptPath||e.clientScriptPath,i=t.clientStylePath||e.clientStylePath||[],s=o.map(u=>`<script type="module" src="${u}"></script>`).join(`
`),a=i.map(u=>`<link rel="stylesheet" href="${u}" />`).join(`
`),c=k(n);c||console.warn("[SPA] WARNING: i18n meta tag is empty!");let p=`<!DOCTYPE html>
<html>
<head>
${await S(t,e,r)}
${await x(t,e,t.contentType==="article"?"Article":"WebPage",r)}
${c}
${a}
</head>
<body>
<div id="app"></div>
${s}
</body>
</html>`;p.includes("app-i18n")||console.error("[SPA] ERROR: i18n meta tag NOT in raw HTML!");let l=w(p);return l.includes("app-i18n")||console.error("[SPA] ERROR: i18n meta tag LOST during formatting!"),l}function d(t,e,n){return {method:"GET",path:t.path,handler:async r=>{let o=await y(t,e,n,r.lang||"en");return r.html(o)}}}function _(){return global.__cruxjs_i18n_config}function $(t){global.__cruxjs_i18n_config=t;}async function j(t,e,n,r){if(r.startsWith("/api/"))return {status:t,headers:{"Content-Type":"application/json"},body:JSON.stringify({error:`Error ${t}`})};if(e.has(t)){let o=e.get(t),i=_(),s=await y(o,n,i);return {status:t,headers:{"Content-Type":"text/html; charset=utf-8"},body:s}}return {status:t,headers:{"Content-Type":"text/plain"},body:`Error ${t}`}}function A(t,e){return async(n,r)=>{let o=await j(n,t,e,r);return new Response(o.body,{status:o.status,headers:o.headers})}}function b(){return {statusCode:404,title:"404 - Page Not Found",path:"/404",description:"The page you are looking for could not be found.",keywords:["404","not found","error"],robots:"noindex, nofollow"}}function K(t,e){let n=[],r=new Map;$(e?.i18n);let o=e?.i18n;if(t.pages&&t.pages.length>0)for(let a of t.pages)n.push(d(a,t,o));if(t.errorPages&&t.errorPages.length>0)for(let a of t.errorPages)r.set(a.statusCode,a),n.push(d(a,t,o));if(t.enableAutoNotFound&&!r.has(404)){let a=b();r.set(404,a),n.push(d(a,t,o));}let i=A(r,t);return {name:"@cruxplug/SPA",version:"0.1.7",routes:n,__spaErrorHandler:i,onRegister:async a=>{if(r.size>0){Array.from(r.keys()).join(", ");}},onAwake:async a=>{},onStart:async a=>{},onReady:async a=>{}}}exports.serverSPA=K;//# sourceMappingURL=index.cjs.map
//# sourceMappingURL=index.cjs.map