import { isLeft } from 'fp-ts/Either'

export const homeCore: moo.model.impl = {
  userAccount: {
    user: {
      create: {
        post: async (outcome, { record: { userId } }, { model }) => {
          if (isLeft(outcome)) {
            return
          }
          await model.home.userHome.create.async({ record: { userId, myDrafts: { edu: { collection: [], resources: [] } } } })
        },
      },
    },
  },
}
