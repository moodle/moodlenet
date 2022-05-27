import React, { ReactNode } from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import { ContainerContextsProviders, RactAppContainer } from './container-contexts-providers'
import extensions from './extensions'

ReactDOM.render(
  <React.StrictMode>
    {/* <I18nProvider i18n={i18n}> */}
    <ContainerContextsProviders>
      {Object.entries(extensions).reduce<ReactNode>((child, [extName, { /* extId, */ main }]) => {
        const extInstance = main(RactAppContainer)
        return extInstance.Comp && <extInstance.Comp key={extName}>{child}</extInstance.Comp>
      }, <App />)}
    </ContainerContextsProviders>
    {/* </I18nProvider> */}
  </React.StrictMode>,
  document.querySelector('#root'),
)
