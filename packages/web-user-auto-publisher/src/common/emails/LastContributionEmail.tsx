import type { EmailObj } from '@moodlenet/email-service/server'
export type LastContributionEmailProps = {
  amountSoFar: number
  keepContributingActionUrl: string
  receiverEmail: string
}
export function lastContributionEmail({
  receiverEmail,
  amountSoFar,
  keepContributingActionUrl,
}: LastContributionEmailProps): EmailObj {
  const title = `One resource away to become a publisher ✨`
  const body = (
    <>
      Congrats on your first {amountSoFar} resources!
      <br />
      <b>Upload one more</b> and become a publisher.
    </>
  )

  return {
    body,
    receiverEmail,
    subject: title,
    title,
    action: {
      title: `Keep contributing`,
      url: keepContributingActionUrl,
    },
    hideIgnoreMessage: true,
  }
}
