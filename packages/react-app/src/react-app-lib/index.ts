import react from 'react'
import * as router from 'react-router-dom'
import { StateContext, StateProvider } from './devModeContextProvider'
import { getExposed } from './getExposed'
import { TestCtx, useTest } from './testLib'

declare global {
  export type MoodlenetLib = typeof lib
}

const lib = {
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
