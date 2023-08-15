import type { TextOptionProps } from '@moodlenet/component-library'
import { Dropdown, SimplePill, TextOption } from '@moodlenet/component-library'
import type { FC } from 'react'
import { useEffect, useState } from 'react'

export type SubjectMultipleFieldProps = {
  subjects: string[]
  subjectOptions: TextOptionProps[]
  canEdit: boolean
  shouldShowErrors: boolean
  error: string | undefined
  editSubject(subject: string): void
}

export const SubjectMultipleField: FC<SubjectMultipleFieldProps> = ({
  subjects,
  subjectOptions,
  canEdit,
  error,
  shouldShowErrors,
  editSubject,
}) => {
  const newSubjects = {
    opts: subjectOptions,
    selected: subjectOptions.find(({ value }) => subjects.includes(value)),
  }
  const [updatedSubjects, setUpdatedSubjects] = useState(newSubjects)
  const [searchText, setSearchText] = useState('')

  useEffect(() => {
    setUpdatedSubjects({
      opts: subjectOptions,
      selected: subjectOptions.find(({ value }) => subjects.includes(value)),
    })
  }, [subjectOptions, subjects])

  useEffect(() => {
    setUpdatedSubjects({
      opts: newSubjects.opts.filter(
        o =>
          o.label.toUpperCase().includes(searchText.toUpperCase()) ||
          o.value.toUpperCase().includes(searchText.toUpperCase()),
      ),
      selected: subjectOptions.find(
        ({ value }) =>
          subjects.includes(value) && value.toUpperCase().includes(searchText.toUpperCase()),
      ),
    })
  }, [newSubjects.opts, searchText, subjectOptions, subjects])

  return canEdit ? (
    <Dropdown
      name="subject"
      multiple
      // onItemSelect={(value: string)=> console.log(value)}
      // onItemDeselect={(value: string)=> console.log(value)}
      multilines={true}
      value={subjects}
      onChange={e => {
        !subjects.includes(e.currentTarget.value) && editSubject(e.currentTarget.value)
      }}
      label="Subject"
      placeholder="Content category"
      edit
      highlight={shouldShowErrors && !!error}
      error={shouldShowErrors && error}
      position={{ top: 50, bottom: 25 }}
      searchByText={setSearchText}
      pills={
        updatedSubjects.selected && (
          <SimplePill
            edit
            key={updatedSubjects.selected.value}
            value={updatedSubjects.selected.value}
            label={updatedSubjects.selected.label}
          />
        )
      }
    >
      {updatedSubjects.selected && (
        <TextOption
          key={updatedSubjects.selected.value}
          value={updatedSubjects.selected.value}
          label={updatedSubjects.selected.label}
        />
      )}
      {updatedSubjects.opts.map(
        ({ label, value }) =>
          updatedSubjects.selected?.value !== value && (
            <TextOption key={value} label={label} value={value} />
          ),
      )}
    </Dropdown>
  ) : subjects ? (
    <div className="detail subject">
      <div className="title">Subject</div>
      <abbr className="value" title={updatedSubjects.selected?.label}>
        {updatedSubjects.selected?.label}
      </abbr>
    </div>
  ) : null
}

export default SubjectMultipleField
