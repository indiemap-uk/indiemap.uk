import {describe, expect, test} from 'vitest'
import {fetchMarkdown} from '../tasks/fetchMarkdown.js'
import {getDeps} from './getDeps.js'
import {mockHelpers} from './mockHelpers.js'

// This was only useful to figure out how to test a task
describe('fetchMarkdown', () => {
  const deps = getDeps()

  test('fetches markdown content', async () => {
    const url = 'http://example.com/1'
    const task = fetchMarkdown(deps)

    const promises = await task([url], mockHelpers)
    await Promise.all(promises as any)

    const md = await deps.kvstore.get(`md:${url}`)

    expect(md).toBe('Mock')
  })
})
