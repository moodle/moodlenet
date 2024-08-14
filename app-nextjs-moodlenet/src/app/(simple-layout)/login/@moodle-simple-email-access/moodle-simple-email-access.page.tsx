import LoginPanel from './moodle-simple-email-access.client'

export default function MoodleSimpleEmailAccessPage() {
  return (
    <LoginPanel
      {...{
        recoverPasswordUrl: '',
        wrongCreds: false,
        configs: { email: { min: 5, max: 35 }, password: { min: 8, max: 35 } },
      }}
    />
  )
}
