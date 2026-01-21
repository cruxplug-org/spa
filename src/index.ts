/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// src/index.ts
//
// Made with ❤️ by Maysara.



// ╔════════════════════════════════════════ PACK ════════════════════════════════════════╗

    import type {
        CruxPlugin,
        AppInstance
    } from '@cruxjs/base';

    import * as types from './types';
    import { createSPARoute } from './utils/spa';
    import { createErrorHandler, createDefault404Page, setGlobalI18nConfig } from './utils/errors';

    export type * from './types';

// ╚══════════════════════════════════════════════════════════════════════════════════════╝



// ╔════════════════════════════════════════ CORE ════════════════════════════════════════╗

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
    export function serverSPA(config: types.ServerSPAPluginConfig, appConfig?: any): CruxPlugin & { __spaErrorHandler?: any } {
        const routes = [];
        const errorPageMap = new Map<number, types.ErrorPageConfig>();

        // Store i18n config globally so ALL handlers can access it (unified!)
        setGlobalI18nConfig(appConfig?.i18n);
        const i18nConfig = appConfig?.i18n;

        // Generate routes from config
        if (config.pages && config.pages.length > 0) {
            for (const pageConfig of config.pages) {
                routes.push(createSPARoute(pageConfig, config, i18nConfig));
            }
        }

        // Setup error pages
        if (config.errorPages && config.errorPages.length > 0) {
            for (const errorPageConfig of config.errorPages) {
                errorPageMap.set(errorPageConfig.statusCode, errorPageConfig);
                // Register error page as a regular route too (for direct access like /404)
                routes.push(createSPARoute(errorPageConfig, config, i18nConfig));
            }
        }

        // Auto-generate 404 page if enabled and not already defined
        if (config.enableAutoNotFound && !errorPageMap.has(404)) {
            const defaultErrorPage = createDefault404Page();
            errorPageMap.set(404, defaultErrorPage);
            // Also register as a regular route
            routes.push(createSPARoute(defaultErrorPage, config, i18nConfig));
        }

        // Create error handler function (uses global i18nConfig automatically!)
        const errorHandler = createErrorHandler(errorPageMap, config);

        const plugin: CruxPlugin & { __spaErrorHandler?: any } = {
            name: '@cruxplug/SPA',
            version: '0.1.6',

            routes,

            // Attach error handler for CruxJS to use
            __spaErrorHandler: errorHandler,

            onRegister: async (app: AppInstance) => {
                if (errorPageMap.size > 0) {
                    const statusCodes = Array.from(errorPageMap.keys()).join(', ');
                }
            },

            onAwake: async (ctx: any) => {
            },

            onStart: async (ctx: any) => {
            },

            onReady: async (ctx: any) => {
            }
        };

        return plugin;
    }

// ╚══════════════════════════════════════════════════════════════════════════════════════╝