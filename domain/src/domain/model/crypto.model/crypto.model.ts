/* eslint-disable @typescript-eslint/no-namespace */
import { plain_password } from '@moodle/lib-types'
const MODEL_NAME = 'crypto'

declare global {
  namespace moo {
    interface Models {
      [MODEL_NAME]: crypto
    }
  }
}
export type crypto = moo.model<cryptoModel>

export type cryptoModel = {
  hashing: {
    password: {
      hash: moo.model.op<['query', { plainPassword: plain_password }, { hash: string }]>
      verify: moo.model.op<['query', { plainPassword: plain_password; hash: string }, { valid: boolean }]>
    }
  }
}
