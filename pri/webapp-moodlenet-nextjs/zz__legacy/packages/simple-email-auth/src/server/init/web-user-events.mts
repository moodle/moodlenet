import { on } from '@moodlenet/web-user/server'
import { webUserDeleted } from '../lib.mjs'
import { shell } from '../shell.mjs'

on('deleted-web-user-account', async ({ data: { webUser } }) => {
  const webUserKey = webUser._key
  shell.log('info', `simple-email-auth: attempt deleting web-user#${webUserKey}`)
  const delResult = await webUserDeleted({ webUserKey })
  shell.log(
    'info',
    `simple-email-auth: web-user#${webUserKey} ${delResult ? 'deleted' : 'not'} here`,
  )
})
