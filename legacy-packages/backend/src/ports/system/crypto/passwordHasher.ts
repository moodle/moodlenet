import { ns } from '../../../lib/ns/namespace'
import { plug } from '../../../lib/plug'

export const adapter = plug<(pwd: string) => Promise<string>>(ns(module, 'adapter'))
