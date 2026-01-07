// src/utils/seo.ts
//
// Made with ❤️ by Maysara.



// ╔════════════════════════════════════════ PACK ════════════════════════════════════════╗

    import type { SPAPageConfig, ServerSPAPluginConfig } from '../types';

// ╚══════════════════════════════════════════════════════════════════════════════════════╝



// ╔════════════════════════════════════════ UTIL ════════════════════════════════════════╗

    /**
     * Generate SEO Meta Tags with E-E-A-T signals
     *
     * Includes:
     * - Core SEO metadata (charset, viewport, description, keywords, robots)
     * - E-E-A-T signals (expertise, experience, authority)
     * - Mobile optimization (web app capable, status bar style)
     * - Performance & security (prefetch, x-ua-compatible)
     * - Open Graph protocol tags
     */
    export function generateSEOMetaTags(
        config: SPAPageConfig,
        baseConfig: ServerSPAPluginConfig
    ): string {
        const canonicalUrl = config.canonical || `${baseConfig.baseUrl}${config.path}`;
        const robots = config.robots || baseConfig.defaultRobots || 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';
        const description = config.description || baseConfig.defaultDescription || 'A modern single-page application';
        const keywords = (config.keywords || baseConfig.defaultKeywords || []).join(', ');

        return `
        <!-- 🔍 Core SEO Meta Tags -->
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="${description}" />
        ${keywords ? `<meta name="keywords" content="${keywords}" />` : ''}
        <meta name="robots" content="${robots}" />
        <meta name="language" content="en" />
        <meta http-equiv="content-language" content="en-us" />

        <!-- 👥 E-E-A-T Signals for AI Search -->
        ${baseConfig.author ? `<meta name="author" content="${baseConfig.author}" />` : ''}
        ${config.expertise ? `<meta name="expertise" content="${config.expertise}" />` : ''}
        ${config.experience ? `<meta name="experience" content="${config.experience}" />` : ''}
        ${config.authority ? `<meta name="authority" content="${config.authority}" />` : ''}

        <!-- 📱 Mobile & Performance -->
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="theme-color" content="#000000" />

        <!-- 🔗 Canonical & Prefetch -->
        <link rel="canonical" href="${canonicalUrl}" />
        <link rel="prefetch" href="${config.clientScriptPath || baseConfig.clientScriptPath}" />

        <!-- ⚡ Performance & Security -->
        <meta name="format-detection" content="telephone=no" />
        <meta http-equiv="x-ua-compatible" content="IE=edge" />
        ${config.ogImage ? `<meta property="og:image" content="${config.ogImage}" />` : ''}
        <meta property="og:title" content="${config.title}" />
        <meta property="og:description" content="${description}" />
        <meta property="og:url" content="${canonicalUrl}" />`;
    }

    /**
     * Generate JSON-LD Structured Data
     *
     * Creates schema.org compatible structured data for:
     * - Rich snippets in search results
     * - AI overviews and knowledge panels
     * - Better indexing and SEO
     *
     * Supports multiple content types: WebPage, Article, Product, Service, etc.
     */
    export function generateStructuredData(
        pageConfig: SPAPageConfig,
        baseConfig: ServerSPAPluginConfig,
        contentType: string = 'WebPage'
    ): string {
        const canonicalUrl = pageConfig.canonical || `${baseConfig.baseUrl}${pageConfig.path}`;

        const schema = {
            '@context': 'https://schema.org',
            '@type': contentType,
            'name': pageConfig.title,
            'url': canonicalUrl,
            'description': pageConfig.description || baseConfig.defaultDescription,
            'inLanguage': 'en',
            ...(pageConfig.contentType && { 'genre': pageConfig.contentType }),
            ...(baseConfig.author && {
                'author': {
                    '@type': 'Person',
                    'name': baseConfig.author,
                    ...(baseConfig.authorUrl && { 'url': baseConfig.authorUrl })
                }
            }),
            ...(pageConfig.expertise || pageConfig.experience || pageConfig.authority) && {
                'creator': {
                    '@type': 'Person',
                    'name': baseConfig.author || 'Unknown',
                    ...(pageConfig.expertise && { 'expertise': pageConfig.expertise }),
                    ...(pageConfig.experience && { 'experience': pageConfig.experience }),
                    ...(pageConfig.authority && { 'authority': pageConfig.authority })
                }
            }
        };

        return `<script type="application/ld+json">${JSON.stringify(schema, null, 2)}</script>`;
    }

// ╚══════════════════════════════════════════════════════════════════════════════════════╝
