import { composeImpl, sec_factory } from '@moodle/lib-ddd'
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
  return async function factory(ctx) {
    return composeImpl(await iam({ joseEnv, argonOpts })(ctx))
  }
}
