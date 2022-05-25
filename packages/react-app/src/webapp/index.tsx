import 'antd/dist/antd.css'
import React, { ReactNode } from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import extensions from './extensions'
import { AppRouterContextProvider, RouterCtx } from './routes'
// fetch(`http::localhost:8888/_srv/_moodlenet_/pri-http/a/b`, {
//   body: JSON.stringify({ k: 1111, t: 'xx' }),
//   headers: {
//     'Accept': 'application/json',
//     'Content-Type': 'application/json',
//   },
//   method: 'post',
// }).then(async r => console.log(await r.json()))

// export const i18n = setupI18n({
//   locales: [],
// })

ReactDOM.render(
  <React.StrictMode>
    {/* <I18nProvider i18n={i18n}> */}
    <AppRouterContextProvider>
      {Object.entries(extensions).reduce<ReactNode>((child, [extName, { /* extId, */ main }]) => {
        const extInstance = main({ RouterCtx })
        return extInstance.Comp && <extInstance.Comp key={extName}>{child}</extInstance.Comp>
      }, <App />)}
    </AppRouterContextProvider>
    {/* </I18nProvider> */}
  </React.StrictMode>,
  document.querySelector('#root'),
)
