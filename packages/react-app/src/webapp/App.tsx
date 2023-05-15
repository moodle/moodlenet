import type { FC } from 'react'
import { BrowserRouter } from 'react-router-dom'
import AppRoutes from './app-routes.js'
import { ProvideOrganizationContext } from './context/OrganizationCtx.js'
import { ProvideLinkComponentCtx } from './exports/ui.mjs'
import { ProvideSettingsContext } from './exports/webapp.mjs'
import { MainApp } from './MainApp.js'

const App: FC = () => {
  return (
    <BrowserRouter>
      <ProvideLinkComponentCtx>
        <ProvideSettingsContext>
          <ProvideOrganizationContext>
            <MainApp>
              <AppRoutes />
            </MainApp>
          </ProvideOrganizationContext>
        </ProvideSettingsContext>
      </ProvideLinkComponentCtx>
    </BrowserRouter>
  )
}

export default App
