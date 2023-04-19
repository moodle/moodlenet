import {
  FilterDropdown,
  IconPill,
  IconTextOption,
  IconTextOptionProps,
} from '@moodlenet/component-library'
import { SelectOptions } from '@moodlenet/react-app/ui'
import { useFormik } from 'formik'
import { FC } from 'react'
import './SortBy.scss'

export type SortByProps = {
  license: string
  licenses: SelectOptions<IconTextOptionProps>
  editLicense: (values: { license: string }) => void
  // contentType: 'file' | 'link'
  // canEdit: boolean
  // isEditing: boolean
  // shouldShowErrors: boolean
  // validationSchema: SchemaOf<{ license: string }>
}

export const SortBy: FC<SortByProps> = ({
  license,
  licenses,
  editLicense,
  // canEdit,
  // isEditing,
  // contentType,
  // validationSchema,
  // shouldShowErrors,
}) => {
  const form = useFormik<{ license: string }>({
    initialValues: { license },
    //   validationSchema: validationSchema,
    onSubmit: values => {
      return editLicense(values)
    },
  })

  const licenseDropdown = (
    <FilterDropdown
      name="license"
      className="license-dropdown"
      onChange={form.submitForm}
      value={form.values.license}
      label={`Sort by`}
      edit
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
    </FilterDropdown>
  )

  return licenseDropdown
}
