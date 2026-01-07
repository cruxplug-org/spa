// src/utils/spa.ts
//
// Made with ❤️ by Maysara.



// ╔════════════════════════════════════════ PACK ════════════════════════════════════════╗

    import type { RouteDefinition, AppContext } from '@cruxjs/base';
    import type { SPAPageConfig, ServerSPAPluginConfig } from '../types';
    import { generateSEOMetaTags, generateStructuredData } from './seo';

// ╚══════════════════════════════════════════════════════════════════════════════════════╝



// ╔════════════════════════════════════════ UTIL ════════════════════════════════════════╗

    /**
     * Generate SPA HTML shell with SEO metadata
     *
     * Creates a complete HTML document with:
     * - SEO meta tags
     * - Structured data (JSON-LD)
     * - App mount point (#app)
     * - Client-side JavaScript entry point
     */
    export function generateSPAHTML(
        pageConfig: SPAPageConfig,
        baseConfig: ServerSPAPluginConfig
    ): string {
        const clientScript = pageConfig.clientScriptPath || baseConfig.clientScriptPath;

        return `<!DOCTYPE html>
<html lang="en">
<head>
    ${generateSEOMetaTags(pageConfig, baseConfig)}
    ${generateStructuredData(pageConfig, baseConfig, pageConfig.contentType === 'article' ? 'Article' : 'WebPage')}
</head>
<body>
    <div id="app"></div>
    <script type="module" src="${clientScript}"></script>
</body>
</html>`;
    }

    /**
     * Create SPA route definition for a page
     *
     * Generates a RouteDefinition that handles GET requests
     * and returns the full SPA HTML shell with SEO data
     */
    export function createSPARoute(
        pageConfig: SPAPageConfig,
        baseConfig: ServerSPAPluginConfig
    ): RouteDefinition {
        return {
            method: 'GET',
            path: pageConfig.path,
            handler: (c: AppContext) => {
                const html = generateSPAHTML(pageConfig, baseConfig);
                return c.html(html);
            }
        };
    }

// ╚══════════════════════════════════════════════════════════════════════════════════════╝
