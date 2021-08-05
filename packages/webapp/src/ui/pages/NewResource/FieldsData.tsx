import { t } from "@lingui/macro"
import { DropdownOptionsType } from "../../components/atoms/Dropdown/Dropdown"
import byIcon from '../../static/icons/license/by.svg'
import ncIcon from '../../static/icons/license/nc.svg'
import ndIcon from '../../static/icons/license/nd.svg'
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
const nc = <img src={ncIcon} alt="CCO"/>
const nd = <img src={ndIcon} alt="BY"/>
const sa = <img src={saIcon} alt="CCO"/>

export const LicenseDropdown: Field  =  {
    label: t`Just a text field`,
    options: [
        ['CCO (Public domain)', <div>{zero}</div>],
        ['CC-BY (Attribution)', <div>{zero}{by}</div>],
        ['CC-BY-SA (Attribution-ShareAlike)', <div>{zero}{by}{sa}</div>],
        ['CC-BY-NC (Attribution-NonCommercial)', <div>{zero}{by}{nc}</div>],
        ['CC-BY-NC-SA (Attribution-NonCommercial-ShareAlike)', <div>{zero}{by}{nc}{sa}</div>],
        ['CC-BY-ND (Attribution-NonCommercial)', <div>{zero}{by}{nd}</div>],
        ['CC-BY-NC-ND (Attribution-NonCommercial-NoDerivatives)', <div>{zero}{by}{nc}{nd}</div>],
    ]
}



