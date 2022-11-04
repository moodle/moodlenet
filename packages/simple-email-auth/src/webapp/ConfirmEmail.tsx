import { SimpleLayout, useSimpleLayoutProps } from '@moodlenet/react-app/ui'
import { AuthCtx } from '@moodlenet/react-app/web-lib'
import { FC, useContext, useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

// export type ConfirmEmailProps = {}

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
  }, [auth, params])

  const simpleLayoutProps = useSimpleLayoutProps()

  return (
    <SimpleLayout {...simpleLayoutProps}>
      <span>{errMsg ? `Something went wrong: ${errMsg}` : 'validating...'}</span>
    </SimpleLayout>
  )
}

export default ConfirmEmail
