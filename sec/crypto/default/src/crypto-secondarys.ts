import { secondaryBootstrap } from '@moodle/domain'
import { mergeSecondaryAdapters } from '@moodle/domain/lib'
import { joseOpts } from '@moodle/lib-jwt-jose'
import { crypto_secondary_services_factory } from './sec'
import { ArgonPwdHashOpts } from './types'

export interface CryptoDefaultEnv {
  joseOpts: joseOpts
  argonOpts: ArgonPwdHashOpts
}

export function get_default_crypto_secondarys_factory({ joseOpts, argonOpts }: CryptoDefaultEnv): secondaryBootstrap {
  return bootstrapCtx => {
    return secondaryCtx => {
      return mergeSecondaryAdapters([crypto_secondary_services_factory({ joseOpts, argonOpts })(bootstrapCtx)(secondaryCtx)])
    }
  }
}
