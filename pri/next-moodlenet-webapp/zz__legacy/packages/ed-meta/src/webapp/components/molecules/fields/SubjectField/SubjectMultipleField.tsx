import type { TextOptionProps } from '@moodlenet/component-library'
import { CheckmarkOption, Dropdown, SimplePill } from '@moodlenet/component-library'
import type { FC } from 'react'
import { useEffect, useState } from 'react'

export type SubjectMultipleFieldProps = {
  selections: string[]
  options: TextOptionProps[]
  canEdit: boolean
  shouldShowErrors: boolean
  errors: string[] | string | undefined
  editSubjects(selections: string[]): void
}

export const SubjectMultipleField: FC<SubjectMultipleFieldProps> = ({
  selections,
  options,
  canEdit,
  errors,
  shouldShowErrors,
  editSubjects,
}) => {
  const newSubjects = {
    opts: options,
    selected: options.filter(({ value }) => selections.includes(value)),
  }
  const [updatedSubjects, setUpdatedSubjects] = useState(newSubjects)
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
      opts: newSubjects.opts.filter(
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
  }, [newSubjects.opts, searchText, options, selections])

  const updateSubjects = (subject: string) => {
    console.log('subject ', subject)
    console.log('selections ', selections)
    if (selections.includes(subject)) {
      editSubjects(selections.filter(s => s !== subject))
    } else {
      editSubjects([...selections, subject])
    }
  }

  return canEdit ? (
    <Dropdown
      name="selections"
      multiple
      multilines={true}
      value={selections}
      onChange={e => updateSubjects(e.target.value)}
      label="Subjects"
      placeholder="Content category"
      edit
      highlight={shouldShowErrors && !!errors}
      error={shouldShowErrors && errors}
      position={{ top: 77, bottom: 25 }}
      searchByText={setSearchText}
      pills={
        updatedSubjects.selected &&
        updatedSubjects.selected.map(selected => (
          <SimplePill edit key={selected.value} value={selected.value} label={selected.label} />
        ))
      }
    >
      {updatedSubjects.selected &&
        updatedSubjects.selected.map(selected => (
          <CheckmarkOption key={selected.value} value={selected.value} label={selected.label} />
        ))}
      {updatedSubjects.opts
        .filter(subject => !updatedSubjects.selected.includes(subject))
        .map(selected => (
          <CheckmarkOption key={selected.value} label={selected.label} value={selected.value} />
        ))}
    </Dropdown>
  ) : selections ? (
    <div className="detail subject">
      <div className="title">Subject</div>
      <abbr className="value" title={updatedSubjects.selected[0]?.label}>
        {updatedSubjects.selected[0]?.label}
      </abbr>
    </div>
  ) : null
}

export default SubjectMultipleField
