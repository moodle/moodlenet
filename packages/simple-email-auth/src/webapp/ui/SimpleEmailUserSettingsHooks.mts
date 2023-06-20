import { useCallback, useEffect, useState } from 'react'
import { shell } from '../shell.mjs'
import type { SimpleEmailUserSettingsData, SimpleEmailUserSettingsProps } from './UserSettings.js'

export function useSimpleEmailUserSettingsProps() {
  const [passwordChangedSuccess, setPasswordChangedSuccess] = useState(false)
  const [data, setData] = useState<SimpleEmailUserSettingsData | null>()
  useEffect(() => {
    shell.rpc.me['webapp/get-my-settings-data']().then(resp => {
      setData(resp ? { password: '' } : null)
    })
  }, [])
  const setPassword = useCallback<SimpleEmailUserSettingsProps['editData']>(({ password }) => {
    shell.rpc.me['webapp/set-password']({ password }).then(success => {
      setPasswordChangedSuccess(success)
    })
  }, [])
  if (!data) {
    return null
  }
  const simpleEmailUserSettingsProps: SimpleEmailUserSettingsProps = {
    data,
    editData: setPassword,
    passwordChangedSuccess,
  }
  return simpleEmailUserSettingsProps
}
