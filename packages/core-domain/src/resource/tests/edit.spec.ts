import { waitFor } from 'xstate/lib/waitFor'
import { nameMatcher } from '../exports'

import { getTestableInterpreter, userIssuer } from './configureMachine'

test('authenticated user, creator, but too long description', async () => {
  const [interpreter, states, executions] = getTestableInterpreter({
    initialContext: { issuer: userIssuer({ feats: { creator: true } }) },
    storeResourceEdits_Data: [
      [{ success: false, validationErrors: { meta: { description: 'too long' }, image: null } }],
    ],
  })
  interpreter.start('Unpublished')

  interpreter.send({
    type: 'edit-meta',
    edits: { image: { kind: 'no-change' }, meta: {} },
  })
  await waitFor(interpreter, nameMatcher('Unpublished'))
  // console.log(executions, states, snap.value, snap.context)
  const snap = interpreter.getSnapshot()
  expect(snap.value).toBe('Unpublished')
  expect(executions).toEqual([['validate_edit_meta_and_assign_errors'], ['StoreResourceEdits']])
  expect(states).toEqual(['Unpublished', 'Storing-Meta', 'Unpublished'])
  expect(snap.context.resourceEditsValidationErrors).toStrictEqual({
    fields: { description: 'too long' },
  })
})

test('authenticated user, but not creator', async () => {
  const [interpreter /* , states, executions */] = getTestableInterpreter({
    initialContext: { issuer: userIssuer({ feats: { creator: false } }) },
  })
  interpreter.start('Unpublished')

  let snap = interpreter.getSnapshot()
  expect(
    snap.can({
      type: 'edit-meta',
      edits: {
        meta: {} as any,
        image: { kind: 'no-change' },
      },
    }),
  ).toBe(false)
})
