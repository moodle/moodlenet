import { matchStateName, nameStateMatcher, stateNameMatcher } from '../../common/exports'
import { Typegen0 } from '../lifecycle.xsm.typegen'

export * from './document'
export * from './issuer'
export * from './lifecycle'

export const matchState = matchStateName<Typegen0>
export const stateMatcher = stateNameMatcher<Typegen0>
export const nameMatcher = nameStateMatcher<Typegen0>
