import { useEffect, useState } from 'react'
import { Dropdown, DropdownProps, SimplePill, TextOption, TextOptionProps } from '../../../atoms/Dropdown/Dropdown'

export type DropdownFieldProps = {
  options: TextOptionProps[]
  shouldShowErrors?: boolean
} & Omit<DropdownProps & { multiple?: undefined }, 'pills'>

export default function DropdownField({ options, edit, shouldShowErrors = false, ...dropdownProps }: DropdownFieldProps) {
  const elements = {
    opts: options,
    selected: options.find(({ value }) => value === value),
  }
  const [updatedElements, setUpdatedElements] = useState(elements)
  const [searchText, setSearchText] = useState('')

  useEffect(() => {
    setUpdatedElements({
      opts: options,
      selected: options.find(({ value }) => dropdownProps.value === value),
    })
  }, [dropdownProps.value, options])

  useEffect(() => {
    setUpdatedElements({
      opts: elements.opts.filter(o => o.value.toUpperCase().includes(searchText.toUpperCase())),
      selected: options.find(
        ({ value }) => dropdownProps.value === value && value.toUpperCase().includes(searchText.toUpperCase()),
      ),
    })
  }, [searchText, dropdownProps.value, elements.opts, options])

  return edit ? (
    <Dropdown
      {...dropdownProps}
      edit
      highlight={shouldShowErrors && !!dropdownProps.error}
      error={shouldShowErrors && dropdownProps.error}
      position={{ top: 50, bottom: 25 }}
      searchByText={setSearchText}
      pills={
        updatedElements.selected && (
          <SimplePill
            key={updatedElements.selected.value}
            value={updatedElements.selected.value}
            label={updatedElements.selected.label}
          />
        )
      }
    >
      {updatedElements.selected && (
        <TextOption
          key={updatedElements.selected.value}
          value={updatedElements.selected.value}
          label={updatedElements.selected.label}
        />
      )}
      {updatedElements.opts.map(
        ({ value, label }) =>
          updatedElements.selected?.value !== value && <TextOption key={value} value={value} label={label} />,
      )}
    </Dropdown>
  ) : dropdownProps.value ? (
    <div className={`detail selection ${dropdownProps.disabled ? 'disabled' : ''}`}>
      <div className="title">{dropdownProps.label}</div>
      <abbr className="value" title={elements.selected?.label}>
        {elements.selected?.label}
      </abbr>
    </div>
  ) : null
}
