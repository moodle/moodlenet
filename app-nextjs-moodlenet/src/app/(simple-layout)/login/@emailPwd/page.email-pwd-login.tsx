import LoginPanel from './client.email-pwd-login.tsx';

export default async function EmailPwdLoginPage() {
  return <LoginPanel {...{
    recoverPasswordUrl:'',
    wrongCreds:false
  }} />
}
