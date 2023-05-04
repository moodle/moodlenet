import { Dropdown, SimplePill, TextOption } from '@moodlenet/component-library'
import type { FC } from 'react'
import { useEffect, useState } from 'react'
import { SubjectsTextOptionProps } from '../../../../common/data.js'

export type SubjectFieldProps = {
  subject: string
  canEdit: boolean
  shouldShowErrors: boolean
  error: string | undefined
  editSubject(subject: string): void
}

export const SubjectField: FC<SubjectFieldProps> = ({
  subject,
  canEdit,
  error,
  shouldShowErrors,
  editSubject,
}) => {
  const subjects = {
    opts: SubjectsTextOptionProps,
    selected: SubjectsTextOptionProps.find(({ value }) => value === subject),
  }
  const [updatedSubjects, setUpdatedSubjects] = useState(subjects)
  const [searchText, setSearchText] = useState('')

  useEffect(() => {
    setUpdatedSubjects({
      opts: SubjectsTextOptionProps,
      selected: SubjectsTextOptionProps.find(({ value }) => value === subject),
    })
  }, [subject])

  useEffect(() => {
    setUpdatedSubjects({
      opts: subjects.opts.filter(
        o =>
          o.label.toUpperCase().includes(searchText.toUpperCase()) ||
          o.value.toUpperCase().includes(searchText.toUpperCase()),
      ),
      selected: SubjectsTextOptionProps.find(
        ({ value }) => value === subject && value.toUpperCase().includes(searchText.toUpperCase()),
      ),
    })
  }, [searchText, subject, subjects.opts])

  return canEdit ? (
    <Dropdown
      name="subject"
      value={subject}
      onChange={e => {
        e.currentTarget.value !== subject && editSubject(e.currentTarget.value)
      }}
      label="Subject"
      placeholder="Content category"
      edit
      highlight={shouldShowErrors && !!error}
      error={error}
      position={{ top: 50, bottom: 25 }}
      searchByText={setSearchText}
      pills={
        updatedSubjects.selected && (
          <SimplePill
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
  ) : subject ? (
    <div className="detail subject">
      <div className="title">Subject</div>
      <abbr className="value" title={subjects.selected?.label}>
        {subjects.selected?.label}
      </abbr>
    </div>
  ) : null
}

export default SubjectField
