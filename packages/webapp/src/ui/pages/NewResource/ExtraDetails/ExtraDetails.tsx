import { Trans } from '@lingui/macro'
import { useCallback } from 'react'
import Dropdown from '../../../components/atoms/Dropdown/Dropdown'
import PrimaryButton from '../../../components/atoms/PrimaryButton/PrimaryButton'
import SecondaryButton from '../../../components/atoms/SecondaryButton/SecondaryButton'
import { withCtrl } from '../../../lib/ctrl'
import { FormikBag } from '../../../lib/formik'
import { DropdownField } from '../FieldsData'
import { NewResourceFormValues } from '../types'
import './styles.scss'

export type ExtraDetailsProps = {
  step: 'ExtraDetailsStep'
  formBag: FormikBag<NewResourceFormValues>
  nextStep: (() => unknown) | undefined
  previousStep: (() => unknown) | undefined
  types: DropdownField
  levels: DropdownField
  months: DropdownField
  years: DropdownField
  languages: DropdownField
  // formats: DropdownField
}

export const ExtraDetails = withCtrl<ExtraDetailsProps>(
  ({ formBag, types, levels, months, years, languages, /* formats,  */ nextStep, previousStep }) => {
    const [form, formAttrs] = formBag
    const setFieldValue = form.setFieldValue
    const setTypeField = useCallback((_: string) => setFieldValue('type', _), [setFieldValue])
    const setLevelField = useCallback((_: string) => setFieldValue('level', _), [setFieldValue])
    const setMonthField = useCallback((_: string) => setFieldValue('originalDateMonth', _), [setFieldValue])
    const setYearField = useCallback((_: string) => setFieldValue('originalDateYear', _), [setFieldValue])
    const setLangField = useCallback((_: string) => setFieldValue('language', _), [setFieldValue])
    // const setFormatField = useCallback((_: string) => setFieldValue('format', _), [setFieldValue])

    const dataInputs = (
      <div className="data-inputs">
        <Dropdown value={form.values.type} {...types} {...formAttrs.type} getValue={setTypeField} />
        <Dropdown value={form.values.level} {...levels} {...formAttrs.level} getValue={setLevelField} />
        <div className="date">
          <label>
            <Trans>Original creation date</Trans>
          </label>
          <div className="fields">
            <Dropdown
              value={form.values.originalDateMonth}
              {...months}
              {...formAttrs.originalDateMonth}
              getValue={setMonthField}
            />
            <Dropdown
              value={form.values.originalDateYear}
              {...years}
              {...formAttrs.originalDateYear}
              getValue={setYearField}
            />
          </div>
        </div>
        <Dropdown {...languages} {...formAttrs.language} getValue={setLangField} />
        {/* <Dropdown {...formats} {...formAttrs.format} getValue={setFormatField} /> */}
      </div>
    )

    return (
      <div className="extra-details">
        <div className="content">{dataInputs}</div>
        <div className="footer">
          <SecondaryButton onClick={previousStep} color="grey">
            <Trans>Back</Trans>
          </SecondaryButton>
          <PrimaryButton disabled={!nextStep} onClick={nextStep}>
            <Trans>Finish</Trans>
          </PrimaryButton>
        </div>
      </div>
    )
  },
)
