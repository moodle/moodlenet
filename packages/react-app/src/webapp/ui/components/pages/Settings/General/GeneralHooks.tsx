import type { OrganizationData } from '@moodlenet/organization'
import { useFormik } from 'formik'
import { useCallback, useContext, useMemo } from 'react'
import { MainContext } from '../../../../../context/MainContext.mjs'
import { OrganizationCtx } from '../../../../../context/OrganizationCtx.js'
import type { GeneralProps } from './General.js'

export const useGeneralProps = (): GeneralProps => {
  const { organizationData, saveOrganization } = useContext(OrganizationCtx)
  const { use } = useContext(MainContext)

  const form = useFormik<OrganizationData>({
    initialValues: organizationData,
    async onSubmit(data) {
      await saveOrganization(data)
    },
    enableReinitialize: true,
  })

  //FIXME: @Bru: can we put this updateAll UI in @moodlenet/extension-manager ?
  const updateExtensions = useCallback(() => {
    use.me.rpc('remove-me/updateAllPkgs')()
  }, [use.me])

  const generalProps = useMemo<GeneralProps>(() => {
    return {
      form,
      updateExtensions,
      updateSuccess: false,
    }
  }, [form, updateExtensions])

  return generalProps
}
