import lib from 'moodlenet-react-app-lib'
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

const root = ReactDOM.createRoot(document.getElementById('root')!)
root.render(
  <React.StrictMode>
    <lib.TestCtx.Provider value={{ _: 'provided test value' }}>
      {/* <I18nProvider i18n={i18n}> */}
      <App />
      {/* </I18nProvider> */}
    </lib.TestCtx.Provider>
  </React.StrictMode>,
)
