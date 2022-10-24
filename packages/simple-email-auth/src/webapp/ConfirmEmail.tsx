import { MinimalisticHeaderProps } from '@moodlenet/component-library'
import { SimpleLayout } from '@moodlenet/react-app'
import { AuthCtx } from '@moodlenet/react-app/web-lib.mjs'
import { FC, useContext, useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

export type ConfirmEmailProps = {
  headerProps: MinimalisticHeaderProps
}

export const ConfirmEmail: FC<ConfirmEmailProps> = ({ headerProps }) => {
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
    <SimpleLayout
      headerProps={headerProps}
      page="signup"
      style={{ height: '100%' }}
      contentStyle={{ padding: '0' }}
    >
      <span>{errMsg ? `Something went wrong: ${errMsg}` : 'validating...'}</span>
    </SimpleLayout>
  )
}

export default ConfirmEmail
