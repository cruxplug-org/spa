// src/utils/seo.ts
//
// Made with ❤️ by Maysara.



// ╔════════════════════════════════════════ PACK ════════════════════════════════════════╗

    import type { SPAPageConfig, ServerSPAPluginConfig } from '../types';
    import { t, genPageTitle } from '@minejs/i18n';

// ╚══════════════════════════════════════════════════════════════════════════════════════╝



// ╔════════════════════════════════════════ UTIL ════════════════════════════════════════╗

    /**
     * Detect and translate meta tag values
     *
     * Smart detection for:
     * - Direct string: 'My Title' → 'My Title'
     * - Translation key: 'my.key' → t('my.key')
     * - Array with key + fallback: ['my.key', 'Fallback'] → t('my.key', fallback)
     * - Array with key only: ['my.key'] → t('my.key')
     *
     * Returns the translated value or original string
     */
    function resolveMetaValue(value: string | string[] | undefined, defaultValue: string = ''): string {
        if (!value) return defaultValue;

        // Array format: [translationKey] or [translationKey, fallback]
        if (Array.isArray(value)) {
            const [key, fallback] = value;
            if (!key) return fallback || defaultValue;
            try {
                return t(key) || fallback || key || defaultValue;
            } catch {
                return fallback || key || defaultValue;
            }
        }

        // String format: could be direct value or translation key
        // Try to translate first, if it fails/returns same value, treat as direct string
        try {
            const translated = t(value);
            return translated || value;
        } catch {
            return value;
        }
    }

    /**
     * Resolve keywords with smart translation detection
     *
     * Keywords can be:
     * - Direct string: 'keyword' → 'keyword' (NO translation)
     * - Translation array: ['meta.key'] or ['meta.key', 'fallback'] → translate it
     *
     * This allows keywords: ['404', 'error', 'not found'] without translation
     * And also: [['meta.keywords.error'], ['meta.keywords.notfound']] with translation
     */
    function resolveKeywords(keywords: (string | string[])[] | undefined): string {
        if (!keywords || keywords.length === 0) return '';

        const resolved = keywords
            .map(kw => {
                // String format: use as-is, don't translate
                if (typeof kw === 'string') {
                    return kw;
                }

                // Array format: translate the keyword
                if (Array.isArray(kw)) {
                    const [key, fallback] = kw;
                    if (!key) return fallback || '';
                    try {
                        return t(key) || fallback || key;
                    } catch {
                        return fallback || key;
                    }
                }

                return '';
            })
            .filter(Boolean);

        return resolved.join(', ');
    }

    /**
     * Generate page title with translation support
     *
     * Uses genPageTitle() from @minejs/i18n for RTL-aware titles
     * Detects if value is a translation key and uses it accordingly
     */
    function resolvePageTitle(title: string | string[] | undefined): string {
        if (!title) return 'Page';

        let titleKey = '';

        // Extract translation key if array
        if (Array.isArray(title)) {
            titleKey = title[0] || '';
        } else {
            titleKey = title;
        }

        // Use genPageTitle for RTL-aware title generation
        try {
            return genPageTitle(titleKey, '');
        } catch {
            // Fallback: if genPageTitle fails, use direct value
            if (Array.isArray(title)) {
                return title[1] || title[0] || 'Page';
            }
            return title;
        }
    }

    /**
     * Generate SEO Meta Tags with E-E-A-T signals and translation support
     *
     * Includes:
     * - Core SEO metadata (charset, viewport, description, keywords, robots)
     * - E-E-A-T signals (expertise, experience, authority)
     * - Mobile optimization (web app capable, status bar style)
     * - Performance & security (prefetch, x-ua-compatible)
     * - Open Graph protocol tags
     * - Translation support for all meta values
     */
    export function generateSEOMetaTags(
        config: SPAPageConfig,
        baseConfig: ServerSPAPluginConfig
    ): string {
        const canonicalUrl = config.canonical || `${baseConfig.baseUrl}${config.path}`;
        const robots = config.robots || baseConfig.defaultRobots || 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';

        // Resolve translated values
        const title = resolvePageTitle(config.title);
        const description = resolveMetaValue(config.description, baseConfig.defaultDescription || 'A modern single-page application');
        const keywords = resolveKeywords(config.keywords || baseConfig.defaultKeywords);
        const expertise = resolveMetaValue(config.expertise, '');
        const experience = resolveMetaValue(config.experience, '');
        const authority = resolveMetaValue(config.authority, '');

        // Determine OG type based on content type
        const ogType = config.contentType === 'article' ? 'article' : 'website';

        return `<!-- 🔍 Core SEO Meta Tags -->
                <meta charset="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>${title}</title>
                <meta name="description" content="${description}" />
                ${keywords ? `<meta name="keywords" content="${keywords}" />` : ''}
                <meta name="robots" content="${robots}" />
                <meta name="language" content="en" />
                <meta http-equiv="content-language" content="en-us" />
                <!-- 👥 E-E-A-T Signals for AI Search -->
                ${baseConfig.author ? `<meta name="author" content="${baseConfig.author}" />` : ''}
                ${expertise ? `<meta name="expertise" content="${expertise}" />` : ''}
                ${experience ? `<meta name="experience" content="${experience}" />` : ''}
                ${authority ? `<meta name="authority" content="${authority}" />` : ''}
                <!-- 📱 Mobile & Performance -->
                <meta name="mobile-web-app-capable" content="yes" />
                <meta name="apple-mobile-web-app-capable" content="yes" />
                <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
                <meta name="theme-color" content="#000000" />
                <!-- 🔗 Canonical & Prefetch -->
                <link rel="canonical" href="${canonicalUrl}" />
                ${(config.clientScriptPath || baseConfig.clientScriptPath)?.map(script => `<link rel="prefetch" href="${script}" />`).join('\n')}
                <!-- ⚡ Performance & Security -->
                <meta name="format-detection" content="telephone=no" />
                <meta http-equiv="x-ua-compatible" content="IE=edge" />
                <!-- 📘 Open Graph Protocol (Social Media) -->
                <meta property="og:type" content="${ogType}" />
                <meta property="og:title" content="${title}" />
                <meta property="og:description" content="${description}" />
                <meta property="og:url" content="${canonicalUrl}" />
                <meta property="og:locale" content="en_US" />
                ${baseConfig.author ? `<meta property="og:site_name" content="${baseConfig.author}" />` : ''}
                ${config.ogImage ? `<meta property="og:image" content="${config.ogImage}" />` : ''}
                ${config.ogImage ? `<meta property="og:image:alt" content="${title}" />` : ''}
        `;
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
     * Handles translation keys in meta values
     */
    export function generateStructuredData(
        pageConfig: SPAPageConfig,
        baseConfig: ServerSPAPluginConfig,
        contentType: string = 'WebPage'
    ): string {
        const canonicalUrl = pageConfig.canonical || `${baseConfig.baseUrl}${pageConfig.path}`;

        // Resolve translated values for structured data
        const title = resolvePageTitle(pageConfig.title);
        const description = resolveMetaValue(pageConfig.description, baseConfig.defaultDescription);
        const expertise = resolveMetaValue(pageConfig.expertise, '');
        const experience = resolveMetaValue(pageConfig.experience, '');
        const authority = resolveMetaValue(pageConfig.authority, '');

        const schema = {
            '@context': 'https://schema.org',
            '@type': contentType,
            'name': title,
            'url': canonicalUrl,
            'description': description,
            'inLanguage': 'en',
            ...(pageConfig.contentType && { 'genre': pageConfig.contentType }),
            ...(baseConfig.author && {
                'author': {
                    '@type': 'Person',
                    'name': baseConfig.author,
                    ...(baseConfig.authorUrl && { 'url': baseConfig.authorUrl })
                }
            }),
            ...((expertise || experience || authority) && {
                'creator': {
                    '@type': 'Person',
                    'name': baseConfig.author || 'Unknown',
                    ...(expertise && { 'expertise': expertise }),
                    ...(experience && { 'experience': experience }),
                    ...(authority && { 'authority': authority })
                }
            })
        };

        const jsonStr = JSON.stringify(schema, null, 2)
            .split('\n')
            .map(line => line ? `    ${line}` : line)
            .join('\n');
        return `<script type="application/ld+json">\n${jsonStr}\n</script>`;
    }

// ╚══════════════════════════════════════════════════════════════════════════════════════╝
