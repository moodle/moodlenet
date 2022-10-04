import { MainLayout } from '@moodlenet/react-app/ui.mjs'
import { AuthCtx } from '@moodlenet/react-app/web-lib.mjs'
import { FC, useContext, useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

export const ConfirmEmail: FC = () => {
  const auth = useContext(AuthCtx)

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
