import {t}from'@minejs/server';import {isRTL}from'@minejs/i18n';function h(e,t$1=""){if(!e)return t$1;if(e.includes(".")&&/^[a-z0-9._]+$/.test(e))try{return t(e)||e}catch{return e}return e}function u(e,t=""){return h(e,t)}function w(e){return !e||e.length===0?"":e.map(n=>h(n)).filter(Boolean).join(", ")}function P(e){if(!e)return "Page";let t=h(e);try{return v(t)}catch{return t}}function v(e){let t$1=t("app.name");return isRTL()?`${t$1} - ${e}`:`${e} - ${t$1}`}function y(e,t){let n=e.canonical||`${t.baseUrl}${e.path}`,r=e.robots||t.defaultRobots||"index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",a=P(e.title),i=u(e.description,t.defaultDescription||"A modern single-page application"),s=w(e.keywords||t.defaultKeywords),o=u(e.expertise,""),c=u(e.experience,""),l=u(e.authority,""),p=e.contentType==="article"?"article":"website";return `<!-- \u{1F50D} Core SEO Meta Tags -->
                <meta charset="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>${a}</title>
                <meta name="description" content="${i}" />
                ${s?`<meta name="keywords" content="${s}" />`:""}
                <meta name="robots" content="${r}" />
                <meta name="language" content="en" />
                <meta http-equiv="content-language" content="en-us" />
                <!-- \u{1F465} E-E-A-T Signals for AI Search -->
                ${t.author?`<meta name="author" content="${t.author}" />`:""}
                ${o?`<meta name="expertise" content="${o}" />`:""}
                ${c?`<meta name="experience" content="${c}" />`:""}
                ${l?`<meta name="authority" content="${l}" />`:""}
                <!-- \u{1F4F1} Mobile & Performance -->
                <meta name="mobile-web-app-capable" content="yes" />
                <meta name="apple-mobile-web-app-capable" content="yes" />
                <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
                <meta name="theme-color" content="#000000" />
                <!-- \u{1F517} Canonical & Prefetch -->
                <link rel="canonical" href="${n}" />
                ${(e.clientScriptPath||t.clientScriptPath)?.map(g=>`<link rel="prefetch" href="${g}" />`).join(`
`)}
                <!-- \u26A1 Performance & Security -->
                <meta name="format-detection" content="telephone=no" />
                <meta http-equiv="x-ua-compatible" content="IE=edge" />
                <!-- \u{1F4D8} Open Graph Protocol (Social Media) -->
                <meta property="og:type" content="${p}" />
                <meta property="og:title" content="${a}" />
                <meta property="og:description" content="${i}" />
                <meta property="og:url" content="${n}" />
                <meta property="og:locale" content="en_US" />
                ${t.author?`<meta property="og:site_name" content="${t.author}" />`:""}
                ${e.ogImage?`<meta property="og:image" content="${e.ogImage}" />`:""}
                ${e.ogImage?`<meta property="og:image:alt" content="${a}" />`:""}
        `}function S(e,t,n="WebPage"){let r=e.canonical||`${t.baseUrl}${e.path}`,a=P(e.title),i=u(e.description,t.defaultDescription),s=u(e.expertise,""),o=u(e.experience,""),c=u(e.authority,""),l={"@context":"https://schema.org","@type":n,name:a,url:r,description:i,inLanguage:"en",...e.contentType&&{genre:e.contentType},...t.author&&{author:{"@type":"Person",name:t.author,...t.authorUrl&&{url:t.authorUrl}}},...(s||o||c)&&{creator:{"@type":"Person",name:t.author||"Unknown",...s&&{expertise:s},...o&&{experience:o},...c&&{authority:c}}}};return `<script type="application/ld+json">
${JSON.stringify(l,null,2).split(`
`).map(g=>g&&`    ${g}`).join(`
`)}
</script>`}var R=["area","base","br","col","embed","hr","img","input","link","meta","param","source","track","wbr"];function k(e){let t=[],n=/(<[^>]+>)|([^<]+)/g,r;for(;(r=n.exec(e))!==null;)r[1]?t.push({type:"tag",value:r[1]}):r[2]&&r[2].trim().length>0&&t.push({type:"text",value:r[2]});return t}function L(e,t=4){let n=" ".repeat(t),r=[],a=0;for(let i=0;i<e.length;i++){let s=e[i],o=s.value.trim();o.startsWith("</")&&(a=Math.max(0,a-1));let c=n.repeat(a);if(!(s.type==="text"&&o.length===0)&&(s.type==="text"&&r.length>0&&!r[r.length-1].trim().endsWith(">")?r[r.length-1]+=o:r.push(c+o),o.startsWith("<")&&!o.startsWith("</"))){if(o.startsWith("<!DOCTYPE")||o.startsWith("<!--"))continue;let l=o.match(/<([A-Za-z][A-Za-z0-9\\-]*)/i),p=l?l[1].toLowerCase():"",g=R.includes(p),T=o.endsWith("/>");!g&&!T&&a++;}}return r}function x(e,t=4){let n=e.split(`
`).map(i=>i.trim()).filter(i=>i.length>0).join(""),r=k(n);return L(r,t).join(`
`)}function M(e){let t={defaultLanguage:e?.defaultLanguage||"en",supportedLanguages:e?.supportedLanguages||["en"],basePath:e?.basePath||"i18n/",fileExtension:e?.fileExtension||"json"},n=t.basePath;return n=n.replace(/\\/g,"/"),n.includes("shared/static")?n="static"+(n.split("shared/static")[1]||""):n.startsWith("./")?n=n.slice(2):n.startsWith("/")&&(n=n.slice(1)),n.endsWith("/")||(n+="/"),`<meta name="app-i18n" content='${JSON.stringify({defaultLanguage:t.defaultLanguage,supportedLanguages:t.supportedLanguages,basePath:n,fileExtension:t.fileExtension})}' />`}function d(e,t,n){let r=e.clientScriptPath||t.clientScriptPath,a=e.clientStylePath||t.clientStylePath||[],i=r.map(p=>`<script type="module" src="${p}"></script>`).join(`
`),s=a.map(p=>`<link rel="stylesheet" href="${p}" />`).join(`
`),o=M(n);o||console.warn("[SPA] WARNING: i18n meta tag is empty!");let c=`<!DOCTYPE html>
<html lang="en">
<head>
${y(e,t)}
${S(e,t,e.contentType==="article"?"Article":"WebPage")}
${o}
${s}
</head>
<body>
<div id="app"></div>
${i}
</body>
</html>`;c.includes("app-i18n")||console.error("[SPA] ERROR: i18n meta tag NOT in raw HTML!");let l=x(c);return l.includes("app-i18n")||console.error("[SPA] ERROR: i18n meta tag LOST during formatting!"),l}function m(e,t,n){return {method:"GET",path:e.path,handler:r=>{let a=d(e,t,n);return r.html(a)}}}function _(){return global.__cruxjs_i18n_config}function A(e){global.__cruxjs_i18n_config=e;}function j(e,t,n,r){if(r.startsWith("/api/"))return {status:e,headers:{"Content-Type":"application/json"},body:JSON.stringify({error:`Error ${e}`})};if(t.has(e)){let a=t.get(e),i=_();console.log(`[Errors] Generating error page ${e} with i18n:`,!!i);let s=d(a,n,i);return {status:e,headers:{"Content-Type":"text/html; charset=utf-8"},body:s}}return console.log(`[Errors] No custom error page for ${e}, returning fallback`),{status:e,headers:{"Content-Type":"text/plain"},body:`Error ${e}`}}function $(e,t){return (n,r)=>{let a=j(n,e,t,r);return new Response(a.body,{status:a.status,headers:a.headers})}}function b(){return {statusCode:404,title:"404 - Page Not Found",path:"/404",description:"The page you are looking for could not be found.",keywords:["404","not found","error"],robots:"noindex, nofollow"}}function K(e,t){let n=[],r=new Map;A(t?.i18n);let a=t?.i18n;if(e.pages&&e.pages.length>0)for(let o of e.pages)n.push(m(o,e,a));if(e.errorPages&&e.errorPages.length>0)for(let o of e.errorPages)r.set(o.statusCode,o),n.push(m(o,e,a));if(e.enableAutoNotFound&&!r.has(404)){let o=b();r.set(404,o),n.push(m(o,e,a));}let i=$(r,e);return {name:"@cruxplug/SPA",version:"0.1.0",routes:n,__spaErrorHandler:i,onRegister:async o=>{if(console.log(`[SPA Plugin] Registered ${n.length} SPA routes`),r.size>0){let c=Array.from(r.keys()).join(", ");console.log(`[SPA Plugin] Error pages configured for: ${c}`);}},onAwake:async o=>{console.log("[SPA Plugin] Awake phase - SPA routes ready");},onStart:async o=>{console.log("[SPA Plugin] Start phase - serving SPA");},onReady:async o=>{console.log("[SPA Plugin] Ready phase - SPA is fully operational");}}}export{K as serverSPA};//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map