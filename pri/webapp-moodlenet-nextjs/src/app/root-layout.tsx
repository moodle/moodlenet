import type { PropsWithChildren } from 'react'
import { defaultStyle } from '../ui/lib/color-style'
import { GlobalProviders } from './root-layout.client'
import './root-layout.scss'
import { priAccess } from '../lib/server/session-access'

export default async function RootLayout({ children }: PropsWithChildren) {
  const deployments = await priAccess().env.application.deployments()

  return (
    <html lang="en">
      <body>
        <GlobalProviders {...{ deployments }}>
          <section id="root">
            <div className={`layout-container`} id={`layout-container`} style={{ ...defaultStyle }}>
              {children}
            </div>
          </section>
        </GlobalProviders>
      </body>
    </html>
  )
}
