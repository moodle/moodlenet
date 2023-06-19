import type { AddonItemNoKey } from '@moodlenet/component-library'
import type { AddOnMap } from '@moodlenet/core/lib'
import { createPluginHook } from '@moodlenet/react-app/webapp'
import { useCallback, useState } from 'react'
import type { GeneralProps } from '../../../../ui/exports/ui.mjs'
import { shell } from '../../../shell.mjs'

const GeneralSettingsPlugin = createPluginHook<{
  mainColumn: AddOnMap<AddonItemNoKey>
}>()

export function useGeneralSettingsProps() {
  const [deleteAccountSuccess, setDeleteAccountSuccess] = useState(false)
  const deleteAccount = useCallback(async () => {
    await shell.rpc.me['webapp/web-user/delete-account-request']()
    setDeleteAccountSuccess(true)
  }, [])
  const plugins = GeneralSettingsPlugin.usePluginHooks()
  const generalProps: GeneralProps = {
    deleteAccount,
    deleteAccountSuccess,
    mainColumnItems: plugins.getKeyedAddons('mainColumn'),
  }
  return generalProps
}
