import type { ReactNode } from 'react'
import { by, cc, nc, nd, sa, zero } from '../DropdownFieldsMockData.js'
export * from '../DropdownFieldsMockData.js'

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

      <div key="cc-zero">
        {cc}
        {zero}
      </div>,
    ],
    [
      'CC-BY',
      'Attribution',
      <div key="cc-by">
        {cc}
        {by}
      </div>,
    ],
    [
      'CC-BY-SA',
      'Attribution-ShareAlike',
      <div key="cc-by-sa">
        {cc}
        {by}
        {sa}
      </div>,
    ],
    [
      'CC-BY-NC',
      'Attribution-NonCommercial',
      <div key="cc-by-nc">
        {cc}
        {by}
        {nc}
      </div>,
    ],
    [
      'CC-BY-NC-SA',
      'Attribution-NonCommercial-ShareAlike',
      <div key="cc-by-nc-sa">
        {cc}
        {by}
        {nc}
        {sa}
      </div>,
    ],
    [
      'CC-BY-ND',
      'Attribution-NoDerivatives',
      <div key="cc-by-nd">
        {cc}
        {by}
        {nd}
      </div>,
    ],
    [
      'CC-BY-NC-ND',
      'Attribution-NonCommercial-NoDerivatives',
      <div key="cc-by-nc-nd">
        {cc}
        {by}
        {nc}
        {nd}
      </div>,
    ],
  ] as [string, string, ReactNode][],
}
