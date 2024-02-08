import { SnackbarCtxProvider } from '@moodlenet/component-library'
import type { FC } from 'react'
import { BrowserRouter } from 'react-router-dom'
import AppRoutes from './app-routes.js'
import { ProvideLinkComponentCtx, ProvideViewport } from './exports/ui.mjs'
import { MainApp } from './MainApp.js'
import { MainSearchBoxCtxProviderContainer } from './ui/components/atoms/MainSearchBox/MainSearchBoxProviderContainer.js'

const App: FC = () => {
  return (
    <ProvideViewport>
      <BrowserRouter>
        <ProvideLinkComponentCtx>
          <SnackbarCtxProvider>
            <MainSearchBoxCtxProviderContainer>
              <MainApp>
                <AppRoutes />
              </MainApp>
            </MainSearchBoxCtxProviderContainer>
          </SnackbarCtxProvider>
        </ProvideLinkComponentCtx>
      </BrowserRouter>
    </ProvideViewport>
  )
}

export default App
