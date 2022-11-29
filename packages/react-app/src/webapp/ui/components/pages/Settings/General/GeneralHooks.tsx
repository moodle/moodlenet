import { OrganizationData } from '@moodlenet/organization'
import { useFormik } from 'formik'
import { useCallback, useContext, useMemo } from 'react'
import { MainContext } from '../../../../../context/MainContext.js'
import { OrganizationCtx } from '../../../../../context/OrganizationCtx.js'
import { GeneralProps } from './General.js'

export const useGeneralProps = (): GeneralProps => {
  const { organizationData, saveOrganization } = useContext(OrganizationCtx)
  const {
    pkgs: [, , , , corePkg],
  } = useContext(MainContext)

  const form = useFormik<OrganizationData>({
    initialValues: organizationData,
    async onSubmit(data) {
      await saveOrganization(data)
    },
    enableReinitialize: true,
  })

  const updateExtensions = useCallback(() => {
    corePkg.call('pkg-mng/updateAll')()
  }, [corePkg])

  const generalProps = useMemo<GeneralProps>(() => {
    return {
      form,
      updateExtensions,
      updateSuccess: false,
    }
  }, [form, updateExtensions])

  return generalProps
}
