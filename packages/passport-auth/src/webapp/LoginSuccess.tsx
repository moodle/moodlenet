import lib from 'moodlenet-react-app-lib'
import { FC, useContext } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

const { MainLayout } = lib.ui.components.layout
export const LoginSuccess: FC = () => {
  const auth = useContext(lib.auth.AuthCtx)
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
