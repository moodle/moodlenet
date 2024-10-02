import { moodle_secondary_adapter, moodle_secondary_factory } from '@moodle/domain'
import { send } from '../../lib'
import { NodemailerSecEnv } from '../../types'

export function iam_moodle_secondary_factory(env: NodemailerSecEnv): moodle_secondary_factory {
  return (/* ctx */) => {
    const moodle_secondary_adapter: moodle_secondary_adapter = {
      secondary: {
        iam: {
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
    }
    return moodle_secondary_adapter
  }
}
