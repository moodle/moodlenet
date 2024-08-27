import { getAccess } from '../../../../lib/server/sessionContext'
import SignupPanel from './moodle-email-pwd-authentication.client'

export default async function MoodleEmailPwdAuthenticationPage() {
  const access = await getAccess()
  const { configs } = await access('moodle-eml-pwd-auth', 'read', 'configs', void 0).val

  return (
    <SignupPanel
      {...{
        configs: configs.signupForm,
      }}
    />
  )
}
