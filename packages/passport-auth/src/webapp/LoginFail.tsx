import lib from 'moodlenet-react-app-lib'
import { FC } from 'react'
import { useSearchParams } from 'react-router-dom'

const { MainLayout } = lib.ui.components
export const LoginFail: FC = () => {
  const [params] = useSearchParams()
  const msg = params.get('msg')
  return <MainLayout>couldn't authenticate ... {msg}</MainLayout>
}

export default LoginFail
