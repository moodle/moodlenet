import { ns } from '../../../lib/ns/namespace'
import { plug } from '../../../lib/plug'

export const adapter = plug<(jwt: string) => Promise<unknown | typeof INVALID_JWT_TOKEN>>(ns(module, 'adapter'))
export const INVALID_JWT_TOKEN = Symbol('INVALID_JWT_TOKEN')
