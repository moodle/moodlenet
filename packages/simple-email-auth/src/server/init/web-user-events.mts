import { on } from '@moodlenet/web-user/server'
import { userSendsMessageToWebUser, webUserDeleted } from '../lib.mjs'
import { shell } from '../shell.mjs'
on('request-send-message-to-web-user', ({ data }) => {
  userSendsMessageToWebUser(data)
})
on('deleted-web-user-account', async ({ data: { webUser } }) => {
  const webUserKey = webUser._key
  const delResult = await webUserDeleted({ webUserKey })
  shell.log(
    'info',
    `deleted-web-user-account: webUser with key ${webUserKey} ${
      delResult ? 'deleted' : 'not'
    } here`,
  )
})
