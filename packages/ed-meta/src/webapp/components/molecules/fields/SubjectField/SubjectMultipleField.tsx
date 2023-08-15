import type { TextOptionProps } from '@moodlenet/component-library'
import { CheckmarkOption, Dropdown, SimplePill } from '@moodlenet/component-library'
import type { FC } from 'react'
import { useEffect, useState } from 'react'

export type SubjectMultipleFieldProps = {
  subjects: string[]
  subjectOptions: TextOptionProps[]
  canEdit: boolean
  shouldShowErrors: boolean
  errors: string[] | string | undefined
  editSubjects(subjects: string[]): void
}

export const SubjectMultipleField: FC<SubjectMultipleFieldProps> = ({
  subjects,
  subjectOptions,
  canEdit,
  errors,
  shouldShowErrors,
  editSubjects,
}) => {
  const newSubjects = {
    opts: subjectOptions,
    selected: subjectOptions.filter(({ value }) => subjects.includes(value)),
  }
  const [updatedSubjects, setUpdatedSubjects] = useState(newSubjects)
  const [searchText, setSearchText] = useState('')

  useEffect(() => {
    const selected = subjectOptions.filter(({ value }) => subjects.includes(value))
    selected &&
      setUpdatedSubjects({
        opts: subjectOptions,
        selected: selected,
      })
  }, [subjectOptions, subjects])

  useEffect(() => {
    setUpdatedSubjects({
      opts: newSubjects.opts.filter(
        o =>
          o.label.toUpperCase().includes(searchText.toUpperCase()) ||
          o.value.toUpperCase().includes(searchText.toUpperCase()),
      ),
      selected: subjectOptions.filter(
        ({ value }) =>
          subjects &&
          subjects.includes(value) &&
          value.toUpperCase().includes(searchText.toUpperCase()),
      ),
    })
  }, [newSubjects.opts, searchText, subjectOptions, subjects])

  const updateSubjects = (subject: string) => {
    console.log('subject ', subject)
    console.log('subjects ', subjects)
    if (subjects.includes(subject)) {
      editSubjects(subjects.filter(s => s !== subject))
    } else {
      editSubjects([...subjects, subject])
    }
  }

  return canEdit ? (
    <Dropdown
      name="subject"
      multiple
      multilines={true}
      value={subjects}
      onChange={e => updateSubjects(e.target.value)}
      label="Subject"
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
      {updatedSubjects.opts.map(
        ({ label, value }) =>
          updatedSubjects.selected &&
          updatedSubjects.selected.map(
            selected =>
              selected?.value !== value && (
                <CheckmarkOption key={value} label={label} value={value} />
              ),
          ),
      )}
    </Dropdown>
  ) : subjects ? (
    <div className="detail subject">
      <div className="title">Subject</div>
      <abbr className="value" title={updatedSubjects.selected[0]?.label}>
        {updatedSubjects.selected[0]?.label}
      </abbr>
    </div>
  ) : null
}

export default SubjectMultipleField
