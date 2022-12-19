import { createContext } from 'react'
import { MainRegistries } from '../registries.mjs'
import { MyPkgContext } from '../../common/my-webapp/types.mjs'

export type MainContextT = MyPkgContext & {
  reg: MainRegistries
}

export const MainContext = createContext<MainContextT>(null as never)
