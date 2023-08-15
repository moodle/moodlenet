import type { TextOptionProps } from '@moodlenet/component-library'
import { Dropdown, SimplePill, TextOption } from '@moodlenet/component-library'
import type { FC } from 'react'
import { useEffect, useState } from 'react'

export type TypeFieldProps = {
  type: string | undefined
  typeOptions: TextOptionProps[]
  canEdit: boolean
  error: string | undefined
  shouldShowErrors: boolean
  editType(type: string): void
}

export const TypeField: FC<TypeFieldProps> = ({
  type,
  typeOptions,
  canEdit,
  error,
  shouldShowErrors,
  editType,
}) => {
  const types = {
    opts: typeOptions,
    selected: typeOptions.find(({ value }) => value === type),
  }
  const [updatedTypes, setUpdatedTypes] = useState(types)
  const [searchText, setSearchText] = useState('')

  useEffect(() => {
    setUpdatedTypes({
      opts: typeOptions,
      selected: typeOptions.find(({ value }) => value === type),
    })
  }, [type, typeOptions])

  useEffect(() => {
    setUpdatedTypes({
      opts: types.opts.filter(o => o.value.toUpperCase().includes(searchText.toUpperCase())),
      selected: typeOptions.find(
        ({ value }) => value === type && value.toUpperCase().includes(searchText.toUpperCase()),
      ),
    })
  }, [searchText, type, typeOptions, types.opts])

  return canEdit ? (
    <Dropdown
      name="type"
      value={type}
      onChange={e => {
        e.currentTarget.value !== type && editType(e.currentTarget.value)
      }}
      label="Type"
      placeholder="Content type"
      edit
      highlight={shouldShowErrors && !!error}
      noShadow
      error={shouldShowErrors && error}
      position={{ top: 50, bottom: 25 }}
      searchByText={setSearchText}
      pills={
        updatedTypes.selected && (
          <SimplePill
            key={updatedTypes.selected.value}
            value={updatedTypes.selected.value}
            label={updatedTypes.selected.label}
          />
        )
      }
    >
      {updatedTypes.selected && (
        <TextOption
          key={updatedTypes.selected.value}
          value={updatedTypes.selected.value}
          label={updatedTypes.selected.label}
        />
      )}
      {updatedTypes.opts.map(
        ({ value, label }) =>
          updatedTypes.selected?.value !== value && (
            <TextOption key={value} value={value} label={label} />
          ),
      )}
    </Dropdown>
  ) : type ? (
    <div className="detail type">
      <div className="title">Type</div>
      <abbr className="value" title={types.selected?.value}>
        {types.selected?.label}
      </abbr>
    </div>
  ) : null
}

export default TypeField
