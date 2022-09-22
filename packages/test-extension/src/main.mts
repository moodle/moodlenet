import { connect } from '@moodlenet/core'
import apis from './apis.mjs'
const connection = await connect(import.meta, apis)

export default connection

console.log('test-extension main')
