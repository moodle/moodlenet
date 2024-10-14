import { secondaryAdapter, secondaryBootstrap } from '@moodle/domain'
import { send } from '../../lib'
import { NodemailerSecEnv } from '../../types'

export function iam_secondary_factory(env: NodemailerSecEnv): secondaryBootstrap {
  return bootstrapCtx => {
    return secondaryCtx => {
      const secondaryAdapter: secondaryAdapter = {
        iam: {
          queue: {
            async sendEmail({ reactBody: body, subject, to }) {
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
      }
      return secondaryAdapter
    }
  }
}
