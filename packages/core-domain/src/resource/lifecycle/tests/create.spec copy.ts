// import { waitFor } from 'xstate/lib/waitFor'
// import { nameMatcher } from '../../lifecycle/exports'

// import { getTestableInterpreter, userIssuer } from './configureMachine'

// test('authenticated user, but non acceptable content', async () => {
//   const [interpreter, states, executions] = getTestableInterpreter({
//     initialContext: { issuer: userIssuer({ feats: { creator: true } }) },
//     storeNewResource_Data: [
//       [{ success: true, refs: { content: { kind: 'file' }, id: {}, image: null } }, 500],
//     ],
//     generateMeta_Data: [[{ generetedMetaEdits: { title: 'my title' } }]],
//   })
//   interpreter.start()

//   const snap = interpreter.getSnapshot()
//   interpreter.send({ type: 'provide-content', content: { kind: 'file' } })
//   await waitFor(interpreter, nameMatcher('Meta-Suggestion-Available'))
//   console.log(executions, states, snap.value, snap.context)
//   expect(snap.value).toBe('Meta-Suggestion-Available')
//   expect(executions).toEqual(['StoreNewResource', 'MetaGenerator'])
//   expect(states).toEqual([
//     [
//       'Checking-In-Content',
//       'Storing-New-Content',
//       'Autogenerating-Meta',
//       'Meta-Suggestion-Availables',
//     ],
//   ])
//   expect(snap.context.contentRejectedReason).toBe('too big')
//   expect(snap.context.generatedMeta?.title).toBe('my title')
// })

// test('unauthenticated issuer should not be authorized to create', async () => {
//   const [interpreter, states, executions] = getTestableInterpreter({
//     initialContext: { issuer: { type: 'unauthenticated' } },
//   })
//   interpreter.start()

//   const snap = interpreter.getSnapshot()
//   console.log(executions, states, snap.value, snap.context)
//   expect(snap.context.noAccessReason).toBe('unauthorized')
//   expect(snap.value).toBe('No-Access')
//   expect(executions).toEqual([])
//   expect(states).toEqual([['Checking-In-Content', 'No-Access']])
// })
