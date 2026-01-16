/* eslint-disable @typescript-eslint/no-explicit-any */
// src/utils/errors.ts
//
// Made with ❤️ by Maysara.



// ╔════════════════════════════════════════ PACK ════════════════════════════════════════╗

    import type { ErrorPageConfig, ServerSPAPluginConfig } from '../types';
    import { generateSPAHTML } from './spa';

    // Get global i18n config (set by serverSPA plugin)
    export function getGlobalI18nConfig() {
        return (global as any).__cruxjs_i18n_config;
    }

    export function setGlobalI18nConfig(config: any) {
        (global as any).__cruxjs_i18n_config = config;
    }

// ╚══════════════════════════════════════════════════════════════════════════════════════╝



// ╔════════════════════════════════════════ TYPE ════════════════════════════════════════╗

    /**
     * Error response definition
     */
    interface ErrorResponse {
        status: number;
        headers: Record<string, string>;
        body: string;
    }

// ╚══════════════════════════════════════════════════════════════════════════════════════╝



// ╔════════════════════════════════════════ UTIL ════════════════════════════════════════╗

    /**
     * Build error response with appropriate content type
     *
     * Returns HTML for web requests and JSON for API requests
     * Automatically uses global i18n config (no need to pass it!)
     */
    export async function buildErrorResponse(
        statusCode: number,
        errorPageMap: Map<number, ErrorPageConfig>,
        baseConfig: ServerSPAPluginConfig,
        path: string
    ): Promise<ErrorResponse> {
        // API requests get JSON responses
        if (path.startsWith('/api/')) {
            return {
                status: statusCode,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ error: `Error ${statusCode}` })
            };
        }

        // Try to find custom error page
        if (errorPageMap.has(statusCode)) {
            const errorConfig = errorPageMap.get(statusCode)!;
            // Use global i18n config - unified approach!
            const i18nConfig = getGlobalI18nConfig();
            console.log(`[Errors] Generating error page ${statusCode} with i18n:`, !!i18nConfig);
            const html = await generateSPAHTML(errorConfig, baseConfig, i18nConfig);
            return {
                status: statusCode,
                headers: { 'Content-Type': 'text/html; charset=utf-8' },
                body: html
            };
        }

        console.log(`[Errors] No custom error page for ${statusCode}, returning fallback`);
        // Fallback: plain text error
        return {
            status: statusCode,
            headers: { 'Content-Type': 'text/plain' },
            body: `Error ${statusCode}`
        };
    }

    /**
     * Create error handler function for CruxJS
     *
     * Handles:
     * - 404 Not Found pages (with auto-generation support)
     * - Custom error pages by status code
     * - API vs web request differentiation
     * - Fallback error responses
     *
     * No need to pass i18nConfig - uses global!
     */
    export function createErrorHandler(
        errorPageMap: Map<number, ErrorPageConfig>,
        baseConfig: ServerSPAPluginConfig
    ): (statusCode: number, path: string) => Promise<Response> {
        return async (statusCode: number, path: string) => {
            const errorResponse = await buildErrorResponse(statusCode, errorPageMap, baseConfig, path);
            return new Response(errorResponse.body, {
                status: errorResponse.status,
                headers: errorResponse.headers
            });
        };
    }

    /**
     * Create default 404 error page config
     */
    export function createDefault404Page(): ErrorPageConfig {
        return {
            statusCode: 404,
            title: '404 - Page Not Found',
            path: '/404',
            description: 'The page you are looking for could not be found.',
            keywords: ['404', 'not found', 'error'],
            robots: 'noindex, nofollow'
        };
    }

// ╚══════════════════════════════════════════════════════════════════════════════════════╝
