import {fail} from './fail.js'
import {fetchMarkdown} from './fetchMarkdown.js'
import {makeBusinessFromSource} from './makeBusinessFromSource.js'
import {makeBusinessFromSummary} from './makeBusinessSummary.js'
import {makeSourceFromUrl} from './makeSourceFromUrl.js'
import {watchMarkdown} from './watchMarkdown.js'

export const taks = {
  fail: fail,
  fetchMarkdown: fetchMarkdown,
  makeBusinessFromSource: makeBusinessFromSource,
  makeBusinessFromSummary: makeBusinessFromSummary,
  makeSourceFromUrl: makeSourceFromUrl,
  watchMarkdown: watchMarkdown,
}

export type TaskName = keyof typeof taks
