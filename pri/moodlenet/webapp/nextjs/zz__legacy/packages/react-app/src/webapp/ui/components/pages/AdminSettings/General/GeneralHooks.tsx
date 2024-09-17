import type { OrganizationData } from '@moodlenet/organization/common'
import { useFormik } from 'formik'
import { useContext, useMemo } from 'react'
import { OrganizationCtx } from '../../../../../context/OrganizationCtx'
import type { GeneralProps } from './General'

export const useGeneralProps = (): GeneralProps => {
  const { organization, saveOrganization } = useContext(OrganizationCtx)
  // const { updateAllPackages } = useContext(AdminSettingsCtx)

  const form = useFormik<OrganizationData>({
    initialValues: organization.rawData,
    async onSubmit(data) {
      await saveOrganization(data)
    },
    enableReinitialize: true,
  })

  const generalProps = useMemo<GeneralProps>(() => {
    return {
      form,
      // updateExtensions: updateAllPackages,
      updateSuccess: false,
    }
  }, [form /* , updateAllPackages */])

  return generalProps
}
