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
    import { generateSPAHTML, createSPARoute } from './utils/spa';
    import { createErrorHandler, createDefault404Page } from './utils/errors';

// ╚══════════════════════════════════════════════════════════════════════════════════════╝



// ╔════════════════════════════════════════ CORE ════════════════════════════════════════╗

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
     *   clientScriptPath: '/static/dist/js/browser.js',
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
    export function serverSPA(config: types.ServerSPAPluginConfig): CruxPlugin & { __spaErrorHandler?: any } {
        const routes = [];
        const errorPageMap = new Map<number, types.ErrorPageConfig>();

        // Generate routes from config
        if (config.pages && config.pages.length > 0) {
            for (const pageConfig of config.pages) {
                routes.push(createSPARoute(pageConfig, config));
            }
        }

        // Setup error pages
        if (config.errorPages && config.errorPages.length > 0) {
            for (const errorPageConfig of config.errorPages) {
                errorPageMap.set(errorPageConfig.statusCode, errorPageConfig);
                // Register error page as a regular route too (for direct access like /404)
                routes.push(createSPARoute(errorPageConfig, config));
            }
        }

        // Auto-generate 404 page if enabled and not already defined
        if (config.enableAutoNotFound && !errorPageMap.has(404)) {
            const defaultErrorPage = createDefault404Page();
            errorPageMap.set(404, defaultErrorPage);
            // Also register as a regular route
            routes.push(createSPARoute(defaultErrorPage, config));
        }

        // Create error handler function
        const errorHandler = createErrorHandler(errorPageMap, config);

        const plugin: CruxPlugin & { __spaErrorHandler?: any } = {
            name: '@cruxplug/SPA',
            version: '0.1.0',

            routes,

            // Attach error handler for CruxJS to use
            __spaErrorHandler: errorHandler,

            onRegister: async (app: AppInstance) => {
                console.log(`[SPA Plugin] Registered ${routes.length} SPA routes`);
                if (errorPageMap.size > 0) {
                    const statusCodes = Array.from(errorPageMap.keys()).join(', ');
                    console.log(`[SPA Plugin] Error pages configured for: ${statusCodes}`);
                }
            },

            onAwake: async (ctx: any) => {
                console.log('[SPA Plugin] Awake phase - SPA routes ready');
            },

            onStart: async (ctx: any) => {
                console.log('[SPA Plugin] Start phase - serving SPA');
            },

            onReady: async (ctx: any) => {
                console.log('[SPA Plugin] Ready phase - SPA is fully operational');
            }
        };

        return plugin;
    }

// ╚══════════════════════════════════════════════════════════════════════════════════════╝