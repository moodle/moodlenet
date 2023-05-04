import type { EdMetaExposeType } from '../common/expose-def.mjs'
import { shell } from './shell.mjs'

// import { ResourceDataResponce, ResourceFormValues } from '../common.mjs'

export const expose = await shell.expose<EdMetaExposeType>({
  rpc: {},
})
