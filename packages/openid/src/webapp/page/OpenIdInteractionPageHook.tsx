import { useMinimalisticHeaderProps } from '@moodlenet/react-app/ui'
import { useContext, useEffect, useMemo } from 'react'
import { OpenIdCtx } from '../OpenIdContextProvider.js'
import { OpenIdInteractionProps } from './OpenIdInteractionPage.js'

export function useOpenIdInteractionProps({
  interactionId,
}: {
  interactionId: string
}): OpenIdInteractionProps {
  const headerProps = useMinimalisticHeaderProps()
  const openIdContext = useContext(OpenIdCtx)

  useEffect(() => {
    openIdContext.pkg.use.me.rpc['webapp/getInteractionDetails']({ interactionId }).then(
      console.log,
    )
  }, [interactionId, openIdContext.pkg.use.me.rpc])

  const openIdInteractionProps = useMemo<OpenIdInteractionProps>(() => {
    return {
      headerProps,
    }
  }, [headerProps])
  return openIdInteractionProps
}
