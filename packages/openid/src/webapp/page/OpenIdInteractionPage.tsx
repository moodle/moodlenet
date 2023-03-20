import { MinimalisticHeaderProps, SimpleLayout } from '@moodlenet/react-app/ui'
import { FC } from 'react'

export type OpenIdInteractionProps = {
  headerProps: MinimalisticHeaderProps
}
export const OpenIdInteractionPage: FC<OpenIdInteractionProps> = ({ headerProps }) => {
  return (
    <SimpleLayout headerProps={headerProps}>
      <div>ciao</div>
    </SimpleLayout>
  )
}
