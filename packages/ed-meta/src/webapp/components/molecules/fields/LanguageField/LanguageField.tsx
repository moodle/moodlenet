import type { TextOptionProps } from '@moodlenet/component-library'
import { Dropdown, SimplePill, TextOption } from '@moodlenet/component-library'
import type { FC } from 'react'
import { useEffect, useState } from 'react'

export type LanguageFieldProps = {
  language: string | undefined
  languageOptions: TextOptionProps[]
  canEdit: boolean
  error: string | undefined
  shouldShowErrors: boolean
  editLanguage(language: string): void
}

export const LanguageField: FC<LanguageFieldProps> = ({
  language,
  languageOptions,
  canEdit,
  error,
  shouldShowErrors,
  editLanguage,
}) => {
  const languages = {
    opts: languageOptions,
    selected: languageOptions.find(({ value }) => value === language),
  }
  const [updatedTypes, setUpdatedTypes] = useState(languages)
  const [searchText, setSearchText] = useState('')

  useEffect(() => {
    setUpdatedTypes({
      opts: languageOptions,
      selected: languageOptions.find(({ value }) => value === language),
    })
  }, [language, languageOptions])

  useEffect(() => {
    setUpdatedTypes({
      opts: languages.opts.filter(o => o.value.toUpperCase().includes(searchText.toUpperCase())),
      selected: languageOptions.find(
        ({ value }) => value === language && value.toUpperCase().includes(searchText.toUpperCase()),
      ),
    })
  }, [searchText, language, languages.opts, languageOptions])

  return canEdit ? (
    <Dropdown
      name="language"
      value={language}
      onChange={e => {
        e.currentTarget.value !== language && editLanguage(e.currentTarget.value)
      }}
      label="Language"
      placeholder="Content language"
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
  ) : language ? (
    <div className="detail language">
      <div className="title">Language</div>
      <abbr className="value" title={languages.selected?.label}>
        {languages.selected?.label}
      </abbr>
    </div>
  ) : null
}

export default LanguageField
