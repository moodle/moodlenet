import { useMemo, useRef } from 'react'
import { useTranslation } from 'next-i18next'
import { TextOptionProps } from '../../../../atoms/Dropdown/Dropdown'
import DropdownField from '../DropdownField'
import './DateField.scss'

export type DateFieldProps = {
  month: number | undefined
  allowedYears: number[]
  year: number | undefined
  canEdit: boolean
  errorMonth: string | undefined
  errorYear: string | undefined
  shouldShowErrors: boolean
  editMonth(month: number): void
  editYear(year: number): void
  disabled?: boolean
}

export default function DateField({
  month,
  year,
  allowedYears,
  canEdit,
  shouldShowErrors,
  errorMonth,
  errorYear,
  editMonth,
  editYear,
  disabled,
}: DateFieldProps) {
  const { t } = useTranslation()
  const { current: monthOptionsProps } = useRef<TextOptionProps[]>([
    { value: `1`, label: t`January` },
    { value: `2`, label: t`February` },
    { value: `3`, label: t`March` },
    { value: `4`, label: t`April` },
    { value: `5`, label: t`May` },
    { value: `6`, label: t`June` },
    { value: `7`, label: t`July` },
    { value: `8`, label: t`August` },
    { value: `9`, label: t`September` },
    { value: `10`, label: t`October` },
    { value: `11`, label: t`November` },
    { value: `12`, label: t`December` },
  ])
  const selectedMonthProps = monthOptionsProps.find(({ value }) => value === String(month))

  const yearOptionsProps = useMemo<TextOptionProps[]>(
    () => allowedYears.map(String).map<TextOptionProps>(year => ({ value: year, label: year })),
    [allowedYears],
  )
  const selectedYearProps = yearOptionsProps.find(({ value }) => value === String(year))

  return canEdit ? (
    <div className={`date-field ${disabled ? 'disabled' : ''}`}>
      <label>Original creation date</label>
      <div className="fields date-field">
        <DropdownField
          name="month"
          value={String(month)}
          onChange={e => {
            e.currentTarget.value !== String(month) && editMonth(parseInt(e.currentTarget.value))
          }}
          placeholder="Month"
          edit
          noBorder
          disabled={disabled}
          highlight={shouldShowErrors}
          error={shouldShowErrors && errorMonth}
          position={{ top: 30, bottom: 25 }}
          options={monthOptionsProps}
        />
        <DropdownField
          name="year"
          value={String(year)}
          onChange={e => {
            e.currentTarget.value !== String(year) && editYear(parseInt(e.currentTarget.value))
          }}
          placeholder="Year"
          edit
          noBorder
          disabled={disabled}
          highlight={shouldShowErrors}
          error={shouldShowErrors && errorYear}
          position={{ top: 30, bottom: 25 }}
          options={yearOptionsProps}
        />
      </div>
    </div>
  ) : month || year ? (
    <div className={`date-field-read-mode detail ${disabled ? 'disabled' : ''}`}>
      <div className="title">Original creation date</div>
      <abbr className={`value date`} title={`${selectedMonthProps?.value ?? ''} ${selectedYearProps?.value ?? ''}`}>
        {selectedMonthProps && <span>{selectedMonthProps.value}</span>}
        {selectedYearProps && <span>{selectedYearProps.value}</span>}
      </abbr>
    </div>
  ) : null
}
