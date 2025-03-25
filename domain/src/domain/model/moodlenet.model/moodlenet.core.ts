import { int } from '@moodle/lib-types'
import { isLeft } from 'fp-ts/Either'

export const moodlenetCore: moo.def.model.impl = {
  userHome: {
    create: {
      post:
        ({ model }) =>
        async (outcome, { userHomeRecord: { userId } }) => {
          if (isLeft(outcome)) {
            return
          }
          await model.moodlenet.contributor.create.async({ record: { userId, points: int(0) } })
        },
    },
  },
}
