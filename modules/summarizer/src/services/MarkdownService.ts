/** Gets the Markdown for an URL */
export interface MarkdownService {
	get: (url: string) => Promise<string>
}
