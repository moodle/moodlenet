import { WebappConfig } from './webapp-config'

// export interface PageProps {
//   v: '1.0'
// }
// export type PagePropsFactories = {
//   [k in keyof PageProps]: (() => PageProps[k] | Promise<PageProps[k]>) | PageProps[k]
// }
export interface ServerContext {
  // pageProps: PagePropsFactories
  config: {
    webapp: WebappConfig
  }
}
