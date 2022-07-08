import lib from 'moodlenet-react-app-lib'
import { FC, useContext } from 'react'

const { MainLayout } = lib.ui.components.layout
export const LoginSuccess: FC = () => {
  const auth = useContext(lib.auth.AuthCtx)
  auth
  return <MainLayout></MainLayout>
}

export default LoginSuccess
