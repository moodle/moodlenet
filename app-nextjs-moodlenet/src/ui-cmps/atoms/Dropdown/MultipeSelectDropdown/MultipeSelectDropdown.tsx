'use client'
import type { FC } from 'react'
import { useState } from 'react'
import type { DropdownProps, TextOptionProps } from '../Dropdown.jsx'
import { CheckmarkOption, Dropdown, SimplePill } from '../Dropdown.jsx'

export type MultipeSelectDropdownProps = Omit<
  DropdownProps,
  'multiple' | 'value' | 'defaultValue' | 'pills'
> & {
  defaultValue?: string[]
  value: string[]
  options: TextOptionProps[]
  canEdit: boolean
  shouldShowErrors?: boolean
  errors: string[] | string | undefined
}

export const MultipeSelectDropdown: FC<MultipeSelectDropdownProps> = props => {
  const { options, canEdit, errors, shouldShowErrors, ...dropdownProps } = props
  const [searchText, setSearchText] = useState('')

  const updatedElements = {
    opts: options.filter(
      o =>
        o.label.toUpperCase().includes(searchText.toUpperCase()) ||
        o.value.toUpperCase().includes(searchText.toUpperCase()),
    ),
    selected: options.filter(
      ({ value }) =>
        props.value.includes(value) && value.toUpperCase().includes(searchText.toUpperCase()),
    ),
  }
  return canEdit ? (
    <Dropdown
      {...dropdownProps}
      highlight={shouldShowErrors && !!errors}
      value={props.value}
      error={shouldShowErrors && errors}
      multilines
      multiple
      position={{ top: 77, bottom: 55 }}
      searchByText={setSearchText}
      pills={updatedElements.selected.map(selected => (
        <SimplePill edit key={selected.value} value={selected.value} label={selected.label} />
      ))}
    >
      {updatedElements.selected.map(selected => (
        <CheckmarkOption key={selected.value} value={selected.value} label={selected.label} />
      ))}
      {updatedElements.opts
        .filter(subject => !updatedElements.selected.includes(subject))
        .map(selected => (
          <CheckmarkOption key={selected.value} label={selected.label} value={selected.value} />
        ))}
    </Dropdown>
  ) : props.value.length ? (
    <div className="detail subject">
      <div className="label">{props.label}</div>
      <abbr className="value" title={updatedElements.selected[0]?.label}>
        {updatedElements.selected[0]?.label}
      </abbr>
    </div>
  ) : null
}

MultipeSelectDropdown.defaultProps = {
  edit: true,
}

export default MultipeSelectDropdown
