import type { TextOptionProps } from '@moodlenet/component-library'
import { CheckmarkOption, Dropdown, SimplePill } from '@moodlenet/component-library'
import type { FC } from 'react'
import { useEffect, useState } from 'react'

export type LanguageMultipleFieldProps = {
  selections: string[]
  options: TextOptionProps[]
  canEdit: boolean
  shouldShowErrors: boolean
  errors: string[] | string | undefined
  edit(selections: string[]): void
}

export const LanguageMultipleField: FC<LanguageMultipleFieldProps> = ({
  selections,
  options,
  canEdit,
  errors,
  shouldShowErrors,
  edit,
}) => {
  const newLanguages = {
    opts: options,
    selected: options.filter(({ value }) => selections.includes(value)),
  }
  const [updatedLanguages, setUpdatedLanguages] = useState(newLanguages)
  const [searchText, setSearchText] = useState('')

  useEffect(() => {
    const selected = options.filter(({ value }) => selections.includes(value))
    selected &&
      setUpdatedLanguages({
        opts: options,
        selected: selected,
      })
  }, [options, selections])

  useEffect(() => {
    setUpdatedLanguages({
      opts: newLanguages.opts.filter(
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
  }, [newLanguages.opts, searchText, options, selections])

  const updateLanguages = (language: string) => {
    console.log('language ', language)
    console.log('selections ', selections)
    if (selections.includes(language)) {
      edit(selections.filter(s => s !== language))
    } else {
      edit([...selections, language])
    }
  }

  return canEdit ? (
    <Dropdown
      name="language"
      multiple
      multilines={true}
      value={selections}
      onChange={e => updateLanguages(e.target.value)}
      label="Languages"
      placeholder="Content category"
      edit
      highlight={shouldShowErrors && !!errors}
      error={shouldShowErrors && errors}
      position={{ top: 77, bottom: 25 }}
      searchByText={setSearchText}
      pills={
        updatedLanguages.selected &&
        updatedLanguages.selected.map(selected => (
          <SimplePill edit key={selected.value} value={selected.value} label={selected.label} />
        ))
      }
    >
      {updatedLanguages.selected &&
        updatedLanguages.selected.map(selected => (
          <CheckmarkOption key={selected.value} value={selected.value} label={selected.label} />
        ))}
      {updatedLanguages.opts.map(
        ({ label, value }) =>
          updatedLanguages.selected &&
          updatedLanguages.selected.map(
            selected =>
              selected?.value !== value && (
                <CheckmarkOption key={value} label={label} value={value} />
              ),
          ),
      )}
    </Dropdown>
  ) : selections ? (
    <div className="detail language">
      <div className="title">Language</div>
      <abbr className="value" title={updatedLanguages.selected[0]?.label}>
        {updatedLanguages.selected[0]?.label}
      </abbr>
    </div>
  ) : null
}

export default LanguageMultipleField
