import { fract } from '@moodle/lib-types'
import { license } from '../types'

export const contentLicensesSetup = contentLicenses()

function contentLicenses(): license[] {
  return [
    { code: 'cc-0', name: 'Public domain', restrictiveness: fract(0.01) },
    { code: 'cc-by', name: 'Attribution', restrictiveness: fract(0.1) },
    { code: 'cc-by-sa', name: 'Attribution + ShareAlike', restrictiveness: fract(0.2) },
    { code: 'cc-by-nc', name: 'Attribution + NonCommercial', restrictiveness: fract(0.3) },
    {
      code: 'cc-by-nc-sa',
      name: 'Attribution + NonCommercial + ShareAlike',
      restrictiveness: fract(0.4),
    },
    { code: 'cc-by-nd', name: 'Attribution + NoDerivatives', restrictiveness: fract(0.5) },
    {
      code: 'cc-by-nc-nd',
      name: 'Attribution + NonCommercial + NoDerivatives',
      restrictiveness: fract(0.6),
    },
    // { code: 'other-open', name: 'Other open license', restrictiveness: fract(0.15)},
    // { code: 'restricted-copyright', name: 'Restricted / copyrighted', restrictiveness: fract(0.9)},
  ]
}
