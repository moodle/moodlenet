import * as ui from '../webapp/ui'
import { getExposed } from './getExposed'
import priHttp from './pri-http'
import { TestCtx, useTest } from './testLib'

declare global {
  export type MoodlenetLib = typeof lib
}

const lib = {
  priHttp,
  ui,
  useTest,
  TestCtx,
  getExposed,
}

export default lib
