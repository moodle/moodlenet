import { int } from '@moodle/lib-types'
import { isLeft } from 'fp-ts/Either'

export const moodlenetCore: moo.model.impl = {
  userAccount: {
    user: {
      create: {
        post: async (outcome, { record: { userId } }, { model }) => {
          if (isLeft(outcome)) {
            return
          }
          await model.moodlenet.contributor.create.async({ record: { userId, points: int(0) } })
        },
      },
    },
  },
}
