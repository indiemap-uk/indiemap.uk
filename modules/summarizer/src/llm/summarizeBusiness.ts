import {createOpenAI} from '@ai-sdk/openai'
import {toJsonSchema} from '@valibot/to-json-schema'
import {generateObject, jsonSchema} from 'ai'

import type {KVStore} from '../services/KVStore.js'

import {SummaryResponseSchema, type SummaryResponseType} from './SummaryResponseSchema.js'

interface Args {
	apiKey: string
	kvstore: KVStore
	model: string
	systemPrompt: string
	userPrompt: string
}

/**
 * Based on a combined HTML document, enerates the summary of a business as a JSON object using an LLM
 * 
 * An example response looks like this, for https://www.lightleadeddesigns.com/:
 * 
 * ```json
 * summary: {
 * businessTitle: 'Light Leaded Designs',
 * shortDescription: 'Traditional stained glass leadlight window maker. All styles including Victorian, Edwardian, Art Deco, Art Nouveau, modern stained glass bespoke made by Light Leaded Designs',
 * longDescription: 'Situated in the Rossendale Valley, Lancashire. I specialize in the design & manufacture of traditional stained glass & leaded lights. Styles from the traditional Edwardian, Victorian & Art deco through to Modern & Contemporary design. For any repairs or the re-leading of existing windows the work would have to be brought to my workshop. I also resize existing leaded windows in readiness for encapsulation inside double glazed units.',
 * links: [
 *   'https://www.instagram.com/light_leaded_designs/',
 *   'http://www.facebook.com/LightLeadedDesigns',
 *   'https://www.tiktok.com/@lightleadeddesigns'
 * ],
 * products: [
 *   'Traditional stained glass',
 *   'Leaded lights',
 *   'Edwardian style stained glass',
 *   'Victorian style stained glass',
 *   'Art deco style stained glass',
 *   'Modern & Contemporary design stained glass'
 * ],
 * madeInUk: 'all',
 * meta: ''
}
  ```
 */
export const summarizeBusiness = async ({
	apiKey,
	model = 'gpt-4o',
	systemPrompt,
	userPrompt,
}: Args): Promise<SummaryResponseType> => {
	if (!apiKey) {
		throw new Error('No API key provided')
	}

	const openai = createOpenAI({
		apiKey,
		compatibility: 'strict',
	})

	const summaryJsonSchema = toJsonSchema(SummaryResponseSchema)

	const {object} = await generateObject<SummaryResponseType>({
		model: openai(model),
		prompt: userPrompt,
		schema: jsonSchema(summaryJsonSchema),
		system: systemPrompt,
	})

	return object
}
