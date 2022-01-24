import VisibilityIcon from '@material-ui/icons/Visibility'
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff'
import { ReactComponent as ByIcon } from '../../../static/icons/license/by.svg'
import { ReactComponent as NcIcon } from '../../../static/icons/license/nc.svg'
import { ReactComponent as NdIcon } from '../../../static/icons/license/nd.svg'
import { ReactComponent as SaIcon } from '../../../static/icons/license/sa.svg'
import { ReactComponent as ZeroIcon } from '../../../static/icons/license/zero.svg'

export type Visibility = 'Public' | 'Private'

export const by = <ByIcon style={{ width: '20px' }} />
export const zero = <ZeroIcon style={{ width: '20px' }} />
export const nc = <NcIcon style={{ width: '20px' }} />
export const nd = <NdIcon style={{ width: '20px' }} />
export const sa = <SaIcon style={{ width: '20px' }} />

export const licenseIconMap = {
  by,
  zero,
  '0': zero,
  nc,
  nd,
  sa,
}
export type LicenseTypes = keyof typeof licenseIconMap

export const VisibilityNodes = {
  Private: (
    <div>
      <VisibilityOffIcon />
    </div>
  ),
  Public: (
    <div>
      <VisibilityIcon />
    </div>
  ),
}

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
