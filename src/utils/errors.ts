// src/utils/errors.ts
//
// Made with ❤️ by Maysara.



// ╔════════════════════════════════════════ PACK ════════════════════════════════════════╗

    import type { ErrorPageConfig, ServerSPAPluginConfig } from '../types';
    import { generateSPAHTML } from './spa';

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
     */
    export function buildErrorResponse(
        statusCode: number,
        errorPageMap: Map<number, ErrorPageConfig>,
        baseConfig: ServerSPAPluginConfig,
        path: string
    ): ErrorResponse {
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
            const html = generateSPAHTML(errorConfig, baseConfig);
            return {
                status: statusCode,
                headers: { 'Content-Type': 'text/html; charset=utf-8' },
                body: html
            };
        }

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
     */
    export function createErrorHandler(
        errorPageMap: Map<number, ErrorPageConfig>,
        baseConfig: ServerSPAPluginConfig
    ): (statusCode: number, path: string) => Response {
        return (statusCode: number, path: string) => {
            const errorResponse = buildErrorResponse(statusCode, errorPageMap, baseConfig, path);
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
