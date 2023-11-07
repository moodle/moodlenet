import { matchStateName, nameStateMatcher, stateNameMatcher } from '../../../common/exports'
import { Typegen0 } from '../lifecycle.xsm.typegen'

export * from './documents.types'
export * from './issuer'
export * from './lifecycle.types'

export const matchState = matchStateName<Typegen0>
export const stateMatcher = stateNameMatcher<Typegen0>
export const nameMatcher = nameStateMatcher<Typegen0>
