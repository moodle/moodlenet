import { connect } from '@moodlenet/core'
import apis from './apis.mjs'
import { GetStore } from './types.js'
export * from './types.js'

export type Lib = {
  getStore: GetStore
}
export default await connect(import.meta, apis)
