import {TypeIDSchema} from '../../id/TypeIDSchema.js'
import {newIdFn} from '../../id/newIdFn.js'

const businessIdPrefix = 'bsn'
export const BusinessIdSchema = TypeIDSchema(businessIdPrefix)
export const newBusinessId = newIdFn(businessIdPrefix)
