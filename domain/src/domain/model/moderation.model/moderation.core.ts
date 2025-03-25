import { i_nat } from '@moodle/lib-types'
import { isLeft } from 'fp-ts/Either'

export const moderationCore: moo.def.model.impl = {
  userHome: {
    create: {
      post:
        ({ model }) =>
        async (outcome, { userHomeRecord: { userId } }) => {
          if (isLeft(outcome)) {
            return
          }
          await model.moderation.user.create.async({
            reports: { receivedAmount: { moodlenet: { asContributor: i_nat(0) } } },
            userId,
          })
        },
    },
  },
}
