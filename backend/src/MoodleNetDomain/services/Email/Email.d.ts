import { Topic, KeyedTopic as KeyedTopic } from '../../../lib/domain/types'

export type Email = {
  Send_One: Topic<{ email: EmailObj; key: string }>
  Sent_Email: KeyedTopic<{ success: true } | { error: string; success: false }>
  Verify_Email: Topic<
    {
      email: EmailObj
      maxAttempts: number
      tokenReplaceRegEx: string
      key: string
    },
    { id: string }
  >
  Verify_Email_Result: KeyedTopic<
    ({ email: EmailObj } & { success: true }) | { error: string; success: false }
  >
}

export type EmailObj = {
  to: string
  // from: string
  // subject: string
  // text?: string
  // html?: string
}
