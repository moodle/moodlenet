import type { EmailObj } from '@moodlenet/email-service/server'

export type MessageReceivedEmailConfig = {
  receiverEmail: string
  actionUrl: string
  senderDisplayName: string
  message: string
  instanceName: string
}
export function messageReceivedEmail({
  message,
  senderDisplayName,
  actionUrl,
  receiverEmail,
  instanceName,
}: MessageReceivedEmailConfig): EmailObj {
  const title = `${senderDisplayName} sent you a message 📨`

  return {
    body: message,
    receiverEmail,
    subject: title,
    title,
    action: { title: `Reply at ${instanceName}`, url: actionUrl },
    hideIgnoreMessage: true,
  }
}

export default messageReceivedEmail
