import { Dropdown, SimplePill, TextOption } from '@moodlenet/component-library'
import { useFormik } from 'formik'
import { FC, useState } from 'react'
import { SubjectsTextOptionProps } from '../../../../common/data.js'
import { subjectValidationSchema } from '../../../../common/validationSchema.js'
import './SubjectField.scss'

export type SubjectFieldProps = {
  subject: string
  canEdit: boolean
  shouldShowErrors: boolean
  editSubject(subject: string): void
}

export const SubjectField: FC<SubjectFieldProps> = ({
  subject,
  canEdit,
  shouldShowErrors,
  editSubject,
}) => {
  const subjects = {
    opts: SubjectsTextOptionProps,
    selected: SubjectsTextOptionProps.find(({ value }) => value === subject),
  }
  const [updatedSubjects, setUpdatedSubjects] = useState(subjects)

  const form = useFormik<{ subject: string }>({
    initialValues: { subject: subject },
    validationSchema: subjectValidationSchema,
    onSubmit: values => {
      return editSubject(values.subject)
    },
  })

  const filterSubjects = (text: string) => {
    setUpdatedSubjects({
      opts: subjects.opts.filter(
        o =>
          o.label.toUpperCase().includes(text.toUpperCase()) ||
          o.value.toUpperCase().includes(text.toUpperCase()),
      ),
      selected: SubjectsTextOptionProps.find(({ value }) => value === subject),
    })
  }

  return canEdit ? (
    <Dropdown
      name="subject"
      value={subject}
      onChange={e => {
        e.currentTarget.value !== subject && editSubject(e.currentTarget.value)
      }}
      label="Subject"
      placeholder="Content category"
      edit={true}
      highlight={shouldShowErrors && !!form.errors.subject}
      error={form.errors.subject}
      position={{ top: 50, bottom: 25 }}
      searchByText={filterSubjects}
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
  ) : canEdit ? (
    <div className="detail subject">
      <div className="title">Subject</div>
      <abbr className="value">
        Films and nature
        {/* {subjects.selected?.label} */}
      </abbr>
    </div>
  ) : null
}

export default SubjectField
