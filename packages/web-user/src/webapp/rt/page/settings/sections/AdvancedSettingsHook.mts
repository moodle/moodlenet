import type { AddonItemNoKey } from '@moodlenet/component-library'
import type { AddOnMap } from '@moodlenet/core/lib'
import { createPlugin, OrganizationCtx } from '@moodlenet/react-app/webapp'
import { useCallback, useContext, useState } from 'react'
import type { AdvancedProps } from '../../../../ui/exports/ui.mjs'
import { shell } from '../../../shell.mjs'

export const AdvancedSettingsPlugin = createPlugin<{
  mainColumn: AddOnMap<AddonItemNoKey>
}>()

export function useAdvancedSettingsProps() {
  const org = useContext(OrganizationCtx)
  const [deleteAccountSuccess, setDeleteAccountSuccess] = useState(false)
  const deleteAccount = useCallback(async () => {
    await shell.rpc.me('webapp/web-user/delete-account-request')()
    setDeleteAccountSuccess(true)
  }, [])
  const plugins = AdvancedSettingsPlugin.usePluginHooks()
  const advancedProps: AdvancedProps = {
    instanceName: org.organizationData.instanceName,
    deleteAccount,
    deleteAccountSuccess,
    mainColumnItems: plugins.getKeyedAddons('mainColumn'),
  }
  return advancedProps
}
