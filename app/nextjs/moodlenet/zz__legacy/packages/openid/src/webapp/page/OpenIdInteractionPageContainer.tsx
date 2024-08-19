import type { FC } from 'react'
import { OpenIdInteractionPage } from './OpenIdInteractionPage.js'
import { useOpenIdInteractionPage } from './OpenIdInteractionPageHook.js'

export const OpenIdInteractionPageContainer: FC<{ interactionId: string }> = ({
  interactionId,
}) => {
  const openIdInteractionProps = useOpenIdInteractionPage({ interactionId })

  if (openIdInteractionProps === null) {
    return <div>Interaction Id not found</div>
  }

  if (openIdInteractionProps === undefined) {
    return null
  }

  return <OpenIdInteractionPage {...openIdInteractionProps} />
}
