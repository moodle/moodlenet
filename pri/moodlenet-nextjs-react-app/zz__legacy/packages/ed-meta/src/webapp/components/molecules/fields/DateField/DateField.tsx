import type { TextOptionProps } from '@moodlenet/component-library'
import { Dropdown, SimplePill, SimpleTextOption, TextOption } from '@moodlenet/component-library'
import type { FC } from 'react'
import { useEffect, useState } from 'react'
import './DateField.scss'

export type DateFieldProps = {
  month: string | undefined
  monthOptions: TextOptionProps[]
  yearOptions: string[]
  year: string | undefined
  canEdit: boolean
  errorMonth: string | undefined
  errorYear: string | undefined
  shouldShowErrors: boolean
  editMonth(month: string): void
  editYear(year: string): void
  disabled?: boolean
}

export const DateField: FC<DateFieldProps> = ({
  month,
  monthOptions,
  year,
  yearOptions,
  canEdit,
  shouldShowErrors,
  errorMonth,
  errorYear,
  editMonth,
  editYear,
  disabled,
}) => {
  const months = {
    opts: monthOptions,
    selected: monthOptions.find(({ value }) => value === month),
  }
  const [updatedMonths, setUpdatedMonths] = useState(months)
  const [searchTextMonth, setSearchTextMonth] = useState('')
  useEffect(() => {
    setUpdatedMonths({
      opts: monthOptions,
      selected: monthOptions.find(({ value }) => value === month),
    })
  }, [month, monthOptions])
  useEffect(() => {
    setUpdatedMonths({
      opts: months.opts.filter(o => o.value.toUpperCase().includes(searchTextMonth.toUpperCase())),
      selected: monthOptions.find(
        ({ value }) =>
          value === month && value.toUpperCase().includes(searchTextMonth.toUpperCase()),
      ),
    })
  }, [searchTextMonth, month, months.opts, monthOptions])

  const years = {
    opts: yearOptions,
    selected: yearOptions.find(value => value === month),
  }
  const [updatedYears, setUpdatedYears] = useState(years)
  const [searchTextYear, setSearchTextYear] = useState('')
  useEffect(() => {
    setUpdatedYears({
      opts: yearOptions,
      selected: yearOptions.find(value => value === month),
    })
  }, [month, yearOptions])
  useEffect(() => {
    setUpdatedYears({
      opts: years.opts.filter(o => o.toUpperCase().includes(searchTextYear.toUpperCase())),
      selected: yearOptions.find(
        value => value === year && value.toUpperCase().includes(searchTextYear.toUpperCase()),
      ),
    })
  }, [searchTextYear, year, yearOptions, years.opts])

  const monthLabel = monthOptions.find(({ value }) => value === month)?.label
  return canEdit ? (
    <div className={`date-field ${disabled ? 'disabled' : ''}`}>
      <label>Original creation date</label>
      <div className="fields date-field">
        <Dropdown
          name="month"
          value={month}
          onChange={e => {
            e.currentTarget.value !== month && editMonth(e.currentTarget.value)
          }}
          placeholder="Month"
          edit
          noBorder
          disabled={disabled}
          highlight={shouldShowErrors}
          error={shouldShowErrors && errorMonth}
          position={{ top: 30, bottom: 25 }}
          searchByText={setSearchTextMonth}
          pills={
            updatedMonths.selected && (
              <SimplePill
                key={updatedMonths.selected.value}
                value={updatedMonths.selected.value}
                label={updatedMonths.selected.label}
              />
            )
          }
        >
          {updatedMonths.selected && (
            <TextOption
              key={updatedMonths.selected.value}
              value={updatedMonths.selected.value}
              label={updatedMonths.selected.label}
            />
          )}
          {updatedMonths.opts.map(
            ({ value, label }) =>
              updatedMonths.selected?.value !== value && (
                <TextOption key={value} value={value} label={label} />
              ),
          )}
        </Dropdown>
        <Dropdown
          name="year"
          value={year}
          onChange={e => {
            e.currentTarget.value !== year && editYear(e.currentTarget.value)
          }}
          placeholder="Year"
          edit
          noBorder
          disabled={disabled}
          highlight={shouldShowErrors}
          error={shouldShowErrors && errorYear}
          position={{ top: 30, bottom: 25 }}
          searchByText={setSearchTextYear}
          pills={
            updatedYears.selected && (
              <SimplePill
                key={updatedYears.selected}
                value={updatedYears.selected}
                label={updatedYears.selected}
              />
            )
          }
        >
          {updatedYears.selected && (
            <SimpleTextOption key={updatedYears.selected} value={updatedYears.selected} />
          )}
          {updatedYears.opts.map(
            value =>
              updatedYears.selected !== value && <SimpleTextOption key={value} value={value} />,
          )}
        </Dropdown>
      </div>
    </div>
  ) : month || year ? (
    <div className={`date-field-read-mode detail ${disabled ? 'disabled' : ''}`}>
      <div className="title">Original creation date</div>
      <abbr className={`value date`} title={`${monthLabel ?? ''} ${year ?? ''}`}>
        {monthLabel && <span>{monthLabel}</span>}
        {year && <span>{year}</span>}
      </abbr>
    </div>
  ) : null
}

export default DateField
