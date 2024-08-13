import LoginPanel from './client.email-pwd-login.tsx';

export default async function EmailPwdLoginPage() {
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
