import { interpret } from 'xstate'
import { waitFor } from 'xstate/lib/waitFor'
import type { Event } from '../exports'
import { DEFAULT_CONTEXT, getEdResourceMachine, nameMatcher } from '../exports'

import { getEdResourceMachineDeps, userIssuer } from './configureMachine'

test('authenticated user, creator, but too long description', async () => {
  const deps = getEdResourceMachineDeps()
  const machine = getEdResourceMachine(deps).withContext({
    ...DEFAULT_CONTEXT,
    issuer: userIssuer({ feats: { creator: true } }),
  })
  const interpreter = interpret(machine, {})

  interpreter.start('Unpublished')
  let snap = interpreter.getSnapshot()

  const provideEditsEvent: Event = {
    type: 'provide-resource-edits',
    edits: {
      image: { kind: 'no-change' },
      meta: {
        ...snap.context.doc.meta,
        description: '123456',
      },
    },
  }
  expect(snap.can(provideEditsEvent)).toBe(true)
  interpreter.send(provideEditsEvent)
  await waitFor(interpreter, nameMatcher('Unpublished'))
  // console.log(executions, states, snap.value, snap.context)
  snap = interpreter.getSnapshot()
  expect(snap.value).toBe('Unpublished')
  expect(snap.context.resourceEdits?.errors).toStrictEqual({
    description: ' Please provide a shorter description (6 / 5)',
  })
  interpreter.stop()
})

test('authenticated user, but not creator', async () => {
  const deps = getEdResourceMachineDeps()
  const machine = getEdResourceMachine(deps).withContext({
    ...DEFAULT_CONTEXT,
    issuer: userIssuer({ feats: { creator: false } }),
  })
  const interpreter = interpret(machine, {})
  interpreter.start()
  interpreter.start('Unpublished')

  const snap = interpreter.getSnapshot()
  expect(
    snap.can({
      type: 'provide-resource-edits',
      edits: {
        meta: {} as any,
        image: { kind: 'no-change' },
      },
    }),
  ).toBe(false)
  interpreter.stop()
})
