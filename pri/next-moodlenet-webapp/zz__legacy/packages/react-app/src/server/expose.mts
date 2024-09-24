import type { PkgExposeImpl } from '@moodlenet/core'
import type { ReactAppExposeType } from '../common/expose-def.mjs'
import { shell } from './shell.mjs'

const reactAppExposeImpl: PkgExposeImpl<ReactAppExposeType> = {
  rpc: {},
}

export const expose = await shell.expose(reactAppExposeImpl)
