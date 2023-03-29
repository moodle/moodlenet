import { useNeedsWebUserLogin } from '@moodlenet/react-app/web-lib'
import { FC, useEffect } from 'react'
import { post_to_url } from './helper.mjs'
import { OpenIdInteractionPage } from './OpenIdInteractionPage.js'
import { useOpenIdInteractionPage } from './OpenIdInteractionPageHook.js'

export const OpenIdInteractionPageContainer: FC<{ interactionId: string }> = ({
  interactionId,
}) => {
  const webUser = useNeedsWebUserLogin()
  const openIdInteractionPageResult = useOpenIdInteractionPage({ interactionId })
  useEffect(() => {
    if (openIdInteractionPageResult?.needsLogin) {
      post_to_url(`/.pkg/@moodlenet/openid/interaction/${interactionId}/login`)
    }
  }, [interactionId, openIdInteractionPageResult?.needsLogin])

  if (openIdInteractionPageResult === null) {
    return <div>Interaction Id not found</div>
  }

  if (openIdInteractionPageResult === undefined || openIdInteractionPageResult.needsLogin) {
    return null
  }

  const openIdInteractionProps = openIdInteractionPageResult.props
  return webUser && <OpenIdInteractionPage {...openIdInteractionProps} />
}
