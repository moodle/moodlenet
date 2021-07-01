import { FormikConfig, FormikErrors, FormikTouched, useFormik } from 'formik'
import { ChangeEvent, FormEvent, useMemo } from 'react'
import { hasNoValue } from '../../helpers/data'

export type Submit<Values> = FormikConfig<Values>['onSubmit']
type FormikInputAttrs<Values> = {
  [ValueName in keyof Values]: { name: ValueName; value?: Values[ValueName] }
}
export const formikInputAttrs = <Values>(bag: _Formik<Values>) =>
  Object.entries(bag.values).reduce<FormikInputAttrs<Values>>(
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
    {} as any,
  )
export const useFormikInputAttrs = <Values>(bag: _Formik<Values>) => useMemo(() => formikInputAttrs(bag), [bag])

export const useFormikPlus = <Values>(config: FormikConfig<Values>) => {
  const formik = useFormik(config)
  const inputAttrs = useFormikInputAttrs(formik)
  return [formik, inputAttrs] as const
}

export interface _Formik<Values = {}> {
  initialValues: Values
  handleBlur: (eventOrString: any) => void | ((e: any) => void)
  handleChange: (
    eventOrPath: string | ChangeEvent<any>,
  ) => void | ((eventOrTextValue: string | ChangeEvent<any>) => void)
  handleReset: (e: any) => void
  handleSubmit: (e?: FormEvent<HTMLFormElement> | undefined) => void
  submitForm: () => unknown
  setFieldValue: (field: string, value: any, shouldValidate?: boolean | undefined) => any

  isValid: boolean
  dirty: boolean
  values: Values

  errors: FormikErrors<Values>
  touched: FormikTouched<Values>
  isSubmitting: boolean
  isValidating: boolean
  submitCount: number
}
