import { FormikConfig, FormikErrors, FormikTouched, useFormik } from 'formik'
import { ChangeEvent, FormEvent, useMemo } from 'react'
import { hasNoValue } from '../../helpers/data'

export type SubmitForm<Values> = FormikConfig<Values>['onSubmit']
type FormikInputAttrs<Values> = {
  [ValueName in keyof Values]: { name: ValueName; value?: Values[ValueName] }
}
export const formikInputAttrs = <Values>(values: Values) =>
  Object.entries(values).reduce<FormikInputAttrs<Values>>(
    (collect, [name, value]) => ({
      ...collect,
      [name]: {
        name,
        ...(value instanceof File || hasNoValue(value)
          ? null
          : {
              value,
            }),
      },
    }),
    {} as any
  )

export const useFormikInputAttrs = <Values>(values: Values) =>
  useMemo(() => formikInputAttrs(values), [values])

export type FormikBag<Values = {}> = readonly [
  SimplifiedFormik<Values>,
  FormikInputAttrs<Values>
]
export const useFormikBag = <Values>(config: FormikConfig<Values>) => {
  const formik = useFormik(config)
  const s_formik = formik as SimplifiedFormik<Values>
  const inputAttrs = useFormikInputAttrs(s_formik.values)
  const bag = useMemo<FormikBag<Values>>(
    () => [s_formik, inputAttrs],
    [s_formik, inputAttrs]
  )
  // console.log(['*', s_formik, inputAttrs, formik, bag])
  return useMemo(() => [formik, bag] as const, [formik, bag])
}

export interface SimplifiedFormik<Values = {}> {
  initialValues: Values
  handleBlur: (eventOrString: any) => void | ((e: any) => void)
  handleChange: (
    eventOrPath: string | ChangeEvent<any>
  ) => void | ((eventOrTextValue: string | ChangeEvent<any>) => void)
  handleReset: (e: any) => void
  handleSubmit: (e?: FormEvent<HTMLFormElement> | undefined) => void
  submitForm: () => unknown
  setFieldValue: <K extends keyof Values>(
    field: K,
    value: Values[K],
    shouldValidate?: boolean | undefined
  ) => any

  isValid: boolean
  dirty: boolean
  values: Values

  errors: FormikErrors<Values>
  touched: FormikTouched<Values>
  isSubmitting: boolean
  isValidating: boolean
  submitCount: number
}
