<!-- ╔══════════════════════════════ BEG ══════════════════════════════╗ -->

<br>
<div align="center">
    <p>
        <img src="./assets/img/logo.png" alt="logo" style="" height="60" />
    </p>
</div>

<div align="center">
    <img src="https://img.shields.io/badge/v-0.0.4-black"/>
    <img src="https://img.shields.io/badge/🔥-@cruxplug-black"/>
    <br>
    <img src="https://img.shields.io/badge/coverage----%25-brightgreen" alt="Test Coverage" />
    <img src="https://img.shields.io/github/issues/cruxplug-org/spa?style=flat" alt="Github Repo Issues" />
    <img src="https://img.shields.io/github/stars/cruxplug-org/spa?style=social" alt="GitHub Repo stars" />
</div>
<br>

<!-- ╚═════════════════════════════════════════════════════════════════╝ -->



<!-- ╔══════════════════════════════ DOC ══════════════════════════════╗ -->

- ## Quick Start 🔥

    > A production-ready **CruxJS plugin** for serving Single Page Applications (SPAs) with built-in **SEO/CEO support**, **E-E-A-T signals**, and **JSON-LD structured data generation**.

    > Advanced SEO metadata and AI Search optimization

    > Mobile-first meta tags and web app capabilities

    > Structured data for rich snippets and knowledge panels

    > Automatic error page handling (404, 500, etc.)

    > Performance optimization (canonical URLs, prefetching)

    - ### Setup

        > install [`hmm`](https://github.com/maysara-elshewehy/hmm) first.

        ```bash
        hmm i @cruxplug/spa
        ```

    <div align="center"> <img src="./assets/img/line.png" alt="line" style="display: block; margin-top:20px;margin-bottom:20px;width:500px;"/> <br> </div>

    - ### Usage

        ```ts
        import { serverSPA } from '@cruxplug/spa';
        ```

        - #### 1. Basic Usage

            ```typescript
            const spaPlugin = serverSPA({
                baseUrl: 'https://example.com',
                clientEntry: './src/client/browser.tsx',
                clientScriptPath: ['/static/dist/js/app.js'],
                clientStylePath: ['/static/dist/css/style.css'],
                enableAutoNotFound: true,
                pages: [
                    {
                        title: 'Home',
                        path: '/',
                        description: 'Welcome to our platform',
                        keywords: ['home', 'landing']
                    },
                    {
                        title: 'About Us',
                        path: '/about',
                        description: 'Learn more about our company',
                        contentType: 'page'
                    }
                ]
            });

            app.use(spaPlugin);
            ```

        - #### 2. With E-E-A-T Signals (for AI Search)

            ```typescript
            const spaPlugin = serverSPA({
                baseUrl: 'https://example.com',
                clientScriptPath: ['/js/app.js'],
                clientStylePath: ['/css/min.css'],
                clientEntry: './src/client/index.tsx',
                author: 'Your Company Name',
                authorUrl: 'https://example.com/about',
                pages: [
                    {
                        title: 'Blog Post',
                        path: '/blog/seo-guide',
                        description: 'Complete SEO guide for 2026',
                        contentType: 'article',
                        expertise: 'SEO and digital marketing',
                        experience: '10+ years in the industry',
                        authority: 'Published in major tech blogs'
                    }
                ]
            });
            ```

        - ### 3. With Custom Error Pages

            ```typescript
            const spaPlugin = serverSPA({
                baseUrl: 'https://example.com',
                clientScriptPath: ['/js/app.js'],
                clientStylePath: ['/css/min.css'],
                clientEntry: './src/client/index.tsx',
                enableAutoNotFound: true,
                errorPages: [
                    {
                        statusCode: 404,
                        title: '404 - Page Not Found',
                        path: '/404',
                        description: 'The page you're looking for doesn\'t exist',
                        robots: 'noindex, nofollow'
                    },
                    {
                        statusCode: 500,
                        title: '500 - Server Error',
                        path: '/500',
                        description: 'Something went wrong on our end'
                    }
                ]
            });
            ```

    <br>

- ## API Reference 🔥

    ### Core Plugin

    - #### `serverSPA(config: ServerSPAPluginConfig): CruxPlugin`
        > Creates and returns the SPA plugin with SEO support

        **Parameters:**
        - `baseUrl`: Base URL for canonical links and SEO (required)
        - `clientScriptPath`: Array of paths to client-side JS bundles (required)
        - `clientStylePath`: Array of paths to client-side CSS files (optional)
        - `clientEntry`: Path to client entry point (required)
        - `pages`: Array of pages to serve as SPA (optional)
        - `errorPages`: Array of error page configurations (optional)
        - `author`: Author name for structured data (optional)
        - `authorUrl`: Author profile URL (optional)
        - `enableAutoNotFound`: Auto-generate 404 page if true (optional, default: false)
        - `defaultDescription`: Default SEO description (optional)
        - `defaultKeywords`: Default SEO keywords array (optional)
        - `defaultRobots`: Default robots meta tag (optional)

        **Returns:** CruxPlugin with SEO support

        ```typescript
        const plugin = serverSPA({
            baseUrl: 'https://example.com',
            clientScriptPath: ['/js/app.js'],
            clientStylePath: ['/css/min.css'],
            clientEntry: './src/client/index.tsx',
            enableAutoNotFound: true,
            pages: [
                { title: 'Home', path: '/', description: 'Home page' }
            ]
        });
        ```

    ### Type Definitions

    - #### `SPAPageConfig`
        > Configuration for a single SPA page

        ```typescript
        interface SPAPageConfig {
            // Required
            title: string;              // Page title
            path: string;               // Route path

            // SEO
            description?: string;       // Meta description
            keywords?: string[];        // Meta keywords array
            ogImage?: string;          // Open Graph image URL
            canonical?: string;        // Canonical URL
            robots?: string;           // Robots meta tag

            // E-E-A-T Signals (Google AI Overviews)
            expertise?: string;        // Author's expertise
            experience?: string;       // Author's experience
            authority?: string;        // Author's authority

            // Content
            contentType?: 'article' | 'product' | 'service' | 'app' | 'workspace' | 'page';
            clientScriptPath?: string[]; // Override client script paths
            clientStylePath?: string[];   // Override client style paths
            clientEntry?: string;         // Override client entry
        }
        ```

    - #### `ErrorPageConfig`
        > Configuration for error pages

        ```typescript
        interface ErrorPageConfig extends SPAPageConfig {
            statusCode: number;  // HTTP status code (404, 500, etc.)
        }
        ```

    - #### `ServerSPAPluginConfig`
        > Main plugin configuration

        ```typescript
        interface ServerSPAPluginConfig {
            baseUrl: string;
            pages?: SPAPageConfig[];
            errorPages?: ErrorPageConfig[];
            clientEntry: string;
            clientScriptPath: string[];     // Array of script paths
            clientStylePath?: string[];     // Array of style paths
            author?: string;
            authorUrl?: string;
            defaultDescription?: string;
            defaultKeywords?: string[];
            defaultRobots?: string;
            enableAutoNotFound?: boolean;
        }
        ```

    ### Utility Functions (Advanced)

    - #### `generateSEOMetaTags(config, baseConfig): string`
        > Generates SEO meta tags with E-E-A-T signals

        **Features:**
        - Core SEO metadata (charset, viewport, description, keywords)
        - E-E-A-T signals for AI search optimization
        - Mobile optimization (web app capable, status bar)
        - Open Graph protocol tags
        - Performance & security headers

    - #### `generateStructuredData(pageConfig, baseConfig, contentType): string`
        > Generates JSON-LD structured data

        **Features:**
        - Schema.org compatible data
        - Support for multiple content types
        - Rich snippets for search results
        - Author and creator information
        - AI overview optimization

    - #### `generateSPAHTML(pageConfig, baseConfig): string`
        > Generates complete HTML document

        **Features:**
        - Full HTML5 shell with doctype
        - Integrated SEO and structured data
        - App mount point (#app)
        - Multiple module script loading (from array)
        - Multiple stylesheet loading (from array)

    - #### `createSPARoute(pageConfig, baseConfig): RouteDefinition`
        > Creates CruxJS route definition

    - #### `createErrorHandler(errorPageMap, baseConfig): Function`
        > Creates error handler for CruxJS

        **Features:**
        - Differentiates API vs web requests
        - JSON responses for `/api/*` routes
        - Custom HTML pages for web requests
        - Fallback error handling

<!-- ╚═════════════════════════════════════════════════════════════════╝ -->



<!-- ╔══════════════════════════════ END ══════════════════════════════╗ -->

<br>

---

<div align="center">
    <a href="https://github.com/maysara-elshewehy"><img src="https://img.shields.io/badge/by-Maysara-black"/></a>
</div>

<!-- ╚═════════════════════════════════════════════════════════════════╝ -->