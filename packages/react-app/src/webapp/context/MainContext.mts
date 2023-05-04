import { createContext } from 'react'
import type { MyPkgContext } from '../../common/my-webapp/types.mjs'
import type { MainRegistries } from '../registries.mjs'

export type MainContextT = MyPkgContext & {
  reg: MainRegistries
}

export const MainContext = createContext<MainContextT>(null as never)
