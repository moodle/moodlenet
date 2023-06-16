import { on } from '@moodlenet/web-user/server'
import { shell } from '../shell.mjs'
on('send-message-to-profile-intent', ({ message, fromWebUserKey, toWebUserKey }) => {
  shell.log('debug', { 'WILL SEND EMAIL:': { message, fromWebUserKey, toWebUserKey } })
})
