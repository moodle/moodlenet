import { NO_JOB_HERE } from '@moodle/domain/lib'
import { joseOpts } from '@moodle/lib-jwt-jose'
import { ArgonPwdHashOpts } from './types'

export interface cryptoDefaultEnv {
  joseOpts: joseOpts
  argonOpts: ArgonPwdHashOpts
}

export function get_default_crypto_secondarys_factory({ joseOpts: _joseOpts, argonOpts: _argonOpts }: cryptoDefaultEnv): moo.def.model.impl {
  const modelImpl: moo.def.model.impl = {
    userHome: NO_JOB_HERE,
  }
  return modelImpl
}
