import { on } from '@moodlenet/web-user/server'
import { userSendsMessageToWebUser } from '../lib.mjs'
on('send-message-to-web-user', ({ data }) => {
  userSendsMessageToWebUser(data)
})
