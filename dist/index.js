function p(e,t){let r=e.canonical||`${t.baseUrl}${e.path}`,o=e.robots||t.defaultRobots||"index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",a=e.description||t.defaultDescription||"A modern single-page application",n=(e.keywords||t.defaultKeywords||[]).join(", ");return `
        <!-- \u{1F50D} Core SEO Meta Tags -->
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="${a}" />
        ${n?`<meta name="keywords" content="${n}" />`:""}
        <meta name="robots" content="${o}" />
        <meta name="language" content="en" />
        <meta http-equiv="content-language" content="en-us" />

        <!-- \u{1F465} E-E-A-T Signals for AI Search -->
        ${t.author?`<meta name="author" content="${t.author}" />`:""}
        ${e.expertise?`<meta name="expertise" content="${e.expertise}" />`:""}
        ${e.experience?`<meta name="experience" content="${e.experience}" />`:""}
        ${e.authority?`<meta name="authority" content="${e.authority}" />`:""}

        <!-- \u{1F4F1} Mobile & Performance -->
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="theme-color" content="#000000" />

        <!-- \u{1F517} Canonical & Prefetch -->
        <link rel="canonical" href="${r}" />
        <link rel="prefetch" href="${e.clientScriptPath||t.clientScriptPath}" />

        <!-- \u26A1 Performance & Security -->
        <meta name="format-detection" content="telephone=no" />
        <meta http-equiv="x-ua-compatible" content="IE=edge" />
        ${e.ogImage?`<meta property="og:image" content="${e.ogImage}" />`:""}
        <meta property="og:title" content="${e.title}" />
        <meta property="og:description" content="${a}" />
        <meta property="og:url" content="${r}" />`}function l(e,t,r="WebPage"){let o=e.canonical||`${t.baseUrl}${e.path}`,a={"@context":"https://schema.org","@type":r,name:e.title,url:o,description:e.description||t.defaultDescription,inLanguage:"en",...e.contentType&&{genre:e.contentType},...t.author&&{author:{"@type":"Person",name:t.author,...t.authorUrl&&{url:t.authorUrl}}},...(e.expertise||e.experience||e.authority)&&{creator:{"@type":"Person",name:t.author||"Unknown",...e.expertise&&{expertise:e.expertise},...e.experience&&{experience:e.experience},...e.authority&&{authority:e.authority}}}};return `<script type="application/ld+json">${JSON.stringify(a,null,2)}</script>`}function i(e,t){let r=e.clientScriptPath||t.clientScriptPath;return `<!DOCTYPE html>
<html lang="en">
<head>
    ${p(e,t)}
    ${l(e,t,e.contentType==="article"?"Article":"WebPage")}
</head>
<body>
    <div id="app"></div>
    <script type="module" src="${r}"></script>
</body>
</html>`}function s(e,t){return {method:"GET",path:e.path,handler:r=>{let o=i(e,t);return r.html(o)}}}function P(e,t,r,o){if(o.startsWith("/api/"))return {status:e,headers:{"Content-Type":"application/json"},body:JSON.stringify({error:`Error ${e}`})};if(t.has(e)){let a=t.get(e),n=i(a,r);return {status:e,headers:{"Content-Type":"text/html; charset=utf-8"},body:n}}return {status:e,headers:{"Content-Type":"text/plain"},body:`Error ${e}`}}function c(e,t){return (r,o)=>{let a=P(r,e,t,o);return new Response(a.body,{status:a.status,headers:a.headers})}}function u(){return {statusCode:404,title:"404 - Page Not Found",path:"/404",description:"The page you are looking for could not be found.",keywords:["404","not found","error"],robots:"noindex, nofollow"}}function b(e){let t=[],r=new Map;if(e.pages&&e.pages.length>0)for(let n of e.pages)t.push(s(n,e));if(e.errorPages&&e.errorPages.length>0)for(let n of e.errorPages)r.set(n.statusCode,n),t.push(s(n,e));if(e.enableAutoNotFound&&!r.has(404)){let n=u();r.set(404,n),t.push(s(n,e));}let o=c(r,e);return {name:"@cruxplug/SPA",version:"0.1.0",routes:t,__spaErrorHandler:o,onRegister:async n=>{if(console.log(`[SPA Plugin] Registered ${t.length} SPA routes`),r.size>0){let m=Array.from(r.keys()).join(", ");console.log(`[SPA Plugin] Error pages configured for: ${m}`);}},onAwake:async n=>{console.log("[SPA Plugin] Awake phase - SPA routes ready");},onStart:async n=>{console.log("[SPA Plugin] Start phase - serving SPA");},onReady:async n=>{console.log("[SPA Plugin] Ready phase - SPA is fully operational");}}}export{b as serverSPA};//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map