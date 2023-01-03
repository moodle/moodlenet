// import { useFormik } from 'formik'
// import { useContext, useMemo } from 'react'
// import { SettingsCtx } from '../../../../../web-lib.mjs'
// import { UsersFormValues, UsersProps } from './Users.js'

// export const useUsersProps = (): UsersProps => {
//   const { devMode, toggleDevMode } = useContext(SettingsCtx)

//   const form = useFormik<UsersFormValues>({
//     initialValues: { devMode },
//     async onSubmit() {
//       toggleDevMode()
//     },
//     enableReinitialize: true,
//   })

//   const UsersProps = useMemo<UsersProps>(() => {
//     return {
//       form,
//     }
//   }, [form])

//   return UsersProps
// }
