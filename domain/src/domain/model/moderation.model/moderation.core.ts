import { isLeft } from 'fp-ts/Either'

export const moderationCore: moo.model.impl = {
  userAccount: {
    userAccountSpace: {
      _: userId => ({
        $: {
          create: {
            post: async (outcome, _message, { model, over }) => {
              if (isLeft(outcome)) {
                return
              }
              await over(model.moderation.userModeration[userId]).create.async({
                spaceData: {
                  reports: { received: { moodlenet: {} } },
                },
              })
            },
          },
        },
      }),
    },
  },
}
