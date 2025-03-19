'use client'
import type { PropsWithChildren } from 'react'
import { GlobalContextProvider, serverGlobals } from '../lib/client/globalContext'
import { defaultStyle } from '../ui/lib/color-style'
import './root-layout.scss'

export type rootLayoutProps = PropsWithChildren<{
  serverGlobals: serverGlobals
}>

export default function RootLayout({ children, serverGlobals }: rootLayoutProps) {
  return (
    <html lang="en">
      <body>
        <GlobalContextProvider serverGlobals={serverGlobals}>
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
