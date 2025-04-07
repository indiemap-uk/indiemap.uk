import type {AnswerType} from './AnswerType.js'

export interface SummaryArgs {
	apiKey: string
	model: string
	systemPrompt: string
	userPrompt: string
}

/**
 * Generates a summary using an LLM service
 */
export interface SummaryService {
	chat: (args: SummaryArgs) => Promise<AnswerType>
}
