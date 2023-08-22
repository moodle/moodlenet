import type { FC } from 'react'
import { useEffect, useState } from 'react'
import { toKebabCase } from '../../../../../../common.mjs'
import type { TextOptionProps } from '../Dropdown.js'
import { CheckmarkOption, Dropdown, SimplePill } from '../Dropdown.js'

export type MultipeSelectDropdownProps = {
  selections: string[]
  options: TextOptionProps[]
  canEdit: boolean
  edit?: boolean
  label: string
  className?: string
  placeholder?: string
  shouldShowErrors?: boolean
  errors: string[] | string | undefined
  setData(selections: string[]): void
}

export const MultipeSelectDropdown: FC<MultipeSelectDropdownProps> = ({
  selections,
  options,
  label,
  edit,
  className,
  placeholder,
  canEdit,
  errors,
  shouldShowErrors,
  setData,
}) => {
  const elements = {
    opts: options,
    selected: options.filter(({ value }) => selections.includes(value)),
  }
  const [updatedElements, setUpdatedSubjects] = useState(elements)
  const [searchText, setSearchText] = useState('')

  useEffect(() => {
    const selected = options.filter(({ value }) => selections.includes(value))
    selected &&
      setUpdatedSubjects({
        opts: options,
        selected: selected,
      })
  }, [options, selections])

  useEffect(() => {
    setUpdatedSubjects({
      opts: elements.opts.filter(
        o =>
          o.label.toUpperCase().includes(searchText.toUpperCase()) ||
          o.value.toUpperCase().includes(searchText.toUpperCase()),
      ),
      selected: options.filter(
        ({ value }) =>
          selections &&
          selections.includes(value) &&
          value.toUpperCase().includes(searchText.toUpperCase()),
      ),
    })
  }, [elements.opts, searchText, options, selections])

  const updateSubjects = (subject: string) => {
    console.log('subject ', subject)
    console.log('selections ', selections)
    if (selections.includes(subject)) {
      setData(selections.filter(s => s !== subject))
    } else {
      setData([...selections, subject])
    }
  }

  return canEdit ? (
    <Dropdown
      name={`multiple-select-dropdown ${className ?? toKebabCase(label)}`}
      multiple
      multilines={true}
      value={selections}
      onChange={e => updateSubjects(e.target.value)}
      label={label}
      placeholder={placeholder}
      edit={edit}
      highlight={shouldShowErrors && !!errors}
      error={shouldShowErrors && errors}
      position={{ top: 77, bottom: 25 }}
      searchByText={setSearchText}
      pills={
        // updatedElements.selected &&
        updatedElements.selected.map(selected => (
          <SimplePill edit key={selected.value} value={selected.value} label={selected.label} />
        ))
      }
    >
      {
        // updatedElements.selected &&
        updatedElements.selected.map(selected => (
          <CheckmarkOption key={selected.value} value={selected.value} label={selected.label} />
        ))
      }
      {updatedElements.opts
        .filter(subject => !updatedElements.selected.includes(subject))
        .map(selected => (
          <CheckmarkOption key={selected.value} label={selected.label} value={selected.value} />
        ))}
    </Dropdown>
  ) : selections ? (
    <div className="detail subject">
      <div className="label">{label}</div>
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
