import type { IconTextOptionProps } from '@moodlenet/component-library'
import { Dropdown, IconPill, IconTextOption } from '@moodlenet/component-library'
import type { FC } from 'react'
import { useEffect, useState } from 'react'

export type LicenseFieldProps = {
  license: string
  licenseOptions: IconTextOptionProps[]
  canEdit: boolean
  error: string | undefined
  shouldShowErrors: boolean
  editLicense: (license: string) => void
  disabled?: boolean
}

export const LicenseField: FC<LicenseFieldProps> = ({
  license,
  licenseOptions,
  canEdit,
  error,
  shouldShowErrors,
  editLicense,
  disabled,
}) => {
  const licenses = {
    opts: licenseOptions,
    selected: licenseOptions.find(({ value }) => value === license),
  }
  const [updatedLicenses, setUpdatedLicenses] = useState(licenses)
  const [searchText, setSearchText] = useState('')

  useEffect(() => {
    setUpdatedLicenses({
      opts: licenseOptions,
      selected: licenseOptions.find(({ value }) => value === license),
    })
  }, [license, licenseOptions])

  useEffect(() => {
    setUpdatedLicenses({
      opts: licenses.opts.filter(
        o =>
          o.label.toUpperCase().includes(searchText.toUpperCase()) ||
          o.value.toUpperCase().includes(searchText.toUpperCase()),
      ),
      selected: licenseOptions.find(
        ({ value }) => value === license && value.toUpperCase().includes(searchText.toUpperCase()),
      ),
    })
  }, [searchText, license, licenses.opts, licenseOptions])

  const licenseDropdown = canEdit ? (
    <Dropdown
      name="license"
      className="license-dropdown"
      onChange={e => {
        e.currentTarget.value !== license && editLicense(e.currentTarget.value)
      }}
      edit
      noBorder
      disabled={disabled}
      value={license}
      label={`License`}
      placeholder="License category"
      searchByText={setSearchText}
      highlight={shouldShowErrors && !!error}
      error={shouldShowErrors && error}
      position={{ top: 50, bottom: 25 }}
      pills={
        updatedLicenses.selected && (
          <IconPill
            key={updatedLicenses.selected.value}
            icon={updatedLicenses.selected.icon}
            abbr={updatedLicenses.selected.label}
          />
        )
      }
    >
      {updatedLicenses.opts.map(({ icon, label, value }) => (
        <IconTextOption icon={icon} label={label} value={value} key={value} abbr={label} />
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
