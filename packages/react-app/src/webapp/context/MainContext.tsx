import { createContext } from 'react'
import { WebPkgDeps } from '../../common/types.mjs'
import { ReactAppMainComponentProps } from '../web-lib.mjs'

export type MainContextT = ReactAppMainComponentProps<WebPkgDeps>
export const MainContext = createContext<MainContextT>(null as any)
