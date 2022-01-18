import { action } from '@storybook/addon-actions'
import { FormikBag, FormikHandle } from '../formik'

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
  [Key in SBFormikBagCfgKeys]: FormikHandle<T>[Key]
}
export const SBFormikBag = <T>(
  initialValues: T,
  p_cfg?: Partial<FormikHandle<T>>
): FormikBag<T> => {
  const form = SBSimplifiedForm(initialValues, p_cfg)
  const attrs = {} as any
  return [form, attrs]
}
export const SBSimplifiedForm = <T>(
  initialValues: T,
  p_cfg?: Partial<FormikHandle<T>>
): FormikHandle<T> => {
  const form: FormikHandle<T> = {
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
  return form
}
