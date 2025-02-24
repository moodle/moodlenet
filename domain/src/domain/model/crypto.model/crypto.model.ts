/* eslint-disable @typescript-eslint/no-namespace */
import { plain_password } from '@moodle/lib-types'
import { cryptoConfigs } from './types'
declare global {
  namespace moo {
    interface Models {
      crypto: crypto
    }
  }
}
export type crypto = moo.model<CryptoModel>

export type CryptoModel = {
  [moo.configs]: cryptoConfigs
  hashing: {
    password: {
      hash: moo.model.type.endpoint<['query', { plainPassword: plain_password }, { hash: string }]>
      verify: moo.model.type.endpoint<['query', { plainPassword: plain_password; hash: string }, { valid: boolean }]>
    }
  }
}
