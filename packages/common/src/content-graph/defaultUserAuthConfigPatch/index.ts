import { sendMessageToUserEmail } from './sendMessageToUserEmail'

export const DefaultConfigPatch = {
  messageToUserEmail: {
    ...sendMessageToUserEmail,
  },
}
