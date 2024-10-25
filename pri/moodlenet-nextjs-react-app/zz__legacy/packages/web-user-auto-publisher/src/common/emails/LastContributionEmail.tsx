import type { EmailObj } from '@moodlenet/email-service/server'
export type LastContributionEmailProps = {
  createdAmount: number
  homePageActionUrl: string
  receiverEmail: string
}
export function lastContributionEmail({
  receiverEmail,
  createdAmount,
  homePageActionUrl,
}: LastContributionEmailProps): EmailObj {
  const title = `Just one last step to become a publisher ✨`
  const body = (
    <>
      Congrats on you created {createdAmount} resources!
      <br />
      To finally gain <b>publishing</b> permission, and make your content accessible to all,
      finalize your resources to be publishable by filling in all of their fields
      <br />
      Hint: Click <b>Check publish</b> on your resources edit page to see if they are publishable.
    </>
  )

  return {
    body,
    receiverEmail,
    subject: title,
    title,
    action: {
      title: `Finalize your resources`,
      url: homePageActionUrl,
    },
    hideIgnoreMessage: true,
  }
}
