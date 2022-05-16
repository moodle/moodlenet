import { ReactNode } from 'react'
import { by, cc, nc, nd, sa, zero } from '../../../pages/NewResource/FieldsData'

export const LevelDropdown = {
  label: `Level`,
  placeholder: `Educational level`,
  options: [
    [`0.1`, `Early childhood educational development`],
    [`0.2`, `Pre-primary education`],
    [`1`, `Primary education`],
    [`2`, `Lower secondary education`],
    [`3`, `Upper secondary education`],
    [`4`, `Post-secondary non-tertiary education`],
    [`5`, `Short-cycle tertiary education`],
    [`6`, `Bachelor or equivalent`],
    [`7`, `Master or equivalent`],
    [`8`, `Doctoral or equivalent`],
  ] as [string, string][],
}

export const LicenseDropdown = {
  placeholder: `License`,
  label: `License`,
  options: [
    [
      'CC-0',
      'Public domains',

      <div>
        {cc}
        {zero}
      </div>,
    ],
    [
      'CC-BY',
      'Attribution',
      <div>
        {cc}
        {by}
      </div>,
    ],
    [
      'CC-BY-SA',
      'Attribution-ShareAlike',
      <div>
        {cc}
        {by}
        {sa}
      </div>,
    ],
    [
      'CC-BY-NC',
      'Attribution-NonCommercial',
      <div>
        {cc}
        {by}
        {nc}
      </div>,
    ],
    [
      'CC-BY-NC-SA',
      'Attribution-NonCommercial-ShareAlike',
      <div>
        {cc}
        {by}
        {nc}
        {sa}
      </div>,
    ],
    [
      'CC-BY-ND',
      'Attribution-NoDerivatives',
      <div>
        {cc}
        {by}
        {nd}
      </div>,
    ],
    [
      'CC-BY-NC-ND',
      'Attribution-NonCommercial-NoDerivatives',
      <div>
        {cc}
        {by}
        {nc}
        {nd}
      </div>,
    ],
  ] as [string, string, ReactNode][],
}
