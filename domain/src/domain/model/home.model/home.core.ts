import { isLeft } from 'fp-ts/Either'

export const homeCore: moo.def.model.impl = {
  userHome: {
    create: {
      post:
        ({ model }) =>
        async (outcome, { userHomeRecord: { userId } }) => {
          if (isLeft(outcome)) {
            return
          }
          await model.home.userHome.create.async({ userId, myDrafts: { edu: { collection: [], resources: [] } } })
        },
    },
  },
}
