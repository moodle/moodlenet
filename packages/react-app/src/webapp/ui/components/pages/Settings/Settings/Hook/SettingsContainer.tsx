import { FC, useContext } from 'react'
import { Navigate } from 'react-router-dom'
import { AuthCtx } from '../../../../../../web-lib.mjs'
import { Settings } from '../Settings.js'
import { useSettingsProps } from './SettingsHooks.js'

export const SettingsContainer: FC = () => {
  const settingsProps = useSettingsProps()
  const { clientSessionData } = useContext(AuthCtx)
  if (!clientSessionData?.myUserNode) {
    return <Navigate to="/login" />
  }

  return <Settings {...settingsProps} />
}
