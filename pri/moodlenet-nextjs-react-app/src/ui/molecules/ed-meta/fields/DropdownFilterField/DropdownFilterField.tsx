import { ArrowDropDown } from '@mui/icons-material'
import { isValidElement, useState } from 'react'
import {
  Dropdown,
  DropdownProps,
  IconTextOptionProps,
  TextOption,
  TextOptionProps,
} from '../../../../atoms/Dropdown/Dropdown'
import { PrimaryButton } from '../../../../atoms/PrimaryButton/PrimaryButton'
import { SecondaryButton } from '../../../../atoms/SecondaryButton/SecondaryButton'
import './DropdownFilterField.scss'

export type DropdownFilterFieldProps = DropdownProps & { multiple: true } & {
  options: (TextOptionProps | IconTextOptionProps)[]
  highlightInitialSelection?: boolean
  title: string
}

export default function DropdownFilterField(props: DropdownFilterFieldProps) {
  const { options, title, highlightInitialSelection = false, ...dropdownProps } = props
  const [searchText, setSearchText] = useState('')

  const _selected_opts = options.filter(({ value }) => (props.value ?? []).includes(value))

  const currentSelected = _selected_opts[0]
  const selectedLabel = currentSelected && 'icon' in currentSelected ? currentSelected.icon : currentSelected?.label

  const dropdownButton =
    _selected_opts.length > 0 || highlightInitialSelection ? (
      <PrimaryButton>
        {_selected_opts.length === 1 &&
        selectedLabel &&
        ((typeof selectedLabel === 'string' && selectedLabel.length < 9) || isValidElement(selectedLabel)) ? (
          selectedLabel
        ) : (
          <>
            {title} <div className="num-selected-elements">{_selected_opts.length}</div>
          </>
        )}
        <ArrowDropDown />
      </PrimaryButton>
    ) : (
      <SecondaryButton>
        {title} <ArrowDropDown />
      </SecondaryButton>
    )

  const updatedElements = {
    opts: options.filter(
      o =>
        o.label.toUpperCase().includes(searchText.toUpperCase()) || o.value.toUpperCase().includes(searchText.toUpperCase()),
    ),
    selected: options.filter(
      ({ value }) =>
        _selected_opts.map(({ value }) => value).includes(value) && value.toUpperCase().includes(searchText.toUpperCase()),
    ),
  }

  return (
    <Dropdown
      {...dropdownProps}
      dropdownButton={dropdownButton}
      className="dropdown-filter-field"
      multiple
      position={{ top: 38, bottom: 25 }}
      searchByText={setSearchText}
      pills={[]}
      placeholder={title}
      edit
    >
      {updatedElements.selected.map(selected => (
        <TextOption key={selected.value} value={selected.value} label={selected.label} />
      ))}
      {updatedElements.opts
        .filter(subject => !updatedElements.selected.includes(subject))
        .map(selected => (
          <TextOption key={selected.value} label={selected.label} value={selected.value} />
        ))}
    </Dropdown>
  )
}
