import { int } from '@moodle/lib-types'
import { isLeft } from 'fp-ts/Either'

export const moodlenetCore: moo.model.impl = {
  userAccount: {
    create: {
      post:
        ({ model }) =>
        async (outcome, { record: { userId } }) => {
          if (isLeft(outcome)) {
            return
          }
          await model.moodlenet.contributor.create.async({ record: { userId, points: int(0) } })
        },
    },
  },
}
