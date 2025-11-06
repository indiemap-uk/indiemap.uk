# Task Registry

Add tasks to `tasks` in index.ts so that task names can type safe when calling `addJob`.

# Job workflow for creating a business from URL sources

0. Someone has to create a Source, which is a list of URLs.
1. makeBusinessFromSource: creates 2 jobs:
2. getting the content of the URLs:
   1. fetchMarkdown: downloads the content of all URLs
   2. watchMarkdown - this waits until all markdown is fetched for all URls and then kicks off the next job
3. makeBusinessSummary - creates the business summary using LLM, using the content of all URLs
4. makeBusinessFromSummary: creates the business from the summary using LLM and adds the business ID to the Source
