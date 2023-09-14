import type { DropdownProps, TextOptionProps } from '@moodlenet/component-library'
import { Dropdown, PrimaryButton, SecondaryButton, TextOption } from '@moodlenet/component-library'
import { ArrowDropDown } from '@mui/icons-material'
import type { FC } from 'react'
import { useEffect, useRef, useState } from 'react'
import './DropdownFilterField.scss'

export type DropdownFilterFieldProps = Omit<
  DropdownProps,
  'multiple' | 'value' | 'defaultValue' | 'pills'
> & {
  defaultValue?: string[]
  selection: string[]
  options: TextOptionProps[]
  highlightInitialSelection?: boolean
  title: string
  setselection(selection: string[]): void
}

export const DropdownFilterField: FC<DropdownFilterFieldProps> = props => {
  const {
    options,
    selection,
    setselection,
    title,
    highlightInitialSelection = false,
    ...dropdownProps
  } = props
  const [searchText, setSearchText] = useState('')
  const dropdownRef = useRef<HTMLDivElement>(null)
  const dropdownButtonRef = useRef<HTMLElement>(null)
  const [buttonWidth, setButtonWidth] = useState('initial')

  useEffect(() => {
    dropdownButtonRef.current && setButtonWidth(`${dropdownButtonRef.current.clientWidth}`)
  }, [dropdownButtonRef])

  useEffect(() => {
    const element = dropdownRef.current
    if (element) element.style.width = `${buttonWidth}px`
  }, [buttonWidth, dropdownRef])

  const selectedLabel = options.find(opt => opt.value === selection[0])?.label

  const dropdownButton =
    selection.length > 0 || highlightInitialSelection ? (
      <PrimaryButton innerRef={dropdownButtonRef}>
        {selection.length === 1 && selectedLabel && selectedLabel?.length < 9 ? (
          <>{selectedLabel}</>
        ) : (
          <>
            {title} <div className="num-selected-elements">{selection.length}</div>
          </>
        )}
        <ArrowDropDown />
      </PrimaryButton>
    ) : (
      <SecondaryButton innerRef={dropdownButtonRef}>
        {title} <ArrowDropDown />
      </SecondaryButton>
    )

  const updatedElements = {
    opts: options.filter(
      o =>
        o.label.toUpperCase().includes(searchText.toUpperCase()) ||
        o.value.toUpperCase().includes(searchText.toUpperCase()),
    ),
    selection: options.filter(
      ({ value }) =>
        props.selection.includes(value) && value.toUpperCase().includes(searchText.toUpperCase()),
    ),
  }

  return (
    <Dropdown
      {...dropdownProps}
      divRef={dropdownRef}
      dropdownButton={dropdownButton}
      value={selection}
      className="dropdown-filter-field"
      onChange={e => {
        setselection(
          selection.includes(e.currentTarget.value)
            ? selection.filter(name => e.currentTarget.value !== name)
            : [...selection, e.currentTarget.value],
        )
      }}
      multiple
      position={{ top: 38, bottom: 25 }}
      searchByText={setSearchText}
      pills={[]}
      placeholder={title}
      edit
    >
      {updatedElements.selection.map(selection => (
        <TextOption key={selection.value} value={selection.value} label={selection.label} />
      ))}
      {updatedElements.opts
        .filter(subject => !updatedElements.selection.includes(subject))
        .map(selection => (
          <TextOption key={selection.value} label={selection.label} value={selection.value} />
        ))}
    </Dropdown>
  )
}

DropdownFilterField.defaultProps = {}

export default DropdownFilterField
