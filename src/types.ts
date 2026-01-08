// src/types.ts
//
// Made with ❤️ by Maysara.



// ╔════════════════════════════════════════ TYPE ════════════════════════════════════════╗

    /**
     * SEO Configuration for SPA routes
     * Supports modern E-E-A-T signals and AI Search optimization
     */
    export interface SPAPageConfig {
        // Page metadata
        title: string;
        path: string;

        // SEO configuration
        description?: string;
        keywords?: string[];

        // E-E-A-T Signals (Google AI Overviews)
        expertise?: string;
        experience?: string;
        authority?: string;

        // Content type for AI indexing
        contentType?: 'article' | 'product' | 'service' | 'app' | 'workspace' | 'page';

        // Legacy SEO
        ogImage?: string;
        canonical?: string;
        robots?: string;

        // App entry point
        clientEntry?: string;
        clientScriptPath?: string[];
        clientStylePath?: string[];
    }

    /**
     * Error Page Configuration
     * Define custom error pages (404, 500, etc.)
     */
    export interface ErrorPageConfig extends SPAPageConfig {
        // HTTP status code for this error
        statusCode: number;
    }

    /**
     * Server SPA Plugin Configuration
     */
    export interface ServerSPAPluginConfig {
        // Base URL for canonical links and SEO
        baseUrl: string;

        // Pages to serve as SPA
        pages?: SPAPageConfig[];

        // Error pages configuration (404, 500, etc.)
        errorPages?: ErrorPageConfig[];

        // Client entry point (where cruxjs mounts)
        clientEntry: string;
        clientScriptPath: string[];
        clientStylePath?: string[];

        // Author for structured data
        author?: string;
        authorUrl?: string;

        // Default SEO configuration
        defaultDescription?: string;
        defaultKeywords?: string[];
        defaultRobots?: string;

        // Enable automatic 404 handling for unmatched routes
        // If true and no 404 page defined, creates a default one
        enableAutoNotFound?: boolean;
    }

// ╚══════════════════════════════════════════════════════════════════════════════════════╝