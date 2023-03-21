import { Dropdown, SimplePill, TextOption, TextOptionProps } from '@moodlenet/component-library'
import { SelectOptions } from '@moodlenet/react-app/ui'
import { useFormik } from 'formik'
import { FC } from 'react'
import { SchemaOf } from 'yup'
import './SubjectField.scss'

export type SubjectFieldProps = {
  subject: string
  subjects: SelectOptions<TextOptionProps>
  editSubject: (values: { subject: string }) => void
  isSubmitting: boolean
  canEdit: boolean
  isEditing: boolean
  shouldShowErrors: boolean
  validationSchema: SchemaOf<{ subject: string }>
  setCategoryFilter(text: string): unknown
}

export const SubjectField: FC<SubjectFieldProps> = ({
  subject,
  subjects,
  isSubmitting,
  editSubject,
  canEdit,
  isEditing,
  validationSchema,
  shouldShowErrors,
}) => {
  const form = useFormik<{ subject: string }>({
    initialValues: { subject: subject },
    validationSchema: validationSchema,
    onSubmit: values => {
      return editSubject(values)
    },
  })
  return isEditing ? (
    <Dropdown
      name="subject"
      value={form.values.subject}
      onChange={e => editSubject({ subject: e.target.value })}
      label="Subject"
      disabled={isSubmitting}
      edit={isEditing}
      highlight={shouldShowErrors && !!form.errors.subject}
      error={form.errors.subject}
      position={{ top: 50, bottom: 25 }}
      // searchByText={setCategoryFilter}
      pills={
        subjects.selected && (
          <SimplePill
            key={subjects.selected.value}
            value={subjects.selected.value}
            label={subjects.selected.label}
          />
        )
      }
    >
      {subjects.selected && (
        <TextOption
          key={subjects.selected.value}
          value={subjects.selected.value}
          label={subjects.selected.label}
        />
      )}
      {subjects.opts.map(
        ({ label, value }) =>
          subjects.selected?.value !== value && (
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
