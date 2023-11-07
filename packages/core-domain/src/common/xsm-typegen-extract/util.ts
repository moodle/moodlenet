import { State } from 'xstate'
import type { StateContext, StateOf, TypegenT } from './types'

export function matchContext<
  C extends StateContext<TypegenT, Record<string, { state: StateOf<TypegenT> }>>,
  State extends C['state'],
>(context: C, state: State): context is C & { state: State } {
  return context.state === state
}

export function matchStateName<T extends TypegenT>(
  state: State<any, any, any, any, any>,
  match: StateOf<T>,
) {
  return stateNameMatcher(state)(match)
}

export const stateNameMatcher =
  <T extends TypegenT>(state: State<any, any, any, any, any>) =>
  (match: StateOf<T>) =>
    state.matches(match as never)

export const nameStateMatcher =
  <T extends TypegenT>(match: StateOf<T>) =>
  (state: State<any, any, any, any, any>) =>
    state.matches(match as never)
