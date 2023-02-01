import { FC, useContext } from 'react'
import { AuthCtx } from '../../../../../../web-lib.mjs'
import { SettingsContainer } from './SettingsContainer.js'

export const SettingsPageRoute: FC = () => {
  const { clientSessionData } = useContext(AuthCtx)
  if (!clientSessionData?.isAdmin) {
    return <div>To implement not found</div>
  }

  return <SettingsContainer />
}
