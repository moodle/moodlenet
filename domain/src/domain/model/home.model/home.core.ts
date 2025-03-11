import { isLeft } from 'fp-ts/Either'

export const homeCore: moo.model.impl = {
  userAccount: {
    create: {
      post:
        ({ model }) =>
        async (outcome, { record: { userId } }) => {
          if (isLeft(outcome)) {
            return
          }
          await model.home.userHome.create.async({ userId, myDrafts: { edu: { collection: [], resources: [] } } })
        },
    },
  },
}
