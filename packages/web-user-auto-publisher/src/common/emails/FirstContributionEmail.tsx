import type { EmailObj } from '@moodlenet/email-service/server'
export type FirstContributionEmailProps = {
  yetToCreate: number
  instanceName: string
  keepContributingActionUrl: string
  receiverEmail: string
}

export function firstContributionEmail({
  yetToCreate,
  instanceName,
  keepContributingActionUrl,
  receiverEmail,
}: FirstContributionEmailProps): EmailObj {
  const title = `First contribution to ${instanceName}! Congrats! 🔥`
  const body = (
    <>
      Create <b>{yetToCreate} more resources</b> and carefully fill in all fields to become a{' '}
      <b>publisher</b>, and make your content accessible to all.
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
