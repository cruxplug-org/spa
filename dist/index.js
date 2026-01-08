function l(e,t){let n=e.canonical||`${t.baseUrl}${e.path}`,o=e.robots||t.defaultRobots||"index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",a=e.description||t.defaultDescription||"A modern single-page application",r=(e.keywords||t.defaultKeywords||[]).join(", ");return `
        <!-- \u{1F50D} Core SEO Meta Tags -->
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="${a}" />
        ${r?`<meta name="keywords" content="${r}" />`:""}
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
        <link rel="canonical" href="${n}" />
        ${(e.clientScriptPath||t.clientScriptPath)?.map(s=>`<link rel="prefetch" href="${s}" />`).join(`
        `)}

        <!-- \u26A1 Performance & Security -->
        <meta name="format-detection" content="telephone=no" />
        <meta http-equiv="x-ua-compatible" content="IE=edge" />
        ${e.ogImage?`<meta property="og:image" content="${e.ogImage}" />`:""}
        <meta property="og:title" content="${e.title}" />
        <meta property="og:description" content="${a}" />
        <meta property="og:url" content="${n}" />`}function c(e,t,n="WebPage"){let o=e.canonical||`${t.baseUrl}${e.path}`,a={"@context":"https://schema.org","@type":n,name:e.title,url:o,description:e.description||t.defaultDescription,inLanguage:"en",...e.contentType&&{genre:e.contentType},...t.author&&{author:{"@type":"Person",name:t.author,...t.authorUrl&&{url:t.authorUrl}}},...(e.expertise||e.experience||e.authority)&&{creator:{"@type":"Person",name:t.author||"Unknown",...e.expertise&&{expertise:e.expertise},...e.experience&&{experience:e.experience},...e.authority&&{authority:e.authority}}}};return `<script type="application/ld+json">${JSON.stringify(a,null,2)}</script>`}function p(e,t){let n=e.clientScriptPath||t.clientScriptPath,o=e.clientStylePath||t.clientStylePath||[],a=n.map(s=>`    <script type="module" src="${s}"></script>`).join(`
`),r=o.map(s=>`    <link rel="stylesheet" href="${s}" />`).join(`
`);return `<!DOCTYPE html>
<html lang="en">
<head>
    ${l(e,t)}
    ${c(e,t,e.contentType==="article"?"Article":"WebPage")}
    ${r||""}
</head>
<body>
    <div id="app"></div>
${a}
</body>
</html>`}function i(e,t){return {method:"GET",path:e.path,handler:n=>{let o=p(e,t);return n.html(o)}}}function P(e,t,n,o){if(o.startsWith("/api/"))return {status:e,headers:{"Content-Type":"application/json"},body:JSON.stringify({error:`Error ${e}`})};if(t.has(e)){let a=t.get(e),r=p(a,n);return {status:e,headers:{"Content-Type":"text/html; charset=utf-8"},body:r}}return {status:e,headers:{"Content-Type":"text/plain"},body:`Error ${e}`}}function u(e,t){return (n,o)=>{let a=P(n,e,t,o);return new Response(a.body,{status:a.status,headers:a.headers})}}function m(){return {statusCode:404,title:"404 - Page Not Found",path:"/404",description:"The page you are looking for could not be found.",keywords:["404","not found","error"],robots:"noindex, nofollow"}}function b(e){let t=[],n=new Map;if(e.pages&&e.pages.length>0)for(let r of e.pages)t.push(i(r,e));if(e.errorPages&&e.errorPages.length>0)for(let r of e.errorPages)n.set(r.statusCode,r),t.push(i(r,e));if(e.enableAutoNotFound&&!n.has(404)){let r=m();n.set(404,r),t.push(i(r,e));}let o=u(n,e);return {name:"@cruxplug/SPA",version:"0.1.0",routes:t,__spaErrorHandler:o,onRegister:async r=>{if(console.log(`[SPA Plugin] Registered ${t.length} SPA routes`),n.size>0){let s=Array.from(n.keys()).join(", ");console.log(`[SPA Plugin] Error pages configured for: ${s}`);}},onAwake:async r=>{console.log("[SPA Plugin] Awake phase - SPA routes ready");},onStart:async r=>{console.log("[SPA Plugin] Start phase - serving SPA");},onReady:async r=>{console.log("[SPA Plugin] Ready phase - SPA is fully operational");}}}export{b as serverSPA};//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map