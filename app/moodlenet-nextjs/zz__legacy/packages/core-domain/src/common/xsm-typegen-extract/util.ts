import type { State } from 'xstate'
import type { /* StateContext,  */ StateOf, TypegenT } from './types'

// export function matchContext<
//   C extends StateContext<TypegenT, Record<string, { state: StateOf<TypegenT> }>>,
//   State extends C['state'],
// >(context: C, state: State): context is C & { state: State } {
//   return context.state === state
// }

export function matchStateName<T extends TypegenT>(
  state: State<any, any, any, any, any>,
  match: StateOf<T> | StateOf<T>[],
) {
  return stateNameMatcher(state)(match)
}

export const stateNameMatcher =
  <T extends TypegenT>(state: State<any, any, any, any, any>) =>
  (matches: StateOf<T> | StateOf<T>[]) =>
    [matches].flat().some(match => state.matches(match as never))

export const nameStateMatcher =
  <T extends TypegenT>(matches: StateOf<T> | StateOf<T>[]) =>
  (state: State<any, any, any, any, any>) =>
    stateNameMatcher(state)(matches)
