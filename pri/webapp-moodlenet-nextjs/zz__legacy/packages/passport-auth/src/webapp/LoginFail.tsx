import { MainLayout } from '@moodlenet/react-app/ui'
import type { FC } from 'react'
import { useSearchParams } from 'react-router-dom'

export const LoginFail: FC = () => {
  const [params] = useSearchParams()
  const msg = params.get('msg')
  return <MainLayout>couldn't authenticate ... {msg}</MainLayout>
}

export default LoginFail
