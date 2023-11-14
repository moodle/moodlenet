import { waitFor } from 'xstate/lib/waitFor'
import { nameMatcher } from '../../lifecycle/exports'

import { getTestableInterpreter, userIssuer } from './configureMachine'

test('authenticated user, but non acceptable content', async () => {
  const [interpreter, states, executions] = getTestableInterpreter({
    initialContext: { issuer: userIssuer({ feats: { creator: true } }) },
    storeNewResource_Data: [[{ success: false, reason: 'too big' }, 500]],
  })
  interpreter.start()

  interpreter.send({ type: 'provide-content', content: { kind: 'file' } })
  await waitFor(interpreter, nameMatcher('Checking-In-Content'))
  // console.log(executions, states, snap.value, snap.context)
  const snap = interpreter.getSnapshot()
  expect(snap.value).toBe('Checking-In-Content')
  expect(executions).toEqual([['StoreNewResource']])
  expect(states).toEqual(['Checking-In-Content', 'Storing-New-Content', 'Checking-In-Content'])
  expect(snap.context.contentRejectedReason).toBe('too big')
})

test('unauthenticated issuer should not be authorized to create', async () => {
  const [interpreter, states, executions] = getTestableInterpreter({
    initialContext: { issuer: { type: 'unauthenticated' } },
  })
  interpreter.start()

  const snap = interpreter.getSnapshot()
  // console.log(executions, states, snap.value, snap.context)
  expect(snap.context.noAccessReason).toBe('unauthorized')
  expect(snap.value).toBe('No-Access')
  expect(executions).toEqual([])
  expect(states).toEqual(['No-Access'])
})
