// src/utils/seo.ts
//
// Made with ❤️ by Maysara.



// ╔════════════════════════════════════════ PACK ════════════════════════════════════════╗

    import type { SPAPageConfig, ServerSPAPluginConfig } from '../types';
    import { tLang } from '@minejs/server';
    import { isRTL } from '@minejs/i18n';

// ╚══════════════════════════════════════════════════════════════════════════════════════╝



// ╔════════════════════════════════════════ UTIL ════════════════════════════════════════╗

    /**
     * Smart parser for string values
     *
     * Intelligently detects if a string is a translation key or plain text:
     * - Translation key format (e.g., 'meta.home.title'): must contain dots, attempts translation via t(key)
     * - Plain text (e.g., 'My Title', 'cruxjs', 'framework'): returns as-is
     *
     * Key format: MUST contain at least one dot (.) to be considered a translation key
     * Examples:
     *   - 'meta.home.title' → translation key → tries t('meta.home.title')
     *   - 'cruxjs' → plain text → returns 'cruxjs'
     *   - 'My Title' → plain text → returns 'My Title'
     *
     * @param value - The string to parse
     * @param defaultValue - Fallback if value is empty
     * @returns Translated value or original string
     */
    function parseValue(value: string | undefined, defaultValue: string = '', lang: string = 'en'): string {
        if (!value) return defaultValue;

        // Check if value looks like a translation key (e.g., 'meta.home.title')
        // Key pattern: MUST contain at least one dot AND be lowercase/numeric/underscores/dots
        const isTranslationKey = value.includes('.') && /^[a-z0-9._]+$/.test(value);

        if (isTranslationKey) {
            try {
                const translated = tLang(lang, value, undefined);
                // If translation returns a value, use it; otherwise fall back to original
                return translated || value;
            } catch {
                // If translation fails, return the original value
                return value;
            }
        }

        // Not a translation key format, return as direct text
        return value;
    }

    /**
     * Resolve meta tag values with smart translation detection
     * Uses parseValue() to automatically detect and translate
     */
    function resolveMetaValue(value: string | undefined, defaultValue: string = '', lang: string = 'en'): string {
        return parseValue(value, defaultValue, lang);
    }

    /**
     * Resolve keywords with smart translation detection
     * Uses parseValue() on each keyword to automatically detect and translate
     */
    function resolveKeywords(keywords: string[] | undefined, lang: string = 'en'): string {
        if (!keywords || keywords.length === 0) return '';

        const resolved = keywords
            .map(kw => parseValue(kw, '', lang))
            .filter(Boolean);

        return resolved.join(', ');
    }

    /**
     * Generate page title with translation support
     *
     * Uses genPageTitle() from @minejs/i18n for RTL-aware titles
     * First parses the value to detect and translate if needed
     */
    function resolvePageTitle(title: string | undefined, lang: string = 'en'): string {
        if (!title) return 'Page';

        // First parse the value to detect translation keys
        const parsedTitle = parseValue(title, '', lang);
        // Use genPageTitle for RTL-aware title generation
        try {
            return genPageTitle(parsedTitle, lang);
        } catch {
            // Fallback: if genPageTitle fails, use parsed value
            return parsedTitle;
        }
    }

    /**
     * Generate page title with proper RTL handling
     *
     * @example
     * // English: "Profile - MyApp"
     * // Arabic: "MyApp - الملف الشخصي"
     */
    export function genPageTitle(val: string, lang: string = 'en'): string {
        const appName = tLang(lang, 'app.name', undefined);
        return isRTL() ? `${appName} - ${val}` : `${val} - ${appName}`;
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
        baseConfig: ServerSPAPluginConfig,
        lang: string = 'en'
    ): string {
        const canonicalUrl = config.canonical || `${baseConfig.baseUrl}${config.path}`;
        const robots = config.robots || baseConfig.defaultRobots || 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';

        // Resolve translated values
        const title = resolvePageTitle(config.title, lang);
        const description = resolveMetaValue(config.description, baseConfig.defaultDescription || 'A modern single-page application', lang);
        const keywords = resolveKeywords(config.keywords || baseConfig.defaultKeywords, lang);
        const expertise = resolveMetaValue(config.expertise, '', lang);
        const experience = resolveMetaValue(config.experience, '', lang);
        const authority = resolveMetaValue(config.authority, '', lang);

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
        contentType: string = 'WebPage',
        lang: string = 'en'
    ): string {
        const canonicalUrl = pageConfig.canonical || `${baseConfig.baseUrl}${pageConfig.path}`;

        // Resolve translated values for structured data
        const title = resolvePageTitle(pageConfig.title, lang);
        const description = resolveMetaValue(pageConfig.description, baseConfig.defaultDescription, lang);
        const expertise = resolveMetaValue(pageConfig.expertise, '', lang);
        const experience = resolveMetaValue(pageConfig.experience, '', lang);
        const authority = resolveMetaValue(pageConfig.authority, '', lang);

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
