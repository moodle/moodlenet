import type {
  FieldHelperProps,
  FieldInputProps,
  FieldMetaProps,
  FormikConfig,
  FormikErrors,
  FormikState,
  FormikTouched,
} from 'formik'
export type SubmitForm<Values> = FormikConfig<Values>['onSubmit']
// type FormikInputAttrs<Values> = {
//   [ValueName in keyof Values]: { name: ValueName; value?: Values[ValueName] }
// }
// export const formikInputAttrs = <Values>(values: Values) =>
//   Object.entries(values).reduce<FormikInputAttrs<Values>>(
//     (collect, [name, value]) => ({
//       ...collect,
//       [name]: {
//         name,
//         ...(value instanceof File || hasNoValue(value)
//           ? null
//           : {
//               value,
//             }),
//       },
//     }),
//     {} as any,
//   )

// export const useFormikInputAttrs = <Values>(values: Values) =>
//   useMemo(() => formikInputAttrs(values), [values])

// export type FormikBag<Values = {}> = readonly [FormikHandle<Values>, FormikInputAttrs<Values>]
// export const useFormikBag = <Values>(config: FormikConfig<Values>) => {
//   const formik = useFormik(config)
//   const s_formik = formik as FormikHandle<Values>
//   const inputAttrs = useFormikInputAttrs(s_formik.values)
//   const bag = useMemo<FormikBag<Values>>(() => [s_formik, inputAttrs], [s_formik, inputAttrs])
//   // console.log(['*', s_formik, inputAttrs, formik, bag])
//   return useMemo(() => [formik, bag] as const, [formik, bag])
// }

export interface FormikHandle<Values = Record<string, unknown>> {
  // export interface FormikHandle<Values = {}> {
  initialValues: Values
  initialErrors: FormikErrors<unknown>
  initialTouched: FormikTouched<unknown>
  initialStatus: any
  handleBlur: {
    (e: React.FocusEvent<any>): void
    <T = any>(fieldOrEvent: T): T extends string ? (e: any) => void : void
  }
  handleChange: {
    (e: React.ChangeEvent<any>): void
    <T_1 = string | React.ChangeEvent<any>>(field: T_1): T_1 extends React.ChangeEvent<any>
      ? void
      : (e: string | React.ChangeEvent<any>) => void
  }
  handleReset: (e: any) => void
  handleSubmit: (e?: React.FormEvent<HTMLFormElement> | undefined) => void
  resetForm: (nextState?: Partial<FormikState<Values>> | undefined) => void
  setErrors: (errors: FormikErrors<Values>) => void
  setFormikState: (
    stateOrCb: FormikState<Values> | ((state: FormikState<Values>) => FormikState<Values>),
  ) => void
  setFieldTouched: (
    field: string,
    touched?: boolean,
    shouldValidate?: boolean | undefined,
  ) => Promise<FormikErrors<Values>> | Promise<void>
  setFieldValue: (
    field: string,
    value: any,
    shouldValidate?: boolean | undefined,
  ) => Promise<FormikErrors<Values>> | Promise<void>
  setFieldError: (field: string, value: string | undefined) => void
  setStatus: (status: any) => void
  setSubmitting: (isSubmitting: boolean) => void
  setTouched: (
    touched: FormikTouched<Values>,
    shouldValidate?: boolean | undefined,
  ) => Promise<FormikErrors<Values>> | Promise<void>
  setValues: (
    values: React.SetStateAction<Values>,
    shouldValidate?: boolean | undefined,
  ) => Promise<FormikErrors<Values>> | Promise<void>
  submitForm: () => Promise<any>
  validateForm: (values?: Values) => Promise<FormikErrors<Values>>
  validateField: (name: string) => Promise<void> | Promise<string | undefined>
  isValid: boolean
  dirty: boolean
  unregisterField: (name: string) => void
  registerField: (name: string, { validate }: any) => void
  getFieldProps: (nameOrOptions: any) => FieldInputProps<any>
  getFieldMeta: (name: string) => FieldMetaProps<any>
  getFieldHelpers: (name: string) => FieldHelperProps<any>
  validateOnBlur: boolean
  validateOnChange: boolean
  validateOnMount: boolean
  values: Values
  errors: FormikErrors<Values>
  touched: FormikTouched<Values>
  isSubmitting: boolean
  isValidating: boolean
  status?: any
  submitCount: number
}
