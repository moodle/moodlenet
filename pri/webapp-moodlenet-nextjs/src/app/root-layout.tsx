import type { PropsWithChildren } from 'react'
import { defaultStyle } from '../ui/lib/color-style'
import { GlobalProviderDeps, GlobalProvider } from './root-layout.client'
import './root-layout.scss'
import { primary } from '../lib/server/session-access'
import { fetchAllSchemaConfigs } from '@moodle/domain/lib'

export default async function RootLayout({ children }: PropsWithChildren) {
  const deployments = await primary.moodle.env.application.deployments()
  const allSchemaConfigs = await fetchAllSchemaConfigs({ primary: primary.moodle })

  const globalCtxDeps: GlobalProviderDeps = {
    deployments,
    allSchemaConfigs,
  }
  return (
    <html lang="en">
      <body>
        <GlobalProvider ctxDeps={globalCtxDeps}>
          <section id="root">
            <div className={`layout-container`} id={`layout-container`} style={{ ...defaultStyle }}>
              {children}
            </div>
          </section>
        </GlobalProvider>
      </body>
    </html>
  )
}
