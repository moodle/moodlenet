import { unreachable_never } from '@moodle/lib-types'
import { redirect, RedirectType } from 'next/navigation'
import type { PropsWithChildren } from 'react'
import { GlobalContextProvider } from '../lib/client/globalContextProvider'
import { access, getCurrentUrl } from '../lib/server/session-access'
import { defaultStyle } from '../ui/lib/color-style'
import './root-layout.scss'

export default async function RootLayout({ children }: PropsWithChildren) {
  const [ok, rootPropsResult] = await access.primary.moodlenetReactApp.props.rootLayout()
  if (!ok) {
    if (rootPropsResult.reason === 'cleanupSession') {
      redirect(`/-/api/cleanup-session?redirectBackTo=${await getCurrentUrl()}`, RedirectType.replace)
    } else {
      unreachable_never(rootPropsResult.reason, `RootLayout: unknown reason: ${rootPropsResult.reason}`)
    }
  }
  const { webappGlobalCtx } = rootPropsResult

  return (
    <html lang="en">
      <body>
        <GlobalContextProvider webappGlobals={webappGlobalCtx}>
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
