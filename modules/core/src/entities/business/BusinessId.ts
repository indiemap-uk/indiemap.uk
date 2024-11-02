import {newIdFn} from '../../id/newIdFn.js'
import {TypeIDSchema} from '../../id/TypeIDSchema.js'

const businessIdPrefix = 'business'
export const BusinessIdSchema = TypeIDSchema('business')
export const newBusinessId = newIdFn(businessIdPrefix)
