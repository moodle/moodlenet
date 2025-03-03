import { isLeft } from 'fp-ts/Either'

export const homeCore: moo.model.impl = {
  userAccount: {
    userAccountSpace: {
      _: userId => ({
        $: {
          create: {
            post: async (outcome, _message, { model, over }) => {
              if (isLeft(outcome)) {
                return
              }
              await over(model.home.userHome[userId]).create.async({ spaceData: { myDrafts: { edu: { collection: {}, resources: {} } } } })
            },
          },
        },
      }),
    },
  },
}
