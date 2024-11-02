import {newIdFn} from '../../id/newIdFn.js'
import {TypeIDSchema} from '../../id/TypeIDSchema.js'

const businessIdPrefix = 'bsn'
export const BusinessIdSchema = TypeIDSchema(businessIdPrefix)
export const newBusinessId = newIdFn(businessIdPrefix)
