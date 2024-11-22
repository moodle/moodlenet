import { eduResourceMeta } from '@moodle/module/edu'
import { useTranslation } from 'next-i18next'
import { useCallback, useMemo, useRef } from 'react'
import { TextOptionProps } from '../../../../atoms/Dropdown/Dropdown'
import DropdownField from '../DropdownField'
import './DateField.scss'

export type DateFieldProps = {
  publicationDate: eduResourceMeta['publicationDate']
  allowedYears: number[]
  canEdit: boolean
  errorMonth: string | undefined
  errorYear: string | undefined
  shouldShowErrors: boolean
  onChange(publicationDate: eduResourceMeta['publicationDate']): void
  disabled?: boolean
}

export default function DateField({
  publicationDate,
  allowedYears,
  canEdit,
  shouldShowErrors,
  errorMonth,
  errorYear,
  onChange,
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

  const yearOptionsProps = useMemo<TextOptionProps[]>(
    () => allowedYears.map(String).map<TextOptionProps>(year => ({ value: year, label: year })),
    [allowedYears],
  )
  const handleChange = useCallback(
    (field: 'month' | 'year', action: 'select' | 'deselect', valueStr: string | null) => {
      const value = valueStr ? parseInt(valueStr) : null
      const _m_publicationDate = {
        ...(publicationDate ?? {}),
        [field]: action === 'select' ? value : null,
      }
      const _publicationDate = !_m_publicationDate.year ? null : (_m_publicationDate as eduResourceMeta['publicationDate'])
      onChange(_publicationDate)
    },
    [onChange, publicationDate],
  )

  const yearValue = publicationDate?.year ? String(publicationDate.year) : undefined
  const monthValue = publicationDate?.month ? String(publicationDate.month) : undefined
  console.log({
    publicationDate,
    monthValue,
    yearValue,
  })
  return canEdit ? (
    <div className={`date-field ${disabled ? 'disabled' : ''}`}>
      <label>Original creation date</label>
      <div className="fields date-field">
        <DropdownField
          name="month"
          disabled={disabled || !yearValue}
          defaultValue={monthValue}
          onItem={(action, month) => handleChange('month', action, month)}
          // onChange={ev => handleChange('month', ev.target.value)}
          placeholder="Month"
          edit
          noBorder
          highlight={shouldShowErrors}
          error={shouldShowErrors && errorMonth}
          // position={{ top: 30, bottom: 25 }}
          options={monthOptionsProps}
        />
        <DropdownField
          name="year"
          defaultValue={yearValue}
          onItem={(action, year) => handleChange('year', action, year)}
          placeholder="Year"
          edit
          noBorder
          disabled={disabled}
          highlight={shouldShowErrors}
          error={shouldShowErrors && errorYear}
          // position={{ top: 30, bottom: 25 }}
          options={yearOptionsProps}
        />
      </div>
    </div>
  ) : publicationDate ? (
    <div className={`date-field-read-mode detail ${disabled ? 'disabled' : ''}`}>
      <div className="title">Original creation date</div>
      <abbr className={`value date`} title={`${publicationDate.month ?? ''} ${publicationDate.year ?? ''}`}>
        {publicationDate.month && <span>{publicationDate.month}</span>}
        {publicationDate.year && <span>{publicationDate.year}</span>}
      </abbr>
    </div>
  ) : null
}
