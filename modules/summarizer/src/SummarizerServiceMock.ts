import type {SummarizerService, SummaryResponseType} from '@i/core/summarizer'

export class SummarizerServiceMock implements SummarizerService {
  #seed: Partial<SummaryResponseType> | undefined

  constructor(seed?: Partial<SummaryResponseType>) {
    /* Use seed to override the response */
    this.#seed = seed
  }

  public async makeBusinessSummary(markdowns: string[]): Promise<SummaryResponseType> {
    return {
      businessTitle: 'mock',
      links: ['http://example.com'],
      longDescription: markdowns.map(() => 'mock').join(' '),
      madeInUk: 'unknown',
      meta: '',
      products: ['mock'],
      shortDescription: 'mock',
      ...this.#seed,
    }
  }
}
