import { Dropdown, IconPill, IconTextOption } from '@moodlenet/component-library'
import { useFormik } from 'formik'
import { FC, useEffect, useState } from 'react'
import { LicenseIconTextOptionProps } from '../../../../common/data.js'
import { licenseValidationSchema } from '../../../../common/validationSchema.js'
import './LicenseField.scss'

export type LicenseFieldProps = {
  license: string
  canEdit: boolean
  shouldShowErrors: boolean
  editLicense: (license: string) => void
}

export const LicenseField: FC<LicenseFieldProps> = ({
  license,
  canEdit,
  shouldShowErrors,
  editLicense,
}) => {
  const form = useFormik<{ license: string }>({
    initialValues: { license },
    validationSchema: licenseValidationSchema,
    onSubmit: values => {
      return editLicense(values.license)
    },
  })

  const licenses = {
    opts: LicenseIconTextOptionProps,
    selected: LicenseIconTextOptionProps.find(({ value }) => value === license),
  }
  const [updatedLicenses, setUpdatedLicenses] = useState(licenses)
  const [searchText, setSearchText] = useState('')

  useEffect(() => {
    setUpdatedLicenses({
      opts: LicenseIconTextOptionProps,
      selected: LicenseIconTextOptionProps.find(({ value }) => value === license),
    })
  }, [license])

  useEffect(() => {
    setUpdatedLicenses({
      opts: licenses.opts.filter(
        o =>
          o.label.toUpperCase().includes(searchText.toUpperCase()) ||
          o.value.toUpperCase().includes(searchText.toUpperCase()),
      ),
      selected: LicenseIconTextOptionProps.find(
        ({ value }) => value === license && value.toUpperCase().includes(searchText.toUpperCase()),
      ),
    })
  }, [searchText, license, licenses.opts])

  // const filterLicenses = (text: string) => {
  //   setUpdatedLicenses({
  //     opts: licenses.opts.filter(
  //       o =>
  //         o.label.toUpperCase().includes(text.toUpperCase()) ||
  //         o.value.toUpperCase().includes(text.toUpperCase()),
  //     ),
  //     selected: LicenseIconTextOptionProps.find(({ value }) => value === license),
  //   })
  // }

  const licenseDropdown = canEdit ? (
    <Dropdown
      name="license"
      className="license-dropdown"
      onChange={e => {
        e.currentTarget.value !== license && editLicense(e.currentTarget.value)
      }}
      edit
      value={license}
      label={`License`}
      placeholder="License category"
      searchByText={setSearchText}
      highlight={shouldShowErrors && !!form.errors.license}
      error={form.errors.license}
      position={{ top: 50, bottom: 25 }}
      pills={
        updatedLicenses.selected && (
          <IconPill key={updatedLicenses.selected.value} icon={updatedLicenses.selected.icon} />
        )
      }
    >
      {updatedLicenses.opts.map(({ icon, label, value }) => (
        <IconTextOption icon={icon} label={label} value={value} key={value} />
      ))}
    </Dropdown>
  ) : license ? (
    <div className="detail license">
      <div className="title">License</div>
      {licenses.selected && (
        <abbr className="value icons" title={licenses.selected.label}>
          {licenses.selected.icon}
        </abbr>
      )}
    </div>
  ) : null
  return licenseDropdown
}

export default LicenseField
