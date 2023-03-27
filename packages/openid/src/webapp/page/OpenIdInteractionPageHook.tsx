import { useSimpleLayoutProps } from '@moodlenet/react-app/ui'
import { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { WebappInteractionDetails } from '../../common/webapp/types.mjs'
import { OpenIdCtx } from '../OpenIdContextProvider.js'
import { post_to_url } from './helper.mjs'
import { OpenIdInteractionPageProps } from './OpenIdInteractionPage.js'
export type OpenIdInteractionPageResult = { props: OpenIdInteractionPageProps; needsLogin: boolean }
export function useOpenIdInteractionPage({
  interactionId,
}: {
  interactionId: string
}): null | undefined | OpenIdInteractionPageResult {
  const simpleLayoutProps = useSimpleLayoutProps()
  const openIdContext = useContext(OpenIdCtx)
  const [interactionDetails, setInteractionDetails] = useState<WebappInteractionDetails | null>()

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

  const openIdInteractionPageResult = useMemo<
    OpenIdInteractionPageResult | null | undefined
  >(() => {
    if (!interactionDetails) {
      return interactionDetails
    }
    return {
      needsLogin: interactionDetails.needsLogin,
      props: {
        simpleLayoutProps,
        authorize,
        cancel,
        clientId: interactionDetails.clientId,
        scopes: interactionDetails.scopes,
      },
    }
  }, [authorize, cancel, simpleLayoutProps, interactionDetails])

  return openIdInteractionPageResult
}
