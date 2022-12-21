import { OrganizationData } from '../../../../../../../../organization/dist/init.mjs'
import { useFormik } from 'formik'
import { useCallback, useContext, useMemo } from 'react'
import { MainContext } from '../../../../../context/MainContext.mjs'
import { OrganizationCtx } from '../../../../../context/OrganizationCtx.js'
import { GeneralProps } from './General.js'

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

  const updateExtensions = useCallback(() => {
    use.core.call('pkg-mng/updateAll')()
  }, [use.core])

  const generalProps = useMemo<GeneralProps>(() => {
    return {
      form,
      updateExtensions,
      updateSuccess: false,
    }
  }, [form, updateExtensions])

  return generalProps
}
