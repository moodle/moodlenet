import { sec_factory, sec_impl } from '@moodle/lib-ddd'
import * as argon2 from 'argon2'
import { send } from '../../lib'
import { NodemailerSecEnv } from '../../types'
export type ArgonPwdHashOpts = Parameters<typeof argon2.hash>[1]
// ArgonPwdHashOpts : {
//   memoryCost: 100000,
//   timeCost: 8,
//   parallelism: 4,
//   type: argon2id,
// }

export function iam(env: NodemailerSecEnv): sec_factory {
  return ctx => {
    const iam_sec_impl: sec_impl = {
      moodle: {
        iam: {
          v1_0: {
            sec: {
              email: {
                async sendNow({ reactBody: body, subject, to, sender }) {
                  send({
                    env,
                    body: { contentType: 'react', element: body },
                    sender,
                    to,
                    subject,
                  })
                },
              },
            },
          },
        },
      },
    }
    return iam_sec_impl
  }
}
