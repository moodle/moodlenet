import { MainLayout } from '@moodlenet/react-app/ui'
import type { FC } from 'react'
import { useContext } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { PassportContext } from './MainModule'

export const LoginSuccess: FC = () => {
  const { shell } = useContext(PassportContext)
  const [, reactApp] = shell.deps
  const auth = useContext(reactApp.AuthCtx)

  const nav = useNavigate()
  const [params] = useSearchParams()
  const token = params.get('token')
  if (token) {
    auth.setSessionToken(token).then(
      res => {
        if (!res.success) {
          throw new Error(`couldn't authenticate`)
        }
      },
      err => {
        nav(`login-fail?msg:${String(err)}`)
      },
    )
  }

  return <MainLayout>{!token && <span>No token present</span>}</MainLayout>
}

export default LoginSuccess
