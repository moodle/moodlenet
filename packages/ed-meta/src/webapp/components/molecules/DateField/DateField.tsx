import {
  Dropdown,
  MonthTextOptionProps,
  SimplePill,
  SimpleTextOption,
  TextOption,
} from '@moodlenet/component-library'
import { FC, useEffect, useState } from 'react'
import { YearsProps } from '../../../../common/data.js'

export type DateFieldProps = {
  month: string | undefined
  year: string | undefined
  canEdit: boolean
  errorMonth: string | undefined
  errorYear: string | undefined
  shouldShowErrors: boolean
  editMonth(month: string): void
  editYear(year: string): void
}

export const DateField: FC<DateFieldProps> = ({
  month,
  year,
  canEdit,
  shouldShowErrors,
  errorMonth,
  errorYear,
  editMonth,
  editYear,
}) => {
  const months = {
    opts: MonthTextOptionProps,
    selected: MonthTextOptionProps.find(({ value }) => value === month),
  }
  const [updatedMonths, setUpdatedMonths] = useState(months)
  const [searchTextMonth, setSearchTextMonth] = useState('')
  useEffect(() => {
    setUpdatedMonths({
      opts: MonthTextOptionProps,
      selected: MonthTextOptionProps.find(({ value }) => value === month),
    })
  }, [month])
  useEffect(() => {
    setUpdatedMonths({
      opts: months.opts.filter(o => o.value.toUpperCase().includes(searchTextMonth.toUpperCase())),
      selected: MonthTextOptionProps.find(
        ({ value }) =>
          value === month && value.toUpperCase().includes(searchTextMonth.toUpperCase()),
      ),
    })
  }, [searchTextMonth, month, months.opts])

  const years = {
    opts: YearsProps,
    selected: YearsProps.find(value => value === month),
  }
  const [updatedYears, setUpdatedYears] = useState(years)
  const [searchTextYear, setSearchTextYear] = useState('')
  useEffect(() => {
    setUpdatedYears({
      opts: YearsProps,
      selected: YearsProps.find(value => value === month),
    })
  }, [month])
  useEffect(() => {
    setUpdatedYears({
      opts: years.opts.filter(o => o.toUpperCase().includes(searchTextYear.toUpperCase())),
      selected: YearsProps.find(
        value => value === year && value.toUpperCase().includes(searchTextYear.toUpperCase()),
      ),
    })
  }, [searchTextYear, year, years.opts])

  return canEdit ? (
    <div className="date">
      <label>Original creation date</label>
      <div className="fields">
        <Dropdown
          name="month"
          value={month}
          onChange={e => {
            e.currentTarget.value !== month && editMonth(e.currentTarget.value)
          }}
          placeholder="Month"
          edit
          highlight={shouldShowErrors && !!errorMonth}
          error={errorMonth}
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
          highlight={shouldShowErrors && !!errorYear}
          error={errorYear}
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
    <div className="detail">
      <div className="title">Original creation date</div>
      <abbr
        className={`value date`}
        title={`${MonthTextOptionProps.find(({ value }) => value === month)?.label ?? ''} ${
          year ?? ''
        }`}
      >
        <span>{MonthTextOptionProps.find(({ value }) => value === month)?.label ?? ''}</span>
        <span>{year ?? ''}</span>
      </abbr>
    </div>
  ) : null
}

export default DateField
