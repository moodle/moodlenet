import { FormikErrors, FormikTouched } from 'formik'
import React from 'react'

export interface FormBag<Values = {}> {
  initialValues: Values
  handleBlur: (eventOrString: any) => void | ((e: any) => void)
  handleChange: (
    eventOrPath: string | React.ChangeEvent<any>,
  ) => void | ((eventOrTextValue: string | React.ChangeEvent<any>) => void)
  handleReset: (e: any) => void
  handleSubmit: (e?: React.FormEvent<HTMLFormElement> | undefined) => void
  submitForm: () => unknown
  setFieldValue: (field: string, value: any, shouldValidate?: boolean | undefined) => any

  isValid: boolean
  dirty: boolean
  values: Values
  valueName: {
    [ValueName in keyof Values]: { name: ValueName; value: Values[ValueName] }
  }
  errors: FormikErrors<Values>
  touched: FormikTouched<Values>
  isSubmitting: boolean
  isValidating: boolean
  submitCount: number
}
