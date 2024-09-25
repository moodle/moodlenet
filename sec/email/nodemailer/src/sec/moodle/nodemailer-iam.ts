import { sec_factory, sec_impl } from '@moodle/lib-ddd'
import { send } from '../../lib'
import { NodemailerSecEnv } from '../../types'

export function iam(env: NodemailerSecEnv): sec_factory {
  return (/* ctx */) => {
    const iam_sec_impl: sec_impl = {
      moodle: {
        iam: {
          v1_0: {
            sec: {
              email: {
                async sendNow({ reactBody: body, subject, to }) {
                  send({
                    env,
                    body: { contentType: 'react', element: body },
                    to,
                    subject,
                    sender: env.sender,
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
