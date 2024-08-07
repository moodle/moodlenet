import { baseStyle } from '#common/config'
import type { PropsWithChildren } from 'react'
import { GlobalProviders } from './global-providers'
import './layout.scss'

export default async function Layout({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <body>
        <GlobalProviders>
          <section id="root">
            <div className={`layout-container`} id={`layout-container`} style={{ ...baseStyle }}>
              {children}
            </div>
          </section>
        </GlobalProviders>
      </body>
    </html>
  )
}
