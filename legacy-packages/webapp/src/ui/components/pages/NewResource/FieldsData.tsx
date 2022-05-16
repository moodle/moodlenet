import { ReactComponent as ByIcon } from '../../../static/icons/license/by.svg'
import { ReactComponent as CcIcon } from '../../../static/icons/license/cc.svg'
import { ReactComponent as NcIcon } from '../../../static/icons/license/nc.svg'
import { ReactComponent as NdIcon } from '../../../static/icons/license/nd.svg'
import { ReactComponent as SaIcon } from '../../../static/icons/license/sa.svg'
import { ReactComponent as ZeroIcon } from '../../../static/icons/license/zero.svg'

export const by = <ByIcon style={{ width: '20px' }} />
export const zero = <ZeroIcon style={{ width: '20px' }} />
export const nc = <NcIcon style={{ width: '20px' }} />
export const nd = <NdIcon style={{ width: '20px' }} />
export const sa = <SaIcon style={{ width: '20px' }} />
export const cc = <CcIcon style={{ width: '20px' }} />

export const getYearList = (startYear: number): string[] => {
  const currentYear = new Date().getFullYear()
  const years = []
  while (startYear <= currentYear) {
    years.push((startYear++).toString())
  }
  return years.reverse()
}

export const yearList = getYearList(1750)

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
  by: (
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
