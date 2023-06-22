import assert from 'assert'
import { readFile } from 'fs/promises'
import { resolve } from 'path'
import { kvStore } from '../../kvStore.mjs'

const __dirname = new URL('.', import.meta.url).pathname
const messageFromUserTemplate = await readFile(
  resolve(
    __dirname,
    '..',
    '..',
    '..',
    '..',
    '..',
    'user-messages-templates/message-from-user.html',
  ),
  'utf-8',
)

const deleteAccountConfirmationTemplate = (
  await kvStore.get('delete-account-html-message-template' as any, '')
).value
assert(deleteAccountConfirmationTemplate)
kvStore.set('message-templates', '', {
  messageFromUser: messageFromUserTemplate,
  deleteAccountConfirmation: deleteAccountConfirmationTemplate,
})
await kvStore.unset('delete-account-html-message-template' as any, '')

export default -93
