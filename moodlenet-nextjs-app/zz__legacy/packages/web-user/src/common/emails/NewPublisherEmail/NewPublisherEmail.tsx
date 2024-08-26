import type { EmailObj } from '@moodlenet/email-service/server'
export type NewPublisherEmailProps = {
  instanceName: string
  receiverEmail: string
  keepContributingActionUrl: string
}

export function newPublisherEmail({
  instanceName,
  keepContributingActionUrl,
  receiverEmail,
}: NewPublisherEmailProps): EmailObj {
  const title = `You are now a ${instanceName} publisher! 🌟`
  const body = (
    <>
      Congratulations! This upgrade reflects your active engagement in upholding our
      community&apos;s quality and integrity.
      <br />
      <br />
      As a valued publisher, apart from making your content public, you can also flag users that
      don&apos;t align to {instanceName} values.
      <br />
      <br />
      By contributing, you increase the recognition and reach of your content, making the education
      world better.
    </>
  )

  return {
    body,
    title,
    subject: title,
    action: { title: `Keep contributing`, url: keepContributingActionUrl },
    receiverEmail,
  }
}
