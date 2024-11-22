import type { PropsWithChildren } from 'react'
import { defaultStyle } from '../ui/lib/color-style'
import { GlobalContextProvider } from '../lib/client/globalContextProvider'
import './root-layout.scss'
import { access } from '../lib/server/session-access'

export default async function RootLayout({ children }: PropsWithChildren) {
  const { webappGlobalCtx } = await access.primary.moodlenetReactApp.props.rootLayout()
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
