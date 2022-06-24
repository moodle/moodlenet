import react from 'react'
import * as router from 'react-router-dom'
import { TestCtx, useTest } from './testLib'

declare global {
  export type MoodlenetLib = typeof lib
}

const lib = {
  useTest,
  react,
  router,
  TestCtx,
}

module.exports = lib
