import { ns } from '../../../lib/ns/namespace'
import { value } from '../../../lib/plug'

export const adapter = value<string>(ns(module, 'adapter'))
