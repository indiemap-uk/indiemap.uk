import type {SummaryResponseType} from './SummaryResponseSchema.js'

export interface SummarizerService {
  makeBusinessSummary(markdowns: string[]): Promise<SummaryResponseType>
  getPromptHash(): string
}
