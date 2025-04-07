import type { MarkdownService } from "./MarkdownService.js";

/** A Markdown service that uses https://jina.ai/reader */
export class MarkdownServiceJinaAi implements MarkdownService {
    readonly #apiKey: string;
    
    constructor(apiKey: string) {
        if (!apiKey) {
            throw new Error('No API key provided');
        }

        this.#apiKey = apiKey;
    }
    
    public async get(url: string): Promise<string> {
        const response = await fetch(`https://eu.r.jina.ai/${url}`, {
            headers: {
                "Authorization": `Bearer ${this.#apiKey}`,
                "X-Locale": "en-GB",
                "X-Retain-Images": "none",
                "X-Return-Format": "markdown",
                "X-Timeout": "30", // seconds
                "X-With-Links-Summary": "true" // show unique links at the end (no links in the text)
            }
        });
        
        if (!response.ok) {
            throw new Error(`Failed to fetch from Jina AI: ${response.status} ${response.statusText}`);
        }
        
        return response.text();
    }
}
