import { sec_factory, sec_impl } from '@moodle/domain'
import * as argon2 from 'argon2'
import { Env } from '../../types'
export type ArgonPwdHashOpts = Parameters<typeof argon2.hash>[1]
// ArgonPwdHashOpts : {
//   memoryCost: 100000,
//   timeCost: 8,
//   parallelism: 4,
//   type: argon2id,
// }

export function iam({ env }: { env: Env }): sec_factory {
  return ctx => {
    const iam_sec_impl: sec_impl = {
      moodle: {
        iam: {
          v0_1: {
            sec: {
              email: {},
            },
          },
        },
      },
    }
    return iam_sec_impl
  }
}
