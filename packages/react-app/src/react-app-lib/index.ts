import * as ui from '../webapp/ui'
import { getExposed } from './getExposed'
import { TestCtx, useTest } from './testLib'

declare global {
  export type MoodlenetLib = typeof lib
}

const lib = {
  ui,
  useTest,
  TestCtx,
  getExposed,
}

export default lib
