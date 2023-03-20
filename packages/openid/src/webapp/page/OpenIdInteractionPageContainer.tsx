import { FC } from 'react'
import { OpenIdInteractionPage } from './OpenIdInteractionPage.js'
import { useOpenIdInteractionProps } from './OpenIdInteractionPageHook.js'

export const OpenIdInteractionPageContainer: FC<{ interactionId: string }> = ({
  interactionId,
}) => {
  const openIdInteractionProps = useOpenIdInteractionProps({ interactionId })
  return <OpenIdInteractionPage {...openIdInteractionProps} />
}
