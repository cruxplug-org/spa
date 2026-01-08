import { CruxPlugin } from '@cruxjs/base';

/**
 * SEO Configuration for SPA routes
 * Supports modern E-E-A-T signals and AI Search optimization
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
 * @example
 * ```typescript
 * const spaPlugin = serverSPA({
 *   baseUrl: 'https://example.com',
 *   clientEntry: './src/client/browser.tsx',
 *   clientScriptPath: '/static/dist/js/min.js',
 *   clientStylePath: '/static/dist/css/min.css',
 *   enableAutoNotFound: true,  // Auto-handle 404s
 *   pages: [
 *     {
 *       title: 'Home',
 *       path: '/',
 *       description: 'Welcome to our platform'
 *     }
 *   ],
 *   errorPages: [
 *     {
 *       statusCode: 404,
 *       title: '404 - Not Found',
 *       path: '/404',
 *       description: 'Page not found'
 *     }
 *   ]
 * });
 * ```
 */
declare function serverSPA(config: ServerSPAPluginConfig): CruxPlugin & {
    __spaErrorHandler?: any;
};

export { serverSPA };
