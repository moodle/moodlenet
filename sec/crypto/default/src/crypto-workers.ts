import { composeImpl, sec_factory } from '@moodle/domain'
import { joseEnv } from '@moodle/lib-jwt-jose'
import { ArgonPwdHashOpts, iam } from './sec/moodle'

export interface CryptoDefaultEnv {
  joseEnv: joseEnv
  argonOpts: ArgonPwdHashOpts
}

export function get_default_crypto_workers_factory({
  joseEnv,
  argonOpts,
}: CryptoDefaultEnv): sec_factory {
  return function factory(ctx) {
    return composeImpl(iam({ joseEnv, argonOpts })(ctx))
  }
}
