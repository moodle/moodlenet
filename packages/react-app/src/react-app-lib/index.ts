import * as ui from '../webapp/ui'
import { useRegisterLogin, useRegisterSignup } from './auth'
import { getExposed } from './getExposed'
import priHttp from './pri-http'

declare global {
  export type MoodlenetLib = typeof lib
}

const lib = {
  priHttp,
  ui,
  auth: {
    useRegisterSignup,
    useRegisterLogin,
  },
  getExposed,
}

export default lib
