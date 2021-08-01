import { t, Trans } from '@lingui/macro'
import React from 'react'
import InputTextField from '../../../components/atoms/InputTextField/InputTextField'
import PrimaryButton from '../../../components/atoms/PrimaryButton/PrimaryButton'
import SecondaryButton from '../../../components/atoms/SecondaryButton/SecondaryButton'
import { withCtrl } from '../../../lib/ctrl'
import { FormikBag } from '../../../lib/formik'
import { NewResourceFormValues } from '../types'
import './styles.scss'

export type ExtraDetailsProps = {
  step: 'ExtraDetailsStep'
  formBag: FormikBag<NewResourceFormValues>
  nextStep: (() => unknown) | undefined
  previousStep: (() => unknown) | undefined
}

export const ExtraDetails = withCtrl<ExtraDetailsProps>(({ formBag, nextStep, previousStep }) => {
  const [form, formAttrs] = formBag

  const dataInputs = (
    <div className="data-inputs">
      <InputTextField
        autoUpdate={true}
        value={form.values.type || null }
        label={t`Type`}
        placeholder=""
        {...formAttrs.type}
      />
      <InputTextField
        autoUpdate={true}
        value={form.values.level || null}
        label={t`Level`}
        placeholder=""
        {...formAttrs.level}
      />
      <InputTextField
        autoUpdate={true}
        value={form.values.level || null}
        label={t`Original Resource Date`}
        placeholder=""
        {...formAttrs.level}
      />
      <InputTextField
        autoUpdate={true}
        value={form.values.language || null}
        label={t`Language`}
        placeholder=""
        {...formAttrs.language}
      />
      <InputTextField
        autoUpdate={true}
        value={form.values.format || null}
        label={t`Format`}
        placeholder=""
        {...formAttrs.format}
      />
    </div>
  )

  return (
    <div className="extra-details">
      <div className="content">
          {dataInputs}
      </div>
      <div className="footer">
        <SecondaryButton onClick={previousStep} type="grey">
          <Trans>Back</Trans>
        </SecondaryButton>
        <PrimaryButton disabled={!nextStep} onClick={nextStep}>
          <Trans>Finish</Trans>
        </PrimaryButton>
      </div>
    </div>
  )
})
