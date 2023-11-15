import { waitFor } from 'xstate/lib/waitFor'
import { nameMatcher } from '../exports'

import { getTestableInterpreter, userIssuer } from './configureMachine'

test('authenticated user, creator, but too long description', async () => {
  const [interpreter, states, executions] = getTestableInterpreter({
    initialContext: { issuer: userIssuer({ feats: { creator: true } }) },
    storeMetaEdits_Data: [
      [{ success: false, validationErrors: { fields: { description: 'too long' } } }],
    ],
  })
  interpreter.start('Unpublished')

  interpreter.send({ type: 'edit-meta', metaEdits: {} })
  await waitFor(interpreter, nameMatcher('Unpublished'))
  // console.log(executions, states, snap.value, snap.context)
  const snap = interpreter.getSnapshot()
  expect(snap.value).toBe('Unpublished')
  expect(executions).toEqual([['validate_edit_meta_and_assign_errors'], ['StoreMetaEdits']])
  expect(states).toEqual(['Unpublished', 'Storing-Meta', 'Unpublished'])
  expect(snap.context.metaEditsValidationErrors).toStrictEqual({
    fields: { description: 'too long' },
  })
})

test('authenticated user, but not creator', async () => {
  const [interpreter /* , states, executions */] = getTestableInterpreter({
    initialContext: { issuer: userIssuer({ feats: { creator: false } }) },
  })
  interpreter.start('Unpublished')

  let snap = interpreter.getSnapshot()
  expect(snap.can({ type: 'edit-meta', metaEdits: {} })).toBe(false)
})
