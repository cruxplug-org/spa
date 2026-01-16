// src/utils/spa.ts
//
// Made with ❤️ by Maysara.



// ╔════════════════════════════════════════ PACK ════════════════════════════════════════╗

    import type { RouteDefinition, AppContext, AppConfig } from '@cruxjs/base';
    import type { SPAPageConfig, ServerSPAPluginConfig } from '../types';
    import { generateSEOMetaTags, generateStructuredData } from './seo';
    import { formatHTML } from './htmlFormatter';

// ╚══════════════════════════════════════════════════════════════════════════════════════╝



// ╔════════════════════════════════════════ UTIL ════════════════════════════════════════╗

    /**
     * Generate i18n meta tag for client injection
     *
     * The browser.tsx template will read this meta tag and inject
     * i18n config into the ClientManager config automatically.
     *
     * Convert server-side filesystem paths to browser-accessible URLs:
     * ./src/shared/static/dist/i18n → static/dist/i18n/
     *
     * Note: NO leading slash - i18n library needs to fetch as URL (not file path)
     * Always returns a meta tag - never empty!
     */
    function generateI18nMetaTag(i18nConfig: AppConfig['i18n']): string {
        // Provide defaults if config is missing or incomplete
        const config = {
            defaultLanguage: i18nConfig?.defaultLanguage || 'en',
            supportedLanguages: i18nConfig?.supportedLanguages || ['en'],
            basePath: i18nConfig?.basePath || 'i18n/',
            fileExtension: i18nConfig?.fileExtension || 'json'
        };

        // Convert server-side path to browser URL
        let browserPath = config.basePath;

        // Convert path separators to forward slashes
        browserPath = browserPath.replace(/\\/g, '/');

        // Handle server-side paths like ./src/shared/static/dist/i18n
        if (browserPath.includes('shared/static')) {
            // Extract everything after "shared/static" and prepend static/
            const afterStatic = browserPath.split('shared/static')[1] || '';
            browserPath = 'static' + afterStatic;
        } else if (browserPath.startsWith('./')) {
            // Remove leading ./
            browserPath = browserPath.slice(2);
        } else if (browserPath.startsWith('/')) {
            // Remove leading /
            browserPath = browserPath.slice(1);
        }

        // Ensure it ends with /
        if (!browserPath.endsWith('/')) {
            browserPath += '/';
        }

        const i18nJson = JSON.stringify({
            defaultLanguage: config.defaultLanguage,
            supportedLanguages: config.supportedLanguages,
            basePath: browserPath,
            fileExtension: config.fileExtension
        });

        return `<meta name="app-i18n" content='${i18nJson}' />`;
    }

    /**
     * Generate SPA HTML shell with SEO metadata
     *
     * Creates a complete HTML document with:
     * - SEO meta tags
     * - i18n meta tag (read by browser.tsx template)
     * - Structured data (JSON-LD)
     * - App mount point (#app)
     * - Client-side JavaScript and style entry points
     *
     * Output is automatically formatted with proper indentation via formatHTML()
     */
    export async function generateSPAHTML(
        pageConfig: SPAPageConfig,
        baseConfig: ServerSPAPluginConfig,
        i18nConfig?: AppConfig['i18n'],
        lang: string = 'en'
    ): Promise<string> {
        const clientScripts = pageConfig.clientScriptPath || baseConfig.clientScriptPath;
        const clientStyles = pageConfig.clientStylePath || baseConfig.clientStylePath || [];

        const scriptTags = clientScripts
            .map(script => `<script type="module" src="${script}"></script>`)
            .join('\n');

        const styleTags = clientStyles
            .map(style => `<link rel="stylesheet" href="${style}" />`)
            .join('\n');

        // Add i18n meta tag for browser.tsx to read
        const i18nMetaTag = generateI18nMetaTag(i18nConfig);

        // DEBUG: Log to see what's being generated
        if (!i18nMetaTag) {
            console.warn('[SPA] WARNING: i18n meta tag is empty!');
        }

        // Build raw HTML - GUARANTEE i18n meta tag is included!
        const rawHTML = `<!DOCTYPE html>
<html>
<head>
${await generateSEOMetaTags(pageConfig, baseConfig, lang)}
${await generateStructuredData(pageConfig, baseConfig, pageConfig.contentType === 'article' ? 'Article' : 'WebPage', lang)}
${i18nMetaTag}
${styleTags}
</head>
<body>
<div id="app"></div>
${scriptTags}
</body>
</html>`;

        // DEBUG: Check if i18n meta tag is in raw HTML
        if (!rawHTML.includes('app-i18n')) {
            console.error('[SPA] ERROR: i18n meta tag NOT in raw HTML!');
        }

        // Format the HTML with proper indentation
        const formatted = formatHTML(rawHTML);

        // DEBUG: Check if i18n meta tag made it through formatting
        if (!formatted.includes('app-i18n')) {
            console.error('[SPA] ERROR: i18n meta tag LOST during formatting!');
        }

        return formatted;
    }

    /**
     * Create SPA route definition for a page
     *
     * Generates a RouteDefinition that handles GET requests
     * and returns the full SPA HTML shell with SEO data and i18n meta tag
     */
    export function createSPARoute(
        pageConfig: SPAPageConfig,
        baseConfig: ServerSPAPluginConfig,
        i18nConfig?: AppConfig['i18n']
    ): RouteDefinition {
        return {
            method: 'GET',
            path: pageConfig.path,
            handler: async (c: AppContext) => {
                const html = await generateSPAHTML(pageConfig, baseConfig, i18nConfig, c.lang || 'en');
                return c.html(html);
            }
        };
    }

// ╚══════════════════════════════════════════════════════════════════════════════════════╝
