import { useFormik } from 'formik'
import { useEffect, useState } from 'react'
import type { LMSSettingsRpc } from '../../../../../common/types.mjs'
import type { AdvancedProps } from '../../../../ui/exports/ui.mjs'
import { shell } from '../../../shell.mjs'

export function useLmsSettingsProps() {
  const [lmsSettingsRpc, setLMSSettingsRpc] = useState<LMSSettingsRpc | null>()
  useEffect(() => {
    shell.rpc.me['webapp/web-user/settings/lms/get']().then(res => {
      setLMSSettingsRpc(res)
    })
  }, [])
  const form = useFormik<{ instanceName: string }>({
    initialValues: { instanceName: lmsSettingsRpc?.defaultInstanceDomain ?? '' },
    enableReinitialize: true,
    onSubmit: async ({ instanceName }) => {
      await shell.rpc.me['webapp/web-user/settings/lms/set']({
        defaultInstanceDomain: instanceName,
      })
    },
  })
  if (lmsSettingsRpc === undefined) {
    return null
  }
  const lmsSettingsProps: AdvancedProps = {
    form,
    updateExtensions() {
      return
    },
    updateSuccess: false,
  }
  return lmsSettingsProps
}
