import { connect } from '@moodlenet/core'
import apis from './apis.mjs'
const connection = await connect(import.meta, apis)

connection.apis(import.meta)

export default connection

console.log('test-extension main')
