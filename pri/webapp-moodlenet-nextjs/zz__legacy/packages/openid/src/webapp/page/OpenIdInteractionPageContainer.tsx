import type { FC } from 'react'
import { OpenIdInteractionPage } from './OpenIdInteractionPage'
import { useOpenIdInteractionPage } from './OpenIdInteractionPageHook'

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
