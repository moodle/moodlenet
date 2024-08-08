import { baseStyle } from '@/common/config'
import { GlobalProviders } from 'app/global-providers'
import type { PropsWithChildren } from 'react'
import './layout-root.scss'

export default async function RootLayout({ children }: PropsWithChildren) {
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
