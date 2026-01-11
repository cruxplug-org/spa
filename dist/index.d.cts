import { CruxPlugin } from '@cruxjs/base';

/**
 * SEO Configuration for SPA routes
 * Supports modern E-E-A-T signals and AI Search optimization
 *
 * Translation Support:
 * - title: Use genPageTitle() for RTL-aware page titles
 * - description, keywords, etc: Use t() for translations
 *
 * Meta tag values can be:
 * - Direct string: 'My Title'
 * - Translation key: 'my.translation.key'
 */
interface SPAPageConfig {
    title: string;
    path: string;
    description?: string;
    keywords?: string[];
    expertise?: string;
    experience?: string;
    authority?: string;
    contentType?: 'article' | 'product' | 'service' | 'app' | 'workspace' | 'page';
    ogImage?: string;
    canonical?: string;
    robots?: string;
    clientEntry?: string;
    clientScriptPath?: string[];
    clientStylePath?: string[];
}
/**
 * Error Page Configuration
 * Define custom error pages (404, 500, etc.)
 *
 * Supports same translation format as SPAPageConfig:
 * - title: ['meta.error.title', 'Default Title']
 * - description: ['meta.error.desc']
 */
interface ErrorPageConfig extends SPAPageConfig {
    statusCode: number;
}
/**
 * Server SPA Plugin Configuration
 */
interface ServerSPAPluginConfig {
    baseUrl: string;
    pages?: SPAPageConfig[];
    errorPages?: ErrorPageConfig[];
    clientEntry: string;
    clientScriptPath: string[];
    clientStylePath?: string[];
    author?: string;
    authorUrl?: string;
    defaultDescription?: string;
    defaultKeywords?: string[];
    defaultRobots?: string;
    enableAutoNotFound?: boolean;
}

/**
 * Create Server SPA Plugin
 *
 * Generates SPA routes with SEO/CEO metadata and structured data
 * Error pages are handled via CruxJS error hooks
 *
 * Features:
 * - Server-side rendering with full SEO support (meta tags, structured data)
 * - Automatic error page handling (404, 500, etc.)
 *
 * @example
 * ```typescript
 * const spaPlugin = serverSPA({
 *   baseUrl            : 'https://example.com',
 *   clientEntry        : './src/client/browser.tsx',
 *   clientScriptPath   : ['/static/dist/js/browser.js'],
 *   clientStylePath    : ['/static/dist/css/index.css'],
 *   enableAutoNotFound : true,
 *   pages: [
 *     {
 *       title          : 'Home',
 *       path           : '/',
 *       description    : 'Welcome to our platform'
 *     }
 *   ],
 *   errorPages: [
 *     {
 *       statusCode     : 404,
 *       title          : '404 - Not Found',
 *       path           : '/404',
 *       description    : 'Page not found'
 *     }
 *   ]
 * });
 * ```
 */
declare function serverSPA(config: ServerSPAPluginConfig, appConfig?: any): CruxPlugin & {
    __spaErrorHandler?: any;
};

export { type ErrorPageConfig, type SPAPageConfig, type ServerSPAPluginConfig, serverSPA };
