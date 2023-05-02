import { Dropdown, SimplePill, SimpleTextOption } from '@moodlenet/component-library'
import { FC, useEffect, useState } from 'react'
import { TypeSimpleTextOptionProps } from '../../../../common/data.js'

export type TypeFieldProps = {
  type: string | undefined
  canEdit: boolean
  error: string | undefined
  shouldShowErrors: boolean
  editType(type: string): void
}

export const TypeField: FC<TypeFieldProps> = ({
  type,
  canEdit,
  error,
  shouldShowErrors,
  editType,
}) => {
  const types = {
    opts: TypeSimpleTextOptionProps,
    selected: TypeSimpleTextOptionProps.find(({ value }) => value === type),
  }
  const [updatedTypes, setUpdatedTypes] = useState(types)
  const [searchText, setSearchText] = useState('')

  useEffect(() => {
    setUpdatedTypes({
      opts: TypeSimpleTextOptionProps,
      selected: TypeSimpleTextOptionProps.find(({ value }) => value === type),
    })
  }, [type])

  useEffect(() => {
    setUpdatedTypes({
      opts: types.opts.filter(o => o.value.toUpperCase().includes(searchText.toUpperCase())),
      selected: TypeSimpleTextOptionProps.find(
        ({ value }) => value === type && value.toUpperCase().includes(searchText.toUpperCase()),
      ),
    })
  }, [searchText, type, types.opts])

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
      error={error}
      position={{ top: 50, bottom: 25 }}
      searchByText={setSearchText}
      pills={
        updatedTypes.selected && (
          <SimplePill
            key={updatedTypes.selected.value}
            value={updatedTypes.selected.value}
            label={updatedTypes.selected.value}
          />
        )
      }
    >
      {updatedTypes.selected && (
        <SimpleTextOption key={updatedTypes.selected.value} value={updatedTypes.selected.value} />
      )}
      {updatedTypes.opts.map(
        ({ value }) =>
          updatedTypes.selected?.value !== value && <SimpleTextOption key={value} value={value} />,
      )}
    </Dropdown>
  ) : type ? (
    <div className="detail type">
      <div className="title">Type</div>
      <abbr className="value">{types.selected?.value}</abbr>
    </div>
  ) : null
}

export default TypeField
