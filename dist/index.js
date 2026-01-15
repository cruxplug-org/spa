import {tLang}from'@minejs/server';import {isRTL}from'@minejs/i18n';function d(e,t="",n="en"){if(!e)return t;if(e.includes(".")&&/^[a-z0-9._]+$/.test(e))try{return tLang(n,e,void 0)||e}catch{return e}return e}function g(e,t="",n="en"){return d(e,t,n)}function w(e,t="en"){return !e||e.length===0?"":e.map(r=>d(r,"",t)).filter(Boolean).join(", ")}function y(e,t="en"){if(!e)return "Page";let n=d(e,"",t);try{return v(n,t)}catch{return n}}function v(e,t="en"){let n=tLang(t,"app.name",void 0);return isRTL()?`${n} - ${e}`:`${e} - ${n}`}function S(e,t,n="en"){let r=e.canonical||`${t.baseUrl}${e.path}`,a=e.robots||t.defaultRobots||"index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",i=y(e.title,n),c=g(e.description,t.defaultDescription||"A modern single-page application",n),o=w(e.keywords||t.defaultKeywords,n),s=g(e.expertise,"",n),p=g(e.experience,"",n),l=g(e.authority,"",n),u=e.contentType==="article"?"article":"website";return `<!-- \u{1F50D} Core SEO Meta Tags -->
                <meta charset="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>${i}</title>
                <meta name="description" content="${c}" />
                ${o?`<meta name="keywords" content="${o}" />`:""}
                <meta name="robots" content="${a}" />
                <meta name="language" content="en" />
                <meta http-equiv="content-language" content="en-us" />
                <!-- \u{1F465} E-E-A-T Signals for AI Search -->
                ${t.author?`<meta name="author" content="${t.author}" />`:""}
                ${s?`<meta name="expertise" content="${s}" />`:""}
                ${p?`<meta name="experience" content="${p}" />`:""}
                ${l?`<meta name="authority" content="${l}" />`:""}
                <!-- \u{1F4F1} Mobile & Performance -->
                <meta name="mobile-web-app-capable" content="yes" />
                <meta name="apple-mobile-web-app-capable" content="yes" />
                <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
                <meta name="theme-color" content="#000000" />
                <!-- \u{1F517} Canonical & Prefetch -->
                <link rel="canonical" href="${r}" />
                ${(e.clientScriptPath||t.clientScriptPath)?.map(m=>`<link rel="prefetch" href="${m}" />`).join(`
`)}
                <!-- \u26A1 Performance & Security -->
                <meta name="format-detection" content="telephone=no" />
                <meta http-equiv="x-ua-compatible" content="IE=edge" />
                <!-- \u{1F4D8} Open Graph Protocol (Social Media) -->
                <meta property="og:type" content="${u}" />
                <meta property="og:title" content="${i}" />
                <meta property="og:description" content="${c}" />
                <meta property="og:url" content="${r}" />
                <meta property="og:locale" content="en_US" />
                ${t.author?`<meta property="og:site_name" content="${t.author}" />`:""}
                ${e.ogImage?`<meta property="og:image" content="${e.ogImage}" />`:""}
                ${e.ogImage?`<meta property="og:image:alt" content="${i}" />`:""}
        `}function x(e,t,n="WebPage",r="en"){let a=e.canonical||`${t.baseUrl}${e.path}`,i=y(e.title,r),c=g(e.description,t.defaultDescription,r),o=g(e.expertise,"",r),s=g(e.experience,"",r),p=g(e.authority,"",r),l={"@context":"https://schema.org","@type":n,name:i,url:a,description:c,inLanguage:"en",...e.contentType&&{genre:e.contentType},...t.author&&{author:{"@type":"Person",name:t.author,...t.authorUrl&&{url:t.authorUrl}}},...(o||s||p)&&{creator:{"@type":"Person",name:t.author||"Unknown",...o&&{expertise:o},...s&&{experience:s},...p&&{authority:p}}}};return `<script type="application/ld+json">
${JSON.stringify(l,null,2).split(`
`).map(m=>m&&`    ${m}`).join(`
`)}
</script>`}var R=["area","base","br","col","embed","hr","img","input","link","meta","param","source","track","wbr"];function k(e){let t=[],n=/(<[^>]+>)|([^<]+)/g,r;for(;(r=n.exec(e))!==null;)r[1]?t.push({type:"tag",value:r[1]}):r[2]&&r[2].trim().length>0&&t.push({type:"text",value:r[2]});return t}function L(e,t=4){let n=" ".repeat(t),r=[],a=0;for(let i=0;i<e.length;i++){let c=e[i],o=c.value.trim();o.startsWith("</")&&(a=Math.max(0,a-1));let s=n.repeat(a);if(!(c.type==="text"&&o.length===0)&&(c.type==="text"&&r.length>0&&!r[r.length-1].trim().endsWith(">")?r[r.length-1]+=o:r.push(s+o),o.startsWith("<")&&!o.startsWith("</"))){if(o.startsWith("<!DOCTYPE")||o.startsWith("<!--"))continue;let p=o.match(/<([A-Za-z][A-Za-z0-9\\-]*)/i),l=p?p[1].toLowerCase():"",u=R.includes(l),m=o.endsWith("/>");!u&&!m&&a++;}}return r}function A(e,t=4){let n=e.split(`
`).map(i=>i.trim()).filter(i=>i.length>0).join(""),r=k(n);return L(r,t).join(`
`)}function M(e){let t={defaultLanguage:e?.defaultLanguage||"en",supportedLanguages:e?.supportedLanguages||["en"],basePath:e?.basePath||"i18n/",fileExtension:e?.fileExtension||"json"},n=t.basePath;return n=n.replace(/\\/g,"/"),n.includes("shared/static")?n="static"+(n.split("shared/static")[1]||""):n.startsWith("./")?n=n.slice(2):n.startsWith("/")&&(n=n.slice(1)),n.endsWith("/")||(n+="/"),`<meta name="app-i18n" content='${JSON.stringify({defaultLanguage:t.defaultLanguage,supportedLanguages:t.supportedLanguages,basePath:n,fileExtension:t.fileExtension})}' />`}function f(e,t,n,r="en"){let a=e.clientScriptPath||t.clientScriptPath,i=e.clientStylePath||t.clientStylePath||[],c=a.map(u=>`<script type="module" src="${u}"></script>`).join(`
`),o=i.map(u=>`<link rel="stylesheet" href="${u}" />`).join(`
`),s=M(n);s||console.warn("[SPA] WARNING: i18n meta tag is empty!");let p=`<!DOCTYPE html>
<html>
<head>
${S(e,t,r)}
${x(e,t,e.contentType==="article"?"Article":"WebPage",r)}
${s}
${o}
</head>
<body>
<div id="app"></div>
${c}
</body>
</html>`;p.includes("app-i18n")||console.error("[SPA] ERROR: i18n meta tag NOT in raw HTML!");let l=A(p);return l.includes("app-i18n")||console.error("[SPA] ERROR: i18n meta tag LOST during formatting!"),l}function h(e,t,n){return {method:"GET",path:e.path,handler:r=>{let a=f(e,t,n,r.lang||"en");return r.html(a)}}}function _(){return global.__cruxjs_i18n_config}function $(e){global.__cruxjs_i18n_config=e;}function j(e,t,n,r){if(r.startsWith("/api/"))return {status:e,headers:{"Content-Type":"application/json"},body:JSON.stringify({error:`Error ${e}`})};if(t.has(e)){let a=t.get(e),i=_();console.log(`[Errors] Generating error page ${e} with i18n:`,!!i);let c=f(a,n,i);return {status:e,headers:{"Content-Type":"text/html; charset=utf-8"},body:c}}return console.log(`[Errors] No custom error page for ${e}, returning fallback`),{status:e,headers:{"Content-Type":"text/plain"},body:`Error ${e}`}}function b(e,t){return (n,r)=>{let a=j(n,e,t,r);return new Response(a.body,{status:a.status,headers:a.headers})}}function T(){return {statusCode:404,title:"404 - Page Not Found",path:"/404",description:"The page you are looking for could not be found.",keywords:["404","not found","error"],robots:"noindex, nofollow"}}function K(e,t){let n=[],r=new Map;$(t?.i18n);let a=t?.i18n;if(e.pages&&e.pages.length>0)for(let o of e.pages)n.push(h(o,e,a));if(e.errorPages&&e.errorPages.length>0)for(let o of e.errorPages)r.set(o.statusCode,o),n.push(h(o,e,a));if(e.enableAutoNotFound&&!r.has(404)){let o=T();r.set(404,o),n.push(h(o,e,a));}let i=b(r,e);return {name:"@cruxplug/SPA",version:"0.1.1",routes:n,__spaErrorHandler:i,onRegister:async o=>{if(console.log(`[SPA Plugin] Registered ${n.length} SPA routes`),r.size>0){let s=Array.from(r.keys()).join(", ");console.log(`[SPA Plugin] Error pages configured for: ${s}`);}},onAwake:async o=>{console.log("[SPA Plugin] Awake phase - SPA routes ready");},onStart:async o=>{console.log("[SPA Plugin] Start phase - serving SPA");},onReady:async o=>{console.log("[SPA Plugin] Ready phase - SPA is fully operational");}}}export{K as serverSPA};//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map