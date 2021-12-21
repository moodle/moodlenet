import { action } from '@storybook/addon-actions'
import { FormikBag, SimplifiedFormik } from '../formik'

type SBFormikBagCfgKeys =
  | 'dirty'
  | 'errors'
  | 'isSubmitting'
  | 'isValid'
  | 'isValidating'
  | 'submitCount'
  | 'touched'
  | 'values'
export type SBFormikBagCfg<T> = {
  [Key in SBFormikBagCfgKeys]: SimplifiedFormik<T>[Key]
}
export const SBFormikBag = <T>(
  initialValues: T,
  p_cfg?: Partial<SimplifiedFormik<T>>
): FormikBag<T> => {
  const form: SimplifiedFormik<T> = {
    initialValues,
    values: initialValues,
    setFieldValue: action('setFieldValue'),
    submitForm: action('submitForm'),
    handleBlur: action('handleBlur'),
    handleChange: action('handleChange'),
    handleReset: action('handleReset'),
    handleSubmit: action('handleSubmit'),
    //
    dirty: false,
    errors: {},
    isSubmitting: false,
    isValid: !Object.keys(p_cfg?.errors ?? {}).length,
    isValidating: false,
    submitCount: 0,
    touched: {},
    ///
    ...p_cfg,
  }
  const attrs = {} as any
  return [form, attrs]
}
