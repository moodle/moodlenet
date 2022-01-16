import { SimplifiedFormik } from '../../../../lib/formik'

export type ExtraDetailsFormValues = Partial<{
  type: string
  level: string
  originalDateMonth: number
  originalDateYear: number
  language: string
  format: string
}>
export type ExtraDetailsProps = {
  step: 'ExtraDetailsStep'
  formBag: SimplifiedFormik<ExtraDetailsFormValues>
  nextStep: (() => unknown) | undefined
  previousStep: () => unknown
  types: [list: SimpleOpt[], selected: SimpleOpt]
  levels: [list: SimpleOpt[], selected: SimpleOpt]
  months: [list: SimpleOpt[], selected: SimpleOpt]
  years: [list: SimpleOpt[], selected: SimpleOpt]
  languages: [list: SimpleOpt[], selected: SimpleOpt]
}
type SimpleOpt = [key: string, label: string]
