import type { OrganizationData } from '@moodlenet/organization/common'
import { useFormik } from 'formik'
import { useContext, useMemo } from 'react'
import { OrganizationCtx } from '../../../../../context/OrganizationCtx.js'
import { shell } from '../../../../../shell.mjs'
import type { GeneralProps } from './General.js'

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
      updateExtensions: shell.rpc.me.updateAllPkgs,
      updateSuccess: false,
    }
  }, [form])

  return generalProps
}
