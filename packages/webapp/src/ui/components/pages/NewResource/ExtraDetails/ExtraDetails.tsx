import { t, Trans } from '@lingui/macro'
import { withCtrl } from '../../../../lib/ctrl'
import {
  Dropdown,
  SimplePill,
  TextOption,
  TextOptionProps,
} from '../../../atoms/DropdownNew/Dropdown'
import PrimaryButton from '../../../atoms/PrimaryButton/PrimaryButton'
import SecondaryButton from '../../../atoms/SecondaryButton/SecondaryButton'
import { useNewResourcePageCtx } from '../NewResource'
import { MonthTextOptionProps, YearsProps } from './storiesData'
import './styles.scss'

export type ExtraDetailsProps = {
  types: {
    opts: TextOptionProps[]
    selected?: TextOptionProps
  }
  levels: {
    opts: TextOptionProps[]
    selected?: TextOptionProps
  }
  languages: {
    opts: TextOptionProps[]
    selected?: TextOptionProps
  }
}
// const usingFields: (keyof NewResourceFormValues)[] = [
//   'type',
//   'level',
//   'month',
//   'year',
//   'language',
// ]

export const ExtraDetails = withCtrl<ExtraDetailsProps>(
  ({ types, levels, languages }) => {
    const { prevForm, form } = useNewResourcePageCtx()

    const dataInputs = (
      <div className="data-inputs">
        <Dropdown
          name="type"
          placeholder={t`Content type`}
          label={t`Type`}
          value={form.values.type}
          onChange={form.handleChange}
          edit
          pills={
            types.selected && (
              <SimplePill
                label={types.selected.label}
                value={types.selected.value}
              />
            )
          }
        >
          {types.opts.map(({ label, value }) => (
            <TextOption key={value} label={label} value={value} />
          ))}
        </Dropdown>
        <Dropdown
          name="level"
          placeholder={t`Education level`}
          label={t`Level`}
          value={form.values.level}
          onChange={form.handleChange}
          edit
          pills={
            levels.selected && (
              <SimplePill
                label={levels.selected.label}
                value={levels.selected.value}
              />
            )
          }
        >
          {levels.opts.map(({ label, value }) => (
            <TextOption key={value} label={label} value={value} />
          ))}
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
              edit
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
              error={form.errors.year}
              edit
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
          edit
          pills={
            languages.selected && (
              <SimplePill
                label={languages.selected.label}
                value={languages.selected.value}
              />
            )
          }
        >
          {languages.opts.map(({ label, value }) => (
            <TextOption key={value} label={label} value={value} />
          ))}
        </Dropdown>
      </div>
    )

    return (
      <div className="extra-details">
        <div className="content">{dataInputs}</div>
        <div className="footer">
          <SecondaryButton onClick={prevForm} color="grey">
            <Trans>Back</Trans>
          </SecondaryButton>
          <PrimaryButton
            onClick={form.isValid ? form.submitForm : () => form.validateForm()}
          >
            <Trans>Create resource</Trans>
          </PrimaryButton>
        </div>
      </div>
    )
  }
)
