import { on } from '@moodlenet/web-user/server'
import { sendMessageToWebUser } from '../lib.mjs'
on(
  'send-message-to-web-user',
  ({
    data: {
      message: { html, text },
      webUserKey,
    },
  }) => {
    sendMessageToWebUser({ message: html ?? text, webUserKey })
  },
)
