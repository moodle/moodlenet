import type { TextOptionProps } from '@moodlenet/component-library'
import { Dropdown, SimplePill, TextOption } from '@moodlenet/component-library'
import type { FC } from 'react'
import { useEffect, useState } from 'react'

export type DropdownFieldProps = {
  selection: string | undefined
  options: TextOptionProps[]
  title: string
  placeholder: string
  canEdit: boolean
  error: string | undefined
  shouldShowErrors: boolean
  edit(selection: string): void
  noBorder?: boolean
}

export const DropdownField: FC<DropdownFieldProps> = ({
  selection,
  options,
  title,
  placeholder,
  canEdit,
  error,
  shouldShowErrors,
  edit,
  noBorder,
}) => {
  const elements = {
    opts: options,
    selected: options.find(({ value }) => value === selection),
  }
  const [updatedElements, setUpdatedElements] = useState(elements)
  const [searchText, setSearchText] = useState('')

  useEffect(() => {
    setUpdatedElements({
      opts: options,
      selected: options.find(({ value }) => value === selection),
    })
  }, [selection, options])

  useEffect(() => {
    setUpdatedElements({
      opts: elements.opts.filter(o => o.value.toUpperCase().includes(searchText.toUpperCase())),
      selected: options.find(
        ({ value }) =>
          value === selection && value.toUpperCase().includes(searchText.toUpperCase()),
      ),
    })
  }, [searchText, selection, elements.opts, options])

  return canEdit ? (
    <Dropdown
      name={title}
      value={selection}
      onChange={e => {
        e.currentTarget.value !== selection && edit(e.currentTarget.value)
      }}
      label={title}
      placeholder={placeholder}
      noBorder={noBorder}
      edit
      highlight={shouldShowErrors && !!error}
      error={shouldShowErrors && error}
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
          updatedElements.selected?.value !== value && (
            <TextOption key={value} value={value} label={label} />
          ),
      )}
    </Dropdown>
  ) : selection ? (
    <div className="detail selection">
      <div className="title">{title}</div>
      <abbr className="value" title={elements.selected?.label}>
        {elements.selected?.label}
      </abbr>
    </div>
  ) : null
}

DropdownField.defaultProps = {
  noBorder: true,
}

export default DropdownField
