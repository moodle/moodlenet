import { ns } from '../../../lib/ns/namespace'
import { plug } from '../../../lib/plug'

export const adapter = plug<(obj: any, expiresSecs: number) => Promise<string>>(ns(module, 'adapter'))
