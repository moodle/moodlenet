import { v0_1 as org_0_1 } from '@moodle/mod-org'

export type SignupEmailConfirmationProps = {
  orgInfo: org_0_1.OrgInfo
  activateAccountUrl: string
  receiverEmail: string
}

export function signupEmailConfirmationContent({
  orgInfo,
  receiverEmail,
  activateAccountUrl,
}: SignupEmailConfirmationProps): org_0_1.EmailLayoutContentProps {
  const title = `Welcome to ${orgInfo.name} 🎉`

  const body = (
    <>
      Thanks for signing up to {orgInfo.name}!<br />
      <br />
      Click the button below to activate your account.
    </>
  )

  return {
    body,
    receiverEmail,
    subject: title,
    title,
    hideIgnoreMessage: false,
    action: { title: 'Activate account', url: activateAccountUrl },
  }
}
