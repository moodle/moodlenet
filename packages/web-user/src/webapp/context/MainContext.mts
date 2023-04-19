import { createContext } from 'react'
import { MyPkgContext } from '../../common/exports.mjs'
import { MainRegistries } from '../registries.mjs'

export type MainContextT = MyPkgContext & {
  registries: MainRegistries
}

export const MainContext = createContext<MainContextT>(null as never)
