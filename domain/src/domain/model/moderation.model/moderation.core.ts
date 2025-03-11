import { i_nat } from '@moodle/lib-types'
import { isLeft } from 'fp-ts/Either'

export const moderationCore: moo.model.impl = {
  userAccount: {
    create: {
      post:
        ({ model }) =>
        async (outcome, { record: { userId } }) => {
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
