import { Card, PrimaryButton } from '@moodlenet/component-library'
import type { SimpleLayoutProps } from '@moodlenet/react-app/ui'
import { SimpleLayout } from '@moodlenet/react-app/ui'
import type { FC } from 'react'

export type OpenIdInteractionPageProps = {
  scopes: string[]
  clientId: string
  simpleLayoutProps: SimpleLayoutProps
  authorize(): Promise<unknown>
  cancel(): Promise<unknown>
}

export const OpenIdInteractionPage: FC<OpenIdInteractionPageProps> = ({
  simpleLayoutProps,
  clientId,
  authorize,
  cancel,
  scopes,
}) => {
  return (
    <SimpleLayout {...simpleLayoutProps}>
      <Card>
        <div>
          An external system &ldquo;{clientId}&ldquo; is asking to access Moodlenet on your name for
          the following actions
        </div>
        {scopes.map(scope => (
          <div key={scope}>{scope}</div>
        ))}
        <PrimaryButton onClick={authorize}>Authorize</PrimaryButton>
        <PrimaryButton onClick={cancel}>Cancel</PrimaryButton>
      </Card>
    </SimpleLayout>
  )
}
