import { MoodleNet } from '../../..'
import { getAccountPersistence } from '../accounting.env'

getAccountPersistence().then(async (accountPersistence) => {
  await MoodleNet.respondApi({
    api: 'Accounting.Change_Password',
    async handler({ req }) {
      const resp = await accountPersistence.changePassword(req)
      if (resp === 'not found') {
        return { success: false, reason: resp }
      } else {
        return { success: true } as const
      }
    },
  })
})
