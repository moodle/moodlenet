import * as ui from '../webapp/ui'
import * as auth from './auth'
import { getExposed } from './getExposed'
import priHttp from './pri-http'

declare global {
  export type MoodlenetLib = typeof lib
}

const lib = {
  priHttp,
  ui,
  auth,
  getExposed,
}

export default lib
