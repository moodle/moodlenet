import type { Dispatch } from 'react'
import { useCallback, useReducer } from 'react'
import type {
  CreateResourceActivityState,
  CreateResourceUserIntents,
} from '../workflows/create/ui-states-intents.mjs'

interface ResourcePageProps {
  flow: {
    dispatch: Dispatch<CreateResourceUserIntents>
    state: CreateResourceActivityState
  }
}
useReducer
export function ResourcePage({ flow: { dispatch, state } }: ResourcePageProps) {
  // if (state.activity === 'Create resource') {
  //   return <CreateResourceActivity />
  // }
  const chooseContent = useCallback(
    () => dispatch({ type: 'Choose content', choosenContent: 'http://asd.asd' }),
    [dispatch],
  )
  return (
    <div onClick={chooseContent}>
      {state.type === 'Choose content' && state.choosenContentErrors?.error && (
        <div className="errors">{state.choosenContentErrors.error.type}</div>
      )}
    </div>
  )
}
