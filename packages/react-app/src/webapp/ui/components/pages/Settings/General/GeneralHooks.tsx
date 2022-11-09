import { OrganizationData } from '@moodlenet/organization'
import { useFormik } from 'formik'
import { useContext, useEffect, useMemo } from 'react'
import { OrganizationCtx } from '../../../../../context/OrganizationCtx.js'
import { GeneralProps } from './General.js'

export const useGeneralProps = (): GeneralProps => {
  const { organizationData, saveOrganization } = useContext(OrganizationCtx)

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
    }
  }, [form])

  return generalProps
}
