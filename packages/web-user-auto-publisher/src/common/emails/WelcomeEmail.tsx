import type { EmailObj } from '@moodlenet/email-service/server'
export type WelcomeEmailProps = {
  amountResourceToGainPublishingRights: number
  instanceName: string
  displayName: string
  contributeActionUrl: string
  receiverEmail: string
}

export function welcomeEmail({
  amountResourceToGainPublishingRights,
  instanceName,
  displayName,
  contributeActionUrl,
  receiverEmail,
}: WelcomeEmailProps): EmailObj {
  const title = `Welcome ${displayName} to ${instanceName}! ✨`
  const body = (
    <>
      Hi {displayName},
      <br />
      You will start your journey in {instanceName} as a non-publisher user
      <br />
      Start contributing, create <b>{amountResourceToGainPublishingRights} resources</b> to become a
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
      url: contributeActionUrl,
    },
    hideIgnoreMessage: true,
  }
}
