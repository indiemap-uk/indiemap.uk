import Debug from 'debug'

import {createOpenAI} from '@ai-sdk/openai'
import {type SummarizerService, type SummaryResponseType, SummaryResponseSchema} from '@i/core/summarizer'
import {toJsonSchema} from '@valibot/to-json-schema'
import {generateObject, jsonSchema} from 'ai'
import {siteSummaryInstructions} from './propmpts.js'

const debug = Debug('indie:summarizer:SummarizerService')

/**
 * Service that generates a summary of a business by fetching URLs
 * and passing them to an LLM.
 */
export class SummarizerServiceLLM implements SummarizerService {
  #openAiApiKey: string

  constructor(openAiApiKey: string) {
    this.#openAiApiKey = openAiApiKey
  }

  /**
   * Based on a combined HTML document, enerates the summary of a business as a JSON object using an LLM
   *
   * An example response looks like this, for https://www.lightleadeddesigns.com/:
   *
   * ```json
   * summary: {
   *   businessTitle: 'Light Leaded Designs',
   *   shortDescription: 'Traditional stained glass leadlight window maker. All styles including Victorian, Edwardian, Art Deco, Art Nouveau, modern stained glass bespoke made by Light Leaded Designs',
   *   longDescription: 'Situated in the Rossendale Valley, Lancashire. I specialize in the design & manufacture of traditional stained glass & leaded lights. Styles from the traditional Edwardian, Victorian & Art deco through to Modern & Contemporary design. For any repairs or the re-leading of existing windows the work would have to be brought to my workshop. I also resize existing leaded windows in readiness for encapsulation inside double glazed units.',
   *   links: [
   *     'https://www.instagram.com/light_leaded_designs/',
   *     'http://www.facebook.com/LightLeadedDesigns',
   *     'https://www.tiktok.com/@lightleadeddesigns'
   *   ],
   *   products: [
   *     'Traditional stained glass',
   *     'Leaded lights',
   *     'Edwardian style stained glass',
   *     'Victorian style stained glass',
   *     'Art deco style stained glass',
   *     'Modern & Contemporary design stained glass'
   *   ],
   *   madeInUk: 'all',
   *   meta: ''
   * }
   * ```
   */
  public async makeBusinessSummary(markdowns: string[]): Promise<SummaryResponseType> {
    const combinedMarkdown = markdowns.join('\n\n---\n\n')
    debug('Combined markdown length: %d characters', combinedMarkdown.length)

    debug('Calling LLM to summarize business')

    const openai = createOpenAI({
      apiKey: this.#openAiApiKey,
      compatibility: 'strict',
    })

    const summaryJsonSchema = toJsonSchema(SummaryResponseSchema)

    const {object} = await generateObject<SummaryResponseType>({
      model: openai('gpt-4.1'),
      prompt: combinedMarkdown,
      schema: jsonSchema(summaryJsonSchema),
      system: siteSummaryInstructions,
    })

    return object
  }
}
