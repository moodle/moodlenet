import type { FC } from 'react'
import { BrowserRouter } from 'react-router-dom'
import AppRoutes from './app-routes.js'
import { ProvideOrganizationContext } from './context/OrganizationCtx.js'
import { ProvideLinkComponentCtx } from './exports/ui.mjs'
import { ProvideAdminSettingsContext } from './exports/webapp.mjs'
import { MainApp } from './MainApp.js'
import { MainSearchBoxCtxProviderContainer } from './ui/components/atoms/MainSearchBox/MainSearchBoxProviderContainer.js'

const App: FC = () => {
  return (
    <BrowserRouter>
      <ProvideLinkComponentCtx>
        <MainSearchBoxCtxProviderContainer>
          <ProvideAdminSettingsContext>
            <ProvideOrganizationContext>
              <MainApp>
                <AppRoutes />
              </MainApp>
            </ProvideOrganizationContext>
          </ProvideAdminSettingsContext>
        </MainSearchBoxCtxProviderContainer>
      </ProvideLinkComponentCtx>
    </BrowserRouter>
  )
}

export default App
