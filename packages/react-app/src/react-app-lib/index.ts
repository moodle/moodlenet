import * as types from '../types'
import * as ui from '../webapp/ui'
import * as header from '../webapp/ui/components/organisms/Header/addons'
import * as settings from '../webapp/ui/components/pages/Settings/SettingsContext'
import * as auth from './auth'
import { getExposed } from './getExposed'
import priHttp from './pri-http'

declare global {
  export type MoodlenetLib = typeof lib
  export type ExtRoute = types.ExtRoute
  export type ExtContextProvider = types.ExtContextProvider
  export type ExtExpose = types.ExtExpose
}

const lib = {
  priHttp,
  ui,
  auth,
  getExposed,
  settings,
  header,
}

export default lib
