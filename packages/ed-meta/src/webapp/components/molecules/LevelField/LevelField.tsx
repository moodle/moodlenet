import { Dropdown, SimplePill, TextOption } from '@moodlenet/component-library'
import type { FC } from 'react'
import { useEffect, useState } from 'react'
import { LevelTextOptionProps } from '../../../../common/MOCK_DATA.js'

export type LevelFieldProps = {
  level: string | undefined
  canEdit: boolean
  error: string | undefined
  shouldShowErrors: boolean
  editLevel(level: string): void
}

export const LevelField: FC<LevelFieldProps> = ({
  level,
  canEdit,
  error,
  shouldShowErrors,
  editLevel,
}) => {
  const levels = {
    opts: LevelTextOptionProps,
    selected: LevelTextOptionProps.find(({ value }) => value === level),
  }
  const [updatedTypes, setUpdatedTypes] = useState(levels)
  const [searchText, setSearchText] = useState('')

  useEffect(() => {
    setUpdatedTypes({
      opts: LevelTextOptionProps,
      selected: LevelTextOptionProps.find(({ value }) => value === level),
    })
  }, [level])

  useEffect(() => {
    setUpdatedTypes({
      opts: levels.opts.filter(o => o.value.toUpperCase().includes(searchText.toUpperCase())),
      selected: LevelTextOptionProps.find(
        ({ value }) => value === level && value.toUpperCase().includes(searchText.toUpperCase()),
      ),
    })
  }, [searchText, level, levels.opts])

  return canEdit ? (
    <Dropdown
      name="level"
      value={level}
      onChange={e => {
        e.currentTarget.value !== level && editLevel(e.currentTarget.value)
      }}
      label="Level"
      placeholder="Education level"
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
  ) : level ? (
    <div className="detail level">
      <div className="title">Level</div>
      <abbr className="value" title={levels.selected?.label}>
        {levels.selected?.label}
      </abbr>
    </div>
  ) : null
}

export default LevelField
