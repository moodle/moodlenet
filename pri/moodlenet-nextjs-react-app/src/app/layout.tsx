import { serverGlobals } from '../lib/client/globalContext'
import session from '../lib/server/session-client'
import { layoutPropsWithChildren } from '../lib/server/utils/slots'
import RootLayout from './root-layout'
export default async function layout({ children }: layoutPropsWithChildren) {
  const serverGlobals: serverGlobals = { permissionsInfo: await session.client.policiesInfoPromise }
  // if (!me) {
  //   if (rootPropsResult.reason === 'cleanupSession') {
  //     redirect(`/-/api/cleanup-session?redirectBackTo=${await getCurrentUrl()}`, RedirectType.replace)
  //   } else {
  //     unreachable_never(rootPropsResult.reason, `RootLayout: unknown reason: ${rootPropsResult.reason}`)
  //   }
  // }
  return <RootLayout serverGlobals={serverGlobals}>{children}</RootLayout>
}
