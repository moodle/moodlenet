import { on } from '@moodlenet/web-user/server'
import { shell } from '../shell.mjs'
on(
  'web-user-request-send-message-to-web-user',
  ({ data: { message, fromWebUserKey, toWebUserKey } }) => {
    shell.log('debug', { 'WILL SEND EMAIL:': { message, fromWebUserKey, toWebUserKey } })
  },
)
