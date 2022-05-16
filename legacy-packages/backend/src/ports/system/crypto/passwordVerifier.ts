import { ns } from '../../../lib/ns/namespace'
import { plug } from '../../../lib/plug'

export const adapter = plug<(_: { plainPwd: string; pwdHash: string }) => Promise<boolean>>(ns(module, 'adapter'))
