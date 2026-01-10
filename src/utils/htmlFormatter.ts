// src/utils/htmlFormatter.ts
//
// Made with ❤️ by Maysara.



// ╔════════════════════════════════════════ CORE ════════════════════════════════════════╗

    const VOID_ELEMENTS = ['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr'];

    interface Token {
        type: 'tag' | 'text' | 'comment';
        value: string;
    }

    /**
     * Tokenize HTML into tags, text, and comments
     */
    function tokenize(html: string): Token[] {
        const tokens: Token[] = [];
        const regex = /(<[^>]+>)|([^<]+)/g;
        let match;

        while ((match = regex.exec(html)) !== null) {
            if (match[1]) {
                // It's a tag
                tokens.push({ type: 'tag', value: match[1] });
            } else if (match[2] && match[2].trim().length > 0) {
                // It's text content (not just whitespace)
                tokens.push({ type: 'text', value: match[2] });
            }
        }

        return tokens;
    }

    /**
     * Process tokens and apply indentation
     */
    function processTokens(tokens: Token[], indentSize: number = 4): string[] {
        const indent = ' '.repeat(indentSize);
        const output: string[] = [];
        let indentLevel = 0;

        // eslint-disable-next-line @typescript-eslint/prefer-for-of
        for (let i = 0; i < tokens.length; i++) {
            const token = tokens[i];
            const value = token.value.trim();

            // Decrease indent for closing tags BEFORE adding
            if (value.startsWith('</')) {
                indentLevel = Math.max(0, indentLevel - 1);
            }

            const padding = indent.repeat(indentLevel);

            // Skip empty text nodes
            if (token.type === 'text' && value.length === 0) {
                continue;
            }

            // Add to output
            if (token.type === 'text') {
                // Text nodes - check if previous line exists
                if (output.length > 0 && !output[output.length - 1].trim().endsWith('>')) {
                    // Append to previous line if it doesn't end with tag
                    output[output.length - 1] += value;
                } else {
                    output.push(padding + value);
                }
            } else {
                // Tags and comments
                output.push(padding + value);
            }

            // Increase indent for OPENING tags ONLY (not closing, not void elements, not DOCTYPE/comments)
            if (value.startsWith('<') && !value.startsWith('</')) {
                // Skip DOCTYPE and comments - they don't increase indent
                if (value.startsWith('<!DOCTYPE') || value.startsWith('<!--')) {
                    continue;
                }

                // Extract tag name
                const tagMatch = value.match(/<([A-Za-z][A-Za-z0-9\\-]*)/i);
                const tagName = tagMatch ? tagMatch[1].toLowerCase() : '';

                // Check if it's a void/self-closing element
                const isVoidElement = VOID_ELEMENTS.includes(tagName);
                const isSelfClosing = value.endsWith('/>');

                // Only increase indent if it's NOT a void element AND NOT self-closing
                if (!isVoidElement && !isSelfClosing) {
                    indentLevel++;
                }
            }
        }

        return output;
    }

    /**
     * Format HTML with proper indentation and cleanup
     *
     * - Tokenizes HTML into tags and content
     * - Applies proper indentation (4 spaces per level)
     * - Handles void elements correctly
     * - Preserves script and style tag content
     * - Maintains tag hierarchy
     *
     * @param html Raw HTML string
     * @param indentSize Number of spaces per indent level (default: 4)
     * @returns Formatted HTML with perfect indentation
     */
    export function formatHTML(html: string, indentSize: number = 4): string {
        // Remove existing whitespace and normalize
        const normalized = html
            .split('\n')
            .map(line => line.trim())
            .filter(line => line.length > 0)
            .join('');

        // Tokenize the HTML
        const tokens = tokenize(normalized);

        // Process tokens with indentation
        const lines = processTokens(tokens, indentSize);

        // Join and return
        return lines.join('\n');
    }

// ╚══════════════════════════════════════════════════════════════════════════════════════╝
