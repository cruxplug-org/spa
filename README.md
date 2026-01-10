<!-- ╔══════════════════════════════ BEG ══════════════════════════════╗ -->

<br>
<div align="center">
    <p>
        <img src="./assets/img/logo.png" alt="logo" style="" height="60" />
    </p>
</div>

<div align="center">
    <img src="https://img.shields.io/badge/v-0.0.8-black"/>
    <a href="https://github.com/cruxjs-org"><img src="https://img.shields.io/badge/🔥-@cruxjs-black"/></a>
    <br>
    <img src="https://img.shields.io/badge/coverage-~%25-brightgreen" alt="Test Coverage" />
    <img src="https://img.shields.io/github/issues/cruxplug-org/spa?style=flat" alt="Github Repo Issues" />
    <img src="https://img.shields.io/github/stars/cruxplug-org/spa?style=social" alt="GitHub Repo stars" />
</div>
<br>

<!-- ╚═════════════════════════════════════════════════════════════════╝ -->



<!-- ╔══════════════════════════════ DOC ══════════════════════════════╗ -->

- ## Overview 👀

    - #### Why ?
        > To provide a production-ready server-side SPA plugin with automatic SEO/CEO metadata generation, structured data (JSON-LD), error handling, and i18n integration for modern full-stack applications.

    - #### When ?
        > When you need to:
        > - Serve SPA pages with full SEO support
        > - Generate OpenGraph and structured data
        > - Handle error pages (404, 500, etc.)
        > - Inject i18n configuration from server to client
        > - Support E-E-A-T signals for AI search
        > - Generate beautiful, formatted HTML

        > When you use [@cruxjs/app](https://github.com/cruxjs-org/app).

    <br>
    <br>

- ## Quick Start 🔥

    > install [`hmm`](https://github.com/minejs-org/hmm) first.

    ```bash
    # in your terminal
    hmm i @cruxjs/spa
    ```

    <div align="center"> <img src="./assets/img/line.png" alt="line" style="display: block; margin-top:20px;margin-bottom:20px;width:500px;"/> </div>

    - #### Setup

        > Create your SPA plugin configuration:

        ```typescript
        import { serverSPA } from '@cruxjs/spa';

        const spaPlugin = serverSPA({
            baseUrl             : 'http://localhost:3000',
            clientEntry         : './src/app/client.ts',
            clientScriptPath    : ['/static/dist/js/client.js'],
            clientStylePath     : ['/static/dist/css/min.css'],

            pages: [
                {
                    title       : 'Home - My App',
                    path        : '/',
                    description : 'Welcome to our application'
                }
            ],

            errorPages: [
                {
                    statusCode  : 404,
                    title       : '404 - Not Found',
                    path        : '/*',
                    description : 'The page you\'re looking for doesn\'t exist'
                }
            ],

        }, appConfig);
        ```

        <div align="center"> <img src="./assets/img/line.png" alt="line" style="display: block; margin-top:20px;margin-bottom:20px;width:500px;"/> </div>
        <br>

    - #### Usage

        > Add the plugin to your application:

        ```typescript
        import { createApp, AppConfig } from '@cruxjs/app';
        import { serverSPA }            from '@cruxjs/spa';

        const appConfig: AppConfig = {
            debug               : true,
            server              : { port: 3000, host: 'localhost' },
            // ... rest of configuration
        };

        const spaPlugin = serverSPA({
            baseUrl             : 'http://localhost:3000',
            clientEntry         : './src/app/client.ts',
            clientScriptPath    : ['/static/dist/js/client.js'],
            clientStylePath     : ['/static/dist/css/min.css'],
            pages               : [/* ... */],
        }, appConfig);

        appConfig.plugins!.push(spaPlugin);

        const app = createApp(appConfig);
        app.start();
        ```

        <div align="center"> <img src="./assets/img/line.png" alt="line" style="display: block; margin-top:20px;margin-bottom:20px;width:500px;"/> </div>

        - #### Page Configuration with Translation Support

            ```typescript
            const pages: SPAPageConfig[] = [
                {
                    // Page metadata with translation support
                    // Format: string | ['translationKey'] | ['translationKey', 'Fallback']
                    title       : ['meta.home.title', 'Home'],
                    path        : '/',
                    description : ['meta.home.desc', 'Welcome to our platform'],

                    // Keywords: strings are NOT translated, arrays ARE translated
                    keywords: [
                        'home',                           // Direct string - no translation
                        ['meta.keywords.landing'],        // Translate this keyword
                        ['meta.keywords.welcome', 'Welcome']  // With fallback
                    ],

                    // E-E-A-T Signals with translation support
                    expertise   : 'Full-Stack Web Development',
                    experience  : '2025+',
                    authority   : ['meta.authority', 'CruxJS Framework'],

                    // Content type for AI indexing
                    contentType : 'page',

                    // OpenGraph for social media
                    ogImage     : 'http://localhost:3000/static/img/og-home.png',
                    canonical   : 'http://localhost:3000/'
                }
            ];
            ```

        - #### Error Page Configuration with Translation Support

            ```typescript
            const errorPages: ErrorPageConfig[] = [
                {
                    statusCode  : 404,
                    title       : ['meta.error.title', '404 - Page Not Found'],
                    path        : '/*',
                    description : ['meta.error.desc', 'The page you\'re looking for doesn\'t exist'],
                    keywords    : ['error', '404', 'not found'],  // Direct strings - no translation
                    robots      : 'noindex, nofollow',
                    contentType : 'page'
                },
                {
                    statusCode  : 500,
                    title       : '500 - Server Error',
                    path        : '/500',
                    description : 'Something went wrong on our end'
                }
            ];
            ```

    <br>
    <br>

- ## API Reference 📚

    - ### ..

        ```ts
        ..
        ```


    <br>
    <br>

- ## Integration with @cruxjs/client 🔗

    > When combined with [@cruxjs/client](https://github.com/cruxjs-org/client):

    - ✅ i18n automatically injected via meta tag
    - ✅ All plugin lifecycle hooks execute
    - ✅ Routing immediately available
    - ✅ Translations loaded before component render
    - ✅ Zero boilerplate in user code


<!-- ╚═════════════════════════════════════════════════════════════════╝ -->



<!-- ╔══════════════════════════════ END ══════════════════════════════╗ -->

<br>
<br>

---

<div align="center">
    <a href="https://github.com/maysara-elshewehy"><img src="https://img.shields.io/badge/by-Maysara-black"/></a>
</div>

<!-- ╚═════════════════════════════════════════════════════════════════╝ -->
