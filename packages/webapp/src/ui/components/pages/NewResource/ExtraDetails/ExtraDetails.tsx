import { t, Trans } from '@lingui/macro'
import { useState } from 'react'
import { withCtrl } from '../../../../lib/ctrl'
import { SelectOptions } from '../../../../lib/types'
import {
  Dropdown,
  SimplePill,
  TextOption,
  TextOptionProps,
} from '../../../atoms/Dropdown/Dropdown'
import Loading from '../../../atoms/Loading/Loading'
import PrimaryButton from '../../../atoms/PrimaryButton/PrimaryButton'
import SecondaryButton from '../../../atoms/SecondaryButton/SecondaryButton'
import { MonthTextOptionProps, YearsProps } from '../FieldsData'
import { useNewResourcePageCtx } from '../NewResource'
import { NewResourceFormValues } from '../types'
import './styles.scss'

export type ExtraDetailsProps = {
  types: SelectOptions<TextOptionProps>
  setTypeFilter(text: string): unknown
  levels: SelectOptions<TextOptionProps>
  setLevelFilter(text: string): unknown
  languages: SelectOptions<TextOptionProps>
  setLanguageFilter(text: string): unknown
}

const usingFields: (keyof NewResourceFormValues)[] = [
  'type',
  'level',
  'month',
  'year',
  'language',
]

export const ExtraDetails = withCtrl<ExtraDetailsProps>(
  ({
    types,
    levels,
    languages,
    setLanguageFilter,
    setLevelFilter,
    setTypeFilter,
  }) => {
    const { prevForm, form } = useNewResourcePageCtx()
    const [shouldShowErrors, setShouldShowErrors] = useState<boolean>(false)
    const isValid = usingFields.reduce(
      (valid, fldName) => valid && !form.errors[fldName],
      true
    )

    const dataInputs = (
      <div className="data-inputs">
        <Dropdown
          name="type"
          placeholder={t`Content type`}
          label={t`Type`}
          value={form.values.type}
          onChange={form.handleChange}
          edit={!form.isSubmitting}
          error={shouldShowErrors && form.errors.type}
          disabled={form.isSubmitting}
          searchByText={setTypeFilter}
          pills={
            types.selected && (
              <SimplePill
                label={types.selected.label}
                value={types.selected.value}
              />
            )
          }
        >
          {types.selected && (
            <TextOption
              key={types.selected.value}
              value={types.selected.value}
              label={types.selected.label}
            />
          )}
          {types.opts.map(
            ({ label, value }) =>
              types.selected?.value !== value && (
                <TextOption key={value} label={label} value={value} />
              )
          )}
        </Dropdown>
        <Dropdown
          name="level"
          placeholder={t`Education level`}
          label={t`Level`}
          value={form.values.level}
          onChange={form.handleChange}
          edit={!form.isSubmitting}
          error={shouldShowErrors && form.errors.level}
          disabled={form.isSubmitting}
          searchByText={setLevelFilter}
          pills={
            levels.selected && (
              <SimplePill
                label={levels.selected.label}
                value={levels.selected.value}
              />
            )
          }
        >
          {levels.selected && (
            <TextOption
              key={levels.selected.value}
              value={levels.selected.value}
              label={levels.selected.label}
            />
          )}
          {levels.opts.map(
            ({ label, value }) =>
              levels.selected?.value !== value && (
                <TextOption key={value} label={label} value={value} />
              )
          )}
        </Dropdown>
        <div className="date">
          <label>
            <Trans>Original creation date</Trans>
          </label>
          <div className="fields">
            <Dropdown
              className="month-dropdown"
              name="month"
              placeholder={t`Month`}
              onChange={form.handleChange}
              label=""
              value={form.values.month}
              edit={!form.isSubmitting}
              error={shouldShowErrors && form.errors.month}
              disabled={form.isSubmitting}
              pills={
                form.values.month && (
                  <SimplePill
                    label={
                      MonthTextOptionProps.find(
                        ({ value }) => value === form.values.month
                      )!.label
                    }
                    value={form.values.month}
                  />
                )
              }
            >
              {MonthTextOptionProps.map(({ label, value }) => (
                <TextOption key={value} label={label} value={value} />
              ))}
            </Dropdown>
            <Dropdown
              className="year-dropdown"
              placeholder={t`Year`}
              name="year"
              label=""
              onChange={form.handleChange}
              value={form.values.year}
              error={shouldShowErrors && form.errors.year}
              edit={!form.isSubmitting}
              disabled={form.isSubmitting}
              pills={
                form.values.year && (
                  <SimplePill
                    label={form.values.year}
                    value={form.values.year}
                  />
                )
              }
            >
              {YearsProps.map((year) => (
                <TextOption key={year} label={year} value={year} />
              ))}
            </Dropdown>
          </div>
        </div>
        <Dropdown
          name="language"
          placeholder={t`Content language`}
          label={t`Language`}
          value={form.values.language}
          onChange={form.handleChange}
          edit={!form.isSubmitting}
          error={shouldShowErrors && form.errors.language}
          disabled={form.isSubmitting}
          searchByText={setLanguageFilter}
          pills={
            languages.selected && (
              <SimplePill
                label={languages.selected.label}
                value={languages.selected.value}
              />
            )
          }
        >
          {languages.selected && (
            <TextOption
              key={languages.selected.value}
              label={languages.selected.label}
              value={languages.selected.value}
            />
          )}
          {languages.opts.map(
            ({ label, value }) =>
              languages.selected?.value !== value && (
                <TextOption key={value} label={label} value={value} />
              )
          )}
        </Dropdown>
      </div>
    )

    return (
      <div className="extra-details">
        <div className="content">{dataInputs}</div>
        <div className="footer">
          <SecondaryButton
            onClick={prevForm}
            color="grey"
            disabled={form.isSubmitting}
          >
            <Trans>Back</Trans>
          </SecondaryButton>
          <PrimaryButton
            className={`${form.isSubmitting ? 'loading' : ''}`}
            onClick={
              !isValid
                ? () => {
                    setShouldShowErrors(true)
                    form.validateForm()
                  }
                : form.submitForm
            }
          >
            <div
              className="loading"
              style={{ visibility: form.isSubmitting ? 'visible' : 'hidden' }}
            >
              <Loading color="white" />
            </div>
            <div
              className="label"
              style={{ visibility: form.isSubmitting ? 'hidden' : 'visible' }}
            >
              <Trans>Create resource</Trans>
            </div>
          </PrimaryButton>
        </div>
      </div>
    )
  }
)
