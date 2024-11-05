import { ProvideMainSearchBoxCtx } from '@moodlenet/react-app/ui'
import { action } from '@storybook/addon-actions'
import type { FC, PropsWithChildren } from 'react'

export const ProvideSBMainSearchBoxCtx: FC<PropsWithChildren<unknown>> = ({ children }) => {
  return (
    <ProvideMainSearchBoxCtx
      search={action('main search box')}
      initSearchText=""
      initialDefaultQuery={{}}
    >
      {children}
    </ProvideMainSearchBoxCtx>
  )
}

export default ProvideSBMainSearchBoxCtx
