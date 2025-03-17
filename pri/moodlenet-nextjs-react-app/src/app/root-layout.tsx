import type { PropsWithChildren } from 'react'
import { GlobalContextProvider } from '../lib/client/globalContextProvider'
import { sessionContext } from '../lib/client/globalContexts'
import client from '../lib/server/session-client'
import { defaultStyle } from '../ui/lib/color-style'
import './root-layout.scss'

export default async function RootLayout({ children }: PropsWithChildren) {
  const my = await client.my
  // if (!me) {
  //   if (rootPropsResult.reason === 'cleanupSession') {
  //     redirect(`/-/api/cleanup-session?redirectBackTo=${await getCurrentUrl()}`, RedirectType.replace)
  //   } else {
  //     unreachable_never(rootPropsResult.reason, `RootLayout: unknown reason: ${rootPropsResult.reason}`)
  //   }
  // }
  const sessionContext: sessionContext = { permissionsInfo: my.permissionsInfo }
  alert(JSON.stringify({ my }, null, 2))
  return (
    <html lang="en">
      <body>
        <GlobalContextProvider sessionContext={sessionContext}>
          <section id="root">
            <div className={`layout-container`} id={`layout-container`} style={{ ...defaultStyle }}>
              {children}
            </div>
          </section>
        </GlobalContextProvider>
      </body>
    </html>
  )
}
