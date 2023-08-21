import type { TextOptionProps } from '@moodlenet/component-library'
import { CheckmarkOption, Dropdown, SimplePill } from '@moodlenet/component-library'
import type { FC } from 'react'
import { useEffect, useState } from 'react'

export type LevelMultipleFieldProps = {
  selections: string[]
  options: TextOptionProps[]
  canEdit: boolean
  shouldShowErrors: boolean
  errors: string[] | string | undefined
  edit(selections: string[]): void
}

export const LevelMultipleField: FC<LevelMultipleFieldProps> = ({
  selections,
  options,
  canEdit,
  errors,
  shouldShowErrors,
  edit,
}) => {
  const newLevels = {
    opts: options,
    selected: options.filter(({ value }) => selections.includes(value)),
  }
  const [updatedLevels, setUpdatedLevels] = useState(newLevels)
  const [searchText, setSearchText] = useState('')

  useEffect(() => {
    const selected = options.filter(({ value }) => selections.includes(value))
    selected &&
      setUpdatedLevels({
        opts: options,
        selected: selected,
      })
  }, [options, selections])

  useEffect(() => {
    setUpdatedLevels({
      opts: newLevels.opts.filter(
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
  }, [newLevels.opts, searchText, options, selections])

  const updateLevels = (level: string) => {
    console.log('level ', level)
    console.log('selections ', selections)
    if (selections.includes(level)) {
      edit(selections.filter(s => s !== level))
    } else {
      edit([...selections, level])
    }
  }

  return canEdit ? (
    <Dropdown
      name="levels"
      multiple
      multilines={true}
      value={selections}
      onChange={e => updateLevels(e.target.value)}
      label="Levels"
      placeholder="Content category"
      edit
      highlight={shouldShowErrors && !!errors}
      error={shouldShowErrors && errors}
      position={{ top: 77, bottom: 25 }}
      searchByText={setSearchText}
      pills={
        updatedLevels.selected &&
        updatedLevels.selected.map(selected => (
          <SimplePill edit key={selected.value} value={selected.value} label={selected.label} />
        ))
      }
    >
      {updatedLevels.selected &&
        updatedLevels.selected.map(selected => (
          <CheckmarkOption key={selected.value} value={selected.value} label={selected.label} />
        ))}
      {updatedLevels.opts.map(
        ({ label, value }) =>
          updatedLevels.selected &&
          updatedLevels.selected.map(
            selected =>
              selected?.value !== value && (
                <CheckmarkOption key={value} label={label} value={value} />
              ),
          ),
      )}
    </Dropdown>
  ) : selections ? (
    <div className="detail level">
      <div className="title">Level</div>
      <abbr className="value" title={updatedLevels.selected[0]?.label}>
        {updatedLevels.selected[0]?.label}
      </abbr>
    </div>
  ) : null
}

export default LevelMultipleField
