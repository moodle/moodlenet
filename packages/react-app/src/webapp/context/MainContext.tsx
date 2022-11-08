import { createContext } from 'react'
import { WebPkgDeps } from '../main.mjs'
import { ReactAppMainComponentProps } from '../webapp/web-lib.mjs'

export type MainContextT = ReactAppMainComponentProps<WebPkgDeps>
export const MainContext = createContext<MainContextT>(null as any)
