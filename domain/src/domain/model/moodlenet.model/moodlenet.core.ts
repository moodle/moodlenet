import { int } from '@moodle/lib-types'
import { isLeft } from 'fp-ts/Either'

export const moodlenetCore: moo.model.impl = {
  userAccount: {
    userAccountSpace: {
      _: userId => ({
        $: {
          create: {
            post: async (outcome, _message, { model, over }) => {
              if (isLeft(outcome)) {
                return
              }
              await over(model.moodlenet.contributor[userId]).create.async({ spaceData: { contributor: { points: int(0) } } })
            },
          },
        },
      }),
    },
  },
}
