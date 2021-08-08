import { Trans } from '@lingui/macro'
import React from 'react'
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
  formats: DropdownField
}

export const ExtraDetails = withCtrl<ExtraDetailsProps>(({ 
  formBag, 
  types, 
  levels,
  months,
  years,
  languages,
  formats,
  nextStep, 
  previousStep 
}) => {
  const [form, formAttrs] = formBag

  const dataInputs = (
    <div className="data-inputs">
      <Dropdown value={form.values.type} {...types} {...formAttrs.type} getValue={(value) => form.setFieldValue('type', value)}/>
      <Dropdown value={form.values.level} {...levels} {...formAttrs.level} getValue={(value) => form.setFieldValue('level', value)}/>
      <div className="date">
        <label><Trans>Original Creation Date</Trans></label>
        <div className="fields">
          <Dropdown value={form.values.originalDateMonth} {...months} {...formAttrs.originalDateMonth} getValue={() => form.setFieldValue('originalDateMonth', null)}/>
          <Dropdown value={form.values.originalDateYear} {...years} {...formAttrs.originalDateYear} getValue={() => form.setFieldValue('originalDateYear', null)}/>
        </div>
      </div>
      <Dropdown value={form.values.language} {...languages} {...formAttrs.language} getValue={(value) => form.setFieldValue('language', value)}/>
      <Dropdown value={form.values.format} {...formats} {...formAttrs.format} getValue={(value) => form.setFieldValue('format', value)}/>
    </div>
  )

  return (
    <div className="extra-details">
      <div className="content">
          {dataInputs}
      </div>
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
})
