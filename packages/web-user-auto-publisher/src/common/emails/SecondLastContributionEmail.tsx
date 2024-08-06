import type { EmailObj } from '@moodlenet/email-service/server'
export type LastContributionEmailProps = {
  createdAmountSoFar: number
  keepContributingActionUrl: string
  receiverEmail: string
}
export function secondLastContributionEmail({
  receiverEmail,
  createdAmountSoFar,
  keepContributingActionUrl,
}: LastContributionEmailProps): EmailObj {
  const title = `One resource away to become a publisher ✨`
  const body = (
    <>
      Congrats on your first {createdAmountSoFar} resources!
      <br />
      <b>Upload one more</b> and carefully fill in all fields to become a <b>publisher</b>, and make
      your content accessible to all.
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
