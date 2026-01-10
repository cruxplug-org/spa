// src/types.ts
//
// Made with ❤️ by Maysara.



// ╔════════════════════════════════════════ TYPE ════════════════════════════════════════╗

    /**
     * SEO Configuration for SPA routes
     * Supports modern E-E-A-T signals and AI Search optimization
     *
     * Translation Support:
     * - title: Use genPageTitle() for RTL-aware page titles
     * - description, keywords, etc: Use t() for translations
     *
     * Meta tag values can be:
     * - Direct string: 'My Title' or 'my.translation.key'
     * - Array [key, fallback]: ['my.key', 'Fallback Title']
     * - Array [key]: ['my.key'] (no fallback)
     */
    export interface SPAPageConfig {
        // Page metadata
        // For title: can be translated via genPageTitle(key) for RTL support
        // Format: string | [translationKey] | [translationKey, fallback]
        title: string | string[];
        path: string;

        // SEO configuration
        // Format: string | [translationKey] | [translationKey, fallback]
        description?: string | string[];
        keywords?: (string | string[])[];

        // E-E-A-T Signals (Google AI Overviews)
        expertise?: string | string[];
        experience?: string | string[];
        authority?: string | string[];

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
     *
     * Supports same translation format as SPAPageConfig:
     * - title: ['meta.error.title', 'Default Title']
     * - description: ['meta.error.desc']
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