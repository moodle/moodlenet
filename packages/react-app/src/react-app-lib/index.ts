import * as types from '../types'
import * as ui from '../webapp/ui'
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
}

export default lib
