import { moodle_domain, moodle_secondary_factory } from '@moodle/domain'
import { composeDomains } from '@moodle/lib-ddd'
import { joseOpts } from '@moodle/lib-jwt-jose'
import { ArgonPwdHashOpts, iam_crypto_secondary_factory } from './sec/moodle'

export interface CryptoDefaultEnv {
  joseOpts: joseOpts
  argonOpts: ArgonPwdHashOpts
}

export function get_default_crypto_secondarys_factory({
  joseOpts,
  argonOpts,
}: CryptoDefaultEnv): moodle_secondary_factory {
  return function factory(ctx) {
    return composeDomains<moodle_domain>([
      iam_crypto_secondary_factory({ joseOpts, argonOpts })(ctx),
    ])
  }
}
