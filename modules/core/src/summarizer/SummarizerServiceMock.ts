import type {SummarizerService, SummaryResponseType} from './index.js'

export class SummarizerServiceMock implements SummarizerService {
  #seed: Partial<SummaryResponseType> | undefined

  constructor(seed?: Partial<SummaryResponseType>) {
    /* Use seed to override the response */
    this.#seed = seed
  }

  public getPromptHash(): string {
    return 'mock-hash'
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
      town: 'mock town',
      county: 'mock county',
      ...this.#seed,
    }
  }
}
