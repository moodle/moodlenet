import { readFile } from 'fs/promises'
import { resolve } from 'path'
import { kvStore } from '../../kvStore.mjs'

const __dirname = new URL('.', import.meta.url).pathname
const deleteAccountEmailTemplate = await readFile(
  resolve(__dirname, '..', '..', '..', '..', '..', 'user-messages-templates/delete-account.html'),
  'utf-8',
)

kvStore.set('delete-account-html-message-template', '', deleteAccountEmailTemplate)

export default -94
