import {BusinessSchema} from '@i/core/business'
import {describe, expect, test} from 'vitest'

import {dbToEntity} from './dbToEntity.js'

describe('dbToEntity', () => {
  test('converts a simple Business', () => {
    const record = {
      created_at: '2024-12-01T22:28:30+00:00',
      description: null,
      id: 'bsn_01je9wm0shecrtvt943e2gddex',
      name: 'asdfsfsdfds',
      town_id: 59,
      updated_at: '2024-12-04T22:28:30+00:00',
    }

    expect(() => dbToEntity(record, BusinessSchema)).not.toThrow()
  })
})
