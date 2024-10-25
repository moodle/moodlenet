import type { FC } from 'react'
import { useParams } from 'react-router-dom'
import { OpenIdInteractionPageContainer } from './OpenIdInteractionPageContainer'

export const OpenIdInteractionPageRoute: FC = () => {
  const { interactionId } = useParams()
  if (!interactionId) {
    return <div>Not Found</div>
  }
  return <OpenIdInteractionPageContainer interactionId={interactionId} />
}
