import { interpret } from 'xstate'
import { DEFAULT_CONTEXT, getEdResourceMachine } from '../exports'

import { getEdResourceMachineDeps, userIssuer } from './configureMachine'

test('authenticated user, but non acceptable content', async () => {
  const deps = getEdResourceMachineDeps()
  const machine = getEdResourceMachine(deps).withContext({
    ...DEFAULT_CONTEXT,
    issuer: userIssuer({ feats: { creator: true } }),
  })
  const interpreter = interpret(machine, {})
  interpreter.start()

  interpreter.send({ type: 'provide-new-resource', content: { kind: 'file', size: 1001 } })
  const snap = interpreter.getSnapshot()
  expect(snap.context.providedContent).toStrictEqual(null)
  expect(snap.context.contentRejected).toStrictEqual({
    reason: 'ValidationError: File too big 1001 B, max 1000 B',
  })
  interpreter.stop()
})

test('unauthenticated issuer should not be authorized to create', async () => {
  const deps = getEdResourceMachineDeps()
  const machine = getEdResourceMachine(deps)
  const interpreter = interpret(machine, {})
  interpreter.start()

  const snap = interpreter.getSnapshot()
  // console.log(executions, states, snap.value, snap.context)
  expect(snap.context.noAccess?.reason).toBe('unauthorized')
  expect(snap.value).toBe('No-Access')
  interpreter.stop()
})
