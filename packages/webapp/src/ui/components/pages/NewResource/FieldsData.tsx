import { t } from '@lingui/macro'
import { ReactComponent as ByIcon } from '../../../static/icons/license/by.svg'
import { ReactComponent as NcIcon } from '../../../static/icons/license/nc.svg'
import { ReactComponent as NdIcon } from '../../../static/icons/license/nd.svg'
import { ReactComponent as SaIcon } from '../../../static/icons/license/sa.svg'
import { ReactComponent as ZeroIcon } from '../../../static/icons/license/zero.svg'

export type DropdownField = {
  label?: string
  options: DropdownOptionsType
  placeholder?: string
}

export type Visibility = 'Public' | 'Private'

export const LevelDropdown: DropdownField = {
  label: t`Level`,
  placeholder: t`Educational level`,
  options: [
    t`0.1 Early childhood educational development`,
    t`0.2 Pre-primary education`,
    t`1 Primary education`,
    t`2 Lower secondary education`,
    t`3 Upper secondary education`,
    t`4 Post-secondary non-tertiary education`,
    t`5 Short-cycle tertiary education`,
    t`6 Bachelor or equivalent`,
    t`7 Master or equivalent`,
    t`8 Doctoral or equivalent`,
  ],
}

export const FormatDropdown: DropdownField = {
  label: t`Format`,
  placeholder: t`Content Format`,
  options: [
    t`0.1 Early childhood educational development`,
    t`0.2 Pre-primary education`,
    t`1 Primary education`,
    t`2 Lower secondary education`,
    t`3 Upper secondary education`,
    t`4 Post-secondary non-tertiary education`,
    t`5 Short-cycle tertiary education`,
    t`6 Bachelor or equivalent`,
    t`7 Master or equivalent`,
    t`8 Doctoral or equivalent`,
  ],
}

export const MonthDropdown: DropdownField = {
  placeholder: t`Month`,
  options: [
    t`January`,
    t`February`,
    t`March`,
    t`April`,
    t`May`,
    t`June`,
    t`July`,
    t`August`,
    t`September`,
    t`October`,
    t`November`,
    t`December`,
  ],
}

const getYearList = (startYear: number): string[] => {
  const currentYear = new Date().getFullYear()
  const years = []
  while (startYear <= currentYear) {
    years.push((startYear++).toString())
  }
  return years.reverse()
}

export const YearsDropdown: DropdownField = {
  label: t``,
  placeholder: t`Year`,
  options: getYearList(1750),
}

export const TypeDropdown: DropdownField = {
  label: t`Type`,
  placeholder: t`Content Type`,
  options: [
    t`0.1 Early childhood educational development`,
    t`0.2 Pre-primary education`,
    t`1 Primary education`,
    t`2 Lower secondary education`,
    t`3 Upper secondary education`,
    t`4 Post-secondary non-tertiary education`,
    t`5 Short-cycle tertiary education`,
    t`6 Bachelor or equivalent`,
    t`7 Master or equivalent`,
    t`8 Doctoral or equivalent`,
  ],
}

export const LanguagesDropdown: DropdownField = {
  label: t`Languages`,
  placeholder: t`Content Language`,
  options: [
    t`0.1 Early childhood educational development`,
    t`0.2 Pre-primary education`,
    t`1 Primary education`,
    t`2 Lower secondary education`,
    t`3 Upper secondary education`,
    t`4 Post-secondary non-tertiary education`,
    t`5 Short-cycle tertiary education`,
    t`6 Bachelor or equivalent`,
    t`7 Master or equivalent`,
    t`8 Doctoral or equivalent`,
  ],
}

const by = <ByIcon style={{ width: '20px' }} />
const zero = <ZeroIcon style={{ width: '20px' }} />
const nc = <NcIcon style={{ width: '20px' }} />
const nd = <NdIcon style={{ width: '20px' }} />
const sa = <SaIcon style={{ width: '20px' }} />

export const licenseIconMap = {
  by,
  zero,
  '0': zero,
  nc,
  nd,
  sa,
}
export type LicenseTypes = keyof typeof licenseIconMap

export type LicenseNodeKey = keyof typeof LicenseNodes
export const LicenseNodes = {
  0: <div>{zero}</div>,
  by: (
    <div>
      {zero}
      {by}
    </div>
  ),
  'by-sa': (
    <div>
      {zero}
      {by}
      {sa}
    </div>
  ),
  'by-nc': (
    <div>
      {zero}
      {by}
      {nc}
    </div>
  ),
  'by-nc-sa': (
    <div>
      {zero}
      {by}
      {nc}
      {sa}
    </div>
  ),
  'by-nd': (
    <div>
      {zero}
      {by}
      {nd}
    </div>
  ),
  'by-nc-nd': (
    <div>
      {zero}
      {by}
      {nc}
      {nd}
    </div>
  ),
}
