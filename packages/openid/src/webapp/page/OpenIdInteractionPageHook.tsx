import { useSimpleLayoutProps } from '@moodlenet/react-app/ui'
import { useNeedsWebUserLogin } from '@moodlenet/web-user/webapp'
import { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { WebappInteractionDetails } from '../../common/expose-def.mjs'
import { OpenIdCtx } from '../OpenIdContextProvider.js'
import { post_to_url } from './helper.mjs'
import { OpenIdInteractionPageProps } from './OpenIdInteractionPage.js'
export function useOpenIdInteractionPage({
  interactionId,
}: {
  interactionId: string
}): null | undefined | OpenIdInteractionPageProps {
  const simpleLayoutProps = useSimpleLayoutProps()
  const openIdContext = useContext(OpenIdCtx)
  const [interactionDetails, setInteractionDetails] = useState<WebappInteractionDetails | null>()
  const webUser = useNeedsWebUserLogin()
  useEffect(() => {
    if (webUser && interactionDetails?.needsLogin) {
      post_to_url(`/.pkg/@moodlenet/openid/interaction/${interactionId}/login`)
    }
  }, [interactionId, interactionDetails?.needsLogin, webUser])

  useEffect(() => {
    openIdContext.pkg.use.me.rpc['webapp/getInteractionDetails']({ interactionId }).then(
      setInteractionDetails,
    )
  }, [interactionId, openIdContext.pkg.use.me.rpc])

  const authorize = useCallback<OpenIdInteractionPageProps['authorize']>(async () => {
    post_to_url(`/.pkg/@moodlenet/openid/interaction/${interactionId}/confirm`)
  }, [interactionId])

  const cancel = useCallback<OpenIdInteractionPageProps['cancel']>(async () => {
    post_to_url(`/.pkg/@moodlenet/openid/interaction/${interactionId}/abort`, 'GET')
  }, [interactionId])

  const openIdInteractionPageProps = useMemo<OpenIdInteractionPageProps | null | undefined>(() => {
    if (!interactionDetails) {
      return interactionDetails
    }
    return {
      simpleLayoutProps,
      authorize,
      cancel,
      clientId: interactionDetails.clientId,
      scopes: interactionDetails.scopes,
    }
  }, [authorize, cancel, simpleLayoutProps, interactionDetails])

  return openIdInteractionPageProps
}
