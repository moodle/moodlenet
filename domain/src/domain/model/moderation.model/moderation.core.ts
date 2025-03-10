import { i_nat } from '@moodle/lib-types'
import { isLeft } from 'fp-ts/Either'

export const moderationCore: moo.model.impl = {
  userAccount: {
    user: {
      create: {
        post: async (outcome, { record: { userId } }, { model }) => {
          if (isLeft(outcome)) {
            return
          }
          await model.moderation.userModeration.create.async({
            record: {
              reports: { receivedAmount: { moodlenet: { asContributor: i_nat(0) } } },
              userId,
            },
          })
        },
      },
    },
  },
}
