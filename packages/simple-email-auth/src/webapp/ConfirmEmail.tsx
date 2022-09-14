import { FC, useContext, useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { MainContext } from './MainModule'

export const ConfirmEmail: FC = () => {
  const { shell } = useContext(MainContext)
  const [, reactApp] = shell.deps
  const { MainLayout } = reactApp.ui.components
  const auth = useContext(reactApp.AuthCtx)

  // const nav = useNavigate()
  const [params] = useSearchParams()
  const [errMsg, setErrMsg] = useState('')
  useEffect(() => {
    const sessionToken = params.get('sessionToken')
    if (!sessionToken) {
      setErrMsg(`this url is invalid`)
      return
    }

    auth
      .setSessionToken(sessionToken)
      .then(res => (res.success ? '' : `couldn't authenticate`))
      .catch(e => String(e))
      .then(setErrMsg)
  }, [])

  return (
    <MainLayout>
      <span>{errMsg ? `Something went wrong: ${errMsg}` : 'validating...'}</span>
    </MainLayout>
  )
}

export default ConfirmEmail
