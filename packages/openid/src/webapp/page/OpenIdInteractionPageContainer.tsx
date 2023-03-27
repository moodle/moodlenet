import { AuthCtx } from '@moodlenet/react-app/web-lib'
import { FC, useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { post_to_url } from './helper.mjs'
import { OpenIdInteractionPage } from './OpenIdInteractionPage.js'
import { useOpenIdInteractionPage } from './OpenIdInteractionPageHook.js'

export const OpenIdInteractionPageContainer: FC<{ interactionId: string }> = ({
  interactionId,
}) => {
  const nav = useNavigate()
  const { isAuthenticated } = useContext(AuthCtx)
  const openIdInteractionPageResult = useOpenIdInteractionPage({ interactionId })
  useEffect(() => {
    if (openIdInteractionPageResult?.needsLogin) {
      post_to_url(`/.pkg/@moodlenet/openid/interaction/${interactionId}/login`)
    }
  }, [interactionId, openIdInteractionPageResult?.needsLogin])

  if (!isAuthenticated) {
    nav('/login', { replace: true })
    return null
  }
  if (openIdInteractionPageResult === null) {
    return <div>Interaction Id not found</div>
  }

  if (openIdInteractionPageResult === undefined || openIdInteractionPageResult.needsLogin) {
    return null
  }

  const openIdInteractionProps = openIdInteractionPageResult.props
  return <OpenIdInteractionPage {...openIdInteractionProps} />
}
