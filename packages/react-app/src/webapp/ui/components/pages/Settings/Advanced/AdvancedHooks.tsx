// import { OrganizationData } from '@moodlenet/organization'
// import { useFormik } from 'formik'
// import { useContext, useMemo } from 'react'
// import { OrganizationCtx } from '../../../../../context/OrganizationCtx.js'
// import { AdvancedProps } from './Advanced.js.js'

// export const useAdvancedProps = (): AdvancedProps => {
//   const { organizationData, saveOrganization } = useContext(OrganizationCtx)

//   const form = useFormik<OrganizationData>({
//     initialValues: organizationData,
//     async onSubmit(data) {
//       await saveOrganization(data)
//     },
//     enableReinitialize: true,
//   })

//   const AdvancedProps = useMemo<AdvancedProps>(() => {
//     return {
//       form,
//     }
//   }, [form])

//   return AdvancedProps
// }
