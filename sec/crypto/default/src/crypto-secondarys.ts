import { composeImpl, sec_factory } from '@moodle/lib-ddd'
import { joseOpts } from '@moodle/lib-jwt-jose'
import { ArgonPwdHashOpts, iam } from './sec/moodle'

export interface CryptoDefaultEnv {
  joseOpts: joseOpts
  argonOpts: ArgonPwdHashOpts
}

export function get_default_crypto_secondarys_factory({
  joseOpts,
  argonOpts,
}: CryptoDefaultEnv): sec_factory {
  return async function factory(ctx) {
    return composeImpl(await iam({ joseOpts, argonOpts })(ctx))
  }
}
