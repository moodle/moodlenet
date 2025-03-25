import { serverGlobals } from '../lib/client/globalContext'
import session from '../lib/server/session-client'
import { layoutPropsWithChildren } from '../lib/server/utils/slots'
import RootLayout from './root-layout'
export default async function layout({ children }: layoutPropsWithChildren) {
  console.log('{await}')
  const gate = await session.client.gate
  console.log('{gate}', gate)
  const canGet = gate.any().accessControl().policies().readMyOwn().policiesInfo().send
  console.log({ canGet })
  const serverGlobals: serverGlobals = {
    policiesInfo: await session.client.policiesInfo,
    get,
    gateClientDispatcher,
    // get: canGet ? get : undefined,
  }
  // if (!me) {
  //   if (rootPropsResult.reason === 'cleanupSession') {
  //     redirect(`/-/api/cleanup-session?redirectBackTo=${await getCurrentUrl()}`, RedirectType.replace)
  //   } else {
  //     unreachable_never(rootPropsResult.reason, `RootLayout: unknown reason: ${rootPropsResult.reason}`)
  //   }
  // }
  return <RootLayout serverGlobals={serverGlobals}>{children}</RootLayout>
}
async function get() {
  'use server'
  return session.client.proxy.any.accessControl.policies.readMyOwn.policiesInfo().then(({ policiesInfo }) => policiesInfo)
}

async function gateClientDispatcher(req: moo.def.gate.client.request) {
  'use server'
  return session.client.dispatcher(req)
}
