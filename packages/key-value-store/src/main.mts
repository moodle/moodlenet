import { connect } from '@moodlenet/core'
import apis from './apis.mjs'
export * from './types.js'

export default await connect(import.meta, apis)
