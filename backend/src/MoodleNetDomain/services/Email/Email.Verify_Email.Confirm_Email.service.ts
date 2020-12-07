import { MoodleNet } from '../..'
import { getEmailPersistence } from './email.env'

getEmailPersistence().then((emailPersistence) => {
  MoodleNet.respondApi({
    api: 'Email.Verify_Email.Confirm_Email',
    async handler({ req: { token } }) {
      const res = await emailPersistence.confirmEmail({ token })
      if (!res) {
        return { error: `couldn't find`, success: false } as const
      }
      const { current, prevStatus } = res
      if (prevStatus === 'Verifying') {
        MoodleNet.emitEvent({
          event: 'Email.Verify_Email.Result',
          flow: { _route: current._route, _key: current._key },
          payload: { email: current.req.email.to, success: true },
        })
      }
      return { success: true, flow: { _key: current._key, _route: current._route } } as const
    },
  })
})
