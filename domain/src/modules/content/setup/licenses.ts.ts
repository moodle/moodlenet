import { fraction_schema } from '@moodle/lib-types'
import { contentLicenseRecord } from '../types'

export const contentLicensesSetup: contentLicenseRecord[] = [
  { code: 'cc-0', name: 'Public domain', restrictiveness: fraction_schema.parse(0.01) },
  { code: 'cc-by', name: 'Attribution', restrictiveness: fraction_schema.parse(0.1) },
  { code: 'cc-by-sa', name: 'Attribution + ShareAlike', restrictiveness: fraction_schema.parse(0.2) },
  { code: 'cc-by-nc', name: 'Attribution + NonCommercial', restrictiveness: fraction_schema.parse(0.3) },
  {
    code: 'cc-by-nc-sa',
    name: 'Attribution + NonCommercial + ShareAlike',
    restrictiveness: fraction_schema.parse(0.4),
  },
  { code: 'cc-by-nd', name: 'Attribution + NoDerivatives', restrictiveness: fraction_schema.parse(0.5) },
  {
    code: 'cc-by-nc-nd',
    name: 'Attribution + NonCommercial + NoDerivatives',
    restrictiveness: fraction_schema.parse(0.6),
  },
  // { id: 'other-open', name: 'Other open license', restrictiveness: fraction_schema.parse(0.15)},
  // { id: 'restricted-copyright', name: 'Restricted / copyrighted', restrictiveness: fraction_schema.parse(0.9)},
]
