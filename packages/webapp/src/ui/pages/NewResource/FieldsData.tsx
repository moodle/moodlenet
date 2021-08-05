import { t } from "@lingui/macro"
import { DropdownOptionsType } from "../../components/atoms/Dropdown/Dropdown"
import byIcon from '../../static/icons/license/by.svg'
import ccIcon from '../../static/icons/license/cc.svg'
import ncEuIcon from '../../static/icons/license/nc-eu.svg'
import ncJpIcon from '../../static/icons/license/nc-jp.svg'
import ncIcon from '../../static/icons/license/nc.svg'
import ndIcon from '../../static/icons/license/nd.svg'
import pdIcon from '../../static/icons/license/pd.svg'
import saIcon from '../../static/icons/license/sa.svg'
import zeroIcon from '../../static/icons/license/zero.svg'

export type Field = {
    label: string
    options: DropdownOptionsType 
}

export const LevelDropdown: Field  =  {
    label: t`Level`,
    options:  [
        t`0.1 Early childhood educational development`,
        t`0.2 Pre-primary education`,
        t`1 Primary education`,
        t`2 Lower secondary education`,
        t`3 Upper secondary education`,
        t`4 Post-secondary non-tertiary education`,
        t`5 Short-cycle tertiary education`,
        t`6 Bachelor or equivalent`,
        t`7 Master or equivalent`,
        t`8 Doctoral or equivalent`
    ]
}

export const CategoryDropdown: Field  =  {
    label: t`Level`,
    options:  [
        t`0.1 Early childhood educational development`,
        t`0.2 Pre-primary education`,
        t`1 Primary education`,
        t`2 Lower secondary education`,
        t`3 Upper secondary education`,
        t`4 Post-secondary non-tertiary education`,
        t`5 Short-cycle tertiary education`,
        t`6 Bachelor or equivalent`,
        t`7 Master or equivalent`,
        t`8 Doctoral or equivalent`
    ]
}

const by = <img src={byIcon} alt="BY"/>
const zero = <img src={zeroIcon} alt="CCO"/>
const cc = <img src={ccIcon} alt="BY"/>
const nc = <img src={ncIcon} alt="CCO"/>
const ncEu = <img src={ncEuIcon} alt="BY"/>
const ncJp = <img src={ncJpIcon} alt="CCO"/>
const nd = <img src={ndIcon} alt="BY"/>
const pd = <img src={pdIcon} alt="BY"/>
const sa = <img src={saIcon} alt="CCO"/>

export const LicenseDropdown: Field  =  {
    label: t`Just a text field`,
    options: [
        ['CCO', <div>{zero}</div>],
        ['CC-BY', <div>{by}{zero}</div>],
        ['CC-BY', <div>{by}{cc}</div>],
        ['CC-BY', <div>{by}{nc}</div>],
        ['CC-BY', <div>{by}{ncEu}</div>],
        ['CC-BY', <div>{by}{ncJp}</div>],
        ['CC-BY', <div>{by}{nd}</div>],
        ['CC-BY', <div>{by}{pd}</div>],
        ['CC-BY', <div>{by}{sa}</div>],
    ]
}

/*
CC0 (Public domain)
CC-BY (Attribution)
CC-BY-SA (Attribution-ShareAlike)
CC-BY-NC (Attribution-NonCommercial)
CC-BY-NC-SA (Attribution-NonCommercial-ShareAlike)
CC-BY-ND (Attribution-NonCommercial)
CC-BY-NC-ND (Attribution-NonCommercial-NoDerivatives)
*/



