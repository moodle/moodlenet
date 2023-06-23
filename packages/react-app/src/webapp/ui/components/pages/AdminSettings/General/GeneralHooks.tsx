import type { OrganizationData } from '@moodlenet/organization/common'
import { useFormik } from 'formik'
import { useContext, useMemo } from 'react'
import { AdminSettingsCtx } from '../../../../../context/AdminSettingsContext.js'
import { OrganizationCtx } from '../../../../../context/OrganizationCtx.js'
import type { GeneralProps } from './General.js'

export const useGeneralProps = (): GeneralProps => {
  const { organizationData, saveOrganization } = useContext(OrganizationCtx)
  const { updateAllPackages } = useContext(AdminSettingsCtx)

  const form = useFormik<OrganizationData>({
    initialValues: organizationData,
    async onSubmit(data) {
      await saveOrganization(data)
    },
    enableReinitialize: true,
  })

  const generalProps = useMemo<GeneralProps>(() => {
    return {
      form,
      updateExtensions: updateAllPackages,
      updateSuccess: false,
    }
  }, [form, updateAllPackages])

  return generalProps
}
