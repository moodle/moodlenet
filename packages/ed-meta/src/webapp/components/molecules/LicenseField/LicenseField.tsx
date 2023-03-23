import {
  Dropdown,
  IconPill,
  IconTextOption,
  IconTextOptionProps,
} from '@moodlenet/component-library'
import { SelectOptions } from '@moodlenet/react-app/ui'
import { useFormik } from 'formik'
import { FC } from 'react'
import { SchemaOf } from 'yup'
import './LicenseField.scss'

export type LicenseFieldProps = {
  license: string
  contentType: 'file' | 'link'
  licenses: SelectOptions<IconTextOptionProps>
  editLicense: (values: { license: string }) => void
  canEdit: boolean
  isEditing: boolean
  shouldShowErrors: boolean
  validationSchema: SchemaOf<{ license: string }>
}

export const LicenseField: FC<LicenseFieldProps> = ({
  license,
  licenses,
  editLicense,
  canEdit,
  isEditing,
  contentType,
  validationSchema,
  shouldShowErrors,
}) => {
  const form = useFormik<{ license: string }>({
    initialValues: { license },
    validationSchema: validationSchema,
    onSubmit: values => {
      return editLicense(values)
    },
  })

  const licenseDropdown = isEditing ? (
    <Dropdown
      name="license"
      className="license-dropdown"
      onChange={form.submitForm}
      value={form.values.license}
      label={`License`}
      edit
      highlight={shouldShowErrors && !!form.errors.license}
      disabled={form.isSubmitting}
      error={form.errors.license}
      position={{ top: 50, bottom: 25 }}
      pills={
        licenses.selected && (
          <IconPill key={licenses.selected.value} icon={licenses.selected.icon} />
        )
      }
    >
      {licenses.opts.map(({ icon, label, value }) => (
        <IconTextOption icon={icon} label={label} value={value} key={value} />
      ))}
    </Dropdown>
  ) : canEdit ? (
    <div className="detail license">
      <div className="title">License</div>
      {licenses.selected && (
        <abbr className="value icons" title={licenses.selected.label}>
          {licenses.selected.icon}
        </abbr>
      )}
    </div>
  ) : null
  return contentType === 'file' ? licenseDropdown : null
}

export default LicenseField
