import react from 'react'
import * as router from 'react-router-dom'
import * as ui from '../webapp/ui'
import { StateContext, StateProvider } from './devModeContextProvider'
import { getExposed } from './getExposed'
import { TestCtx, useTest } from './testLib'

declare global {
  export type MoodlenetLib = typeof lib
}

const lib = {
  ui,
  devMode: {
    StateProvider,
    StateContext,
  },
  useTest,
  react,
  router,
  TestCtx,
  getExposed,
}

module.exports = lib
