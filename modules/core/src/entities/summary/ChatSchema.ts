import * as v from 'valibot'

/**
 * Schema for a chat message
 */
export const ChatMessageSchema = v.object({
	content: v.string(),
	role: v.string(),
})

/**
 * Schema for a chat request
 */
export const ChatSchema = v.object({
	messages: v.array(ChatMessageSchema),
	model: v.string(),
})
