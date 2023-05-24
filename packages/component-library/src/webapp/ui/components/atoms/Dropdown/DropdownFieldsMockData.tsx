import { ReactComponent as ByIcon } from '../../../assets/icons/license/by.svg'
import { ReactComponent as CcIcon } from '../../../assets/icons/license/cc.svg'
import { ReactComponent as NcIcon } from '../../../assets/icons/license/nc.svg'
import { ReactComponent as NdIcon } from '../../../assets/icons/license/nd.svg'
import { ReactComponent as SaIcon } from '../../../assets/icons/license/sa.svg'
import { ReactComponent as ZeroIcon } from '../../../assets/icons/license/zero.svg'
import { getYearList } from '../../../helpers/utilities.js'
import type { TextOptionProps } from './Dropdown.js'

export const by = <ByIcon style={{ width: '20px' }} />
export const zero = <ZeroIcon style={{ width: '20px' }} />
export const nc = <NcIcon style={{ width: '20px' }} />
export const nd = <NdIcon style={{ width: '20px' }} />
export const sa = <SaIcon style={{ width: '20px' }} />
export const cc = <CcIcon style={{ width: '20px' }} />

export const MonthTextOptionProps: TextOptionProps[] = [
  { value: `0`, label: /* t */ `January` },
  { value: `1`, label: /* t */ `February` },
  { value: `2`, label: /* t */ `March` },
  { value: `3`, label: /* t */ `April` },
  { value: `4`, label: /* t */ `May` },
  { value: `5`, label: /* t */ `June` },
  { value: `6`, label: /* t */ `July` },
  { value: `7`, label: /* t */ `August` },
  { value: `8`, label: /* t */ `September` },
  { value: `9`, label: /* t */ `October` },
  { value: `10`, label: /* t */ `November` },
  { value: `11`, label: /* t */ `December` },
]
export const YearsProps: string[] = getYearList(1750)

export const TypeTextOptionProps: TextOptionProps[] = [
  { value: '1', label: `type 1` },
  { value: '2', label: `type 2` },
  { value: '3', label: `type 3` },
  { value: '4', label: `type 4` },
  { value: '5', label: `type 5` },
  { value: '6', label: `type 6` },
  { value: '7', label: `type 7` },
  { value: '8', label: `type 8` },
]

export const LevelTextOptionProps: TextOptionProps[] = [
  { value: '0.1', label: /* t */ `Early childhood educational development` },
  { value: '0.2', label: /* t */ `Pre-primary education` },
  { value: '1', label: /* t */ `Primary education` },
  { value: '2', label: /* t */ `Lower secondary education` },
  { value: '3', label: /* t */ `Upper secondary education` },
  { value: '4', label: /* t */ `Post-secondary non-tertiary education` },
  { value: '5', label: /* t */ `Short-cycle tertiary education` },
  { value: '6', label: /* t */ `Bachelor or equivalent` },
  { value: '7', label: /* t */ `Master or equivalent` },
  { value: '8', label: /* t */ `Doctoral or equivalent` },
]

export const LanguagesTextOptionProps: TextOptionProps[] = [
  { value: 'English', label: /* t */ `English` },
  { value: 'Italian', label: /* t */ `Italian` },
  { value: 'Greek', label: /* t */ `Greek` },
  { value: 'German', label: /* t */ `German` },
]

export const licenseIconMap = {
  by,
  zero,
  '0': zero,
  nc,
  cc,
  nd,
  sa,
}
export type LicenseTypes = keyof typeof licenseIconMap

export type LicenseNodeKey = keyof typeof LicenseNodes
export const LicenseNodes = {
  0: (
    <div>
      {cc}
      {zero}
    </div>
  ),
  'by': (
    <div>
      {cc}
      {by}
    </div>
  ),
  'by-sa': (
    <div>
      {cc}
      {by}
      {sa}
    </div>
  ),
  'by-nc': (
    <div>
      {cc}
      {by}
      {nc}
    </div>
  ),
  'by-nc-sa': (
    <div>
      {cc}
      {by}
      {nc}
      {sa}
    </div>
  ),
  'by-nd': (
    <div>
      {cc}
      {by}
      {nd}
    </div>
  ),
  'by-nc-nd': (
    <div>
      {cc}
      {by}
      {nc}
      {nd}
    </div>
  ),
}
