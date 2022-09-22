import { connect } from '@moodlenet/core'
export const connection = await connect(import.meta, {})

import('./doo.mjs')
console.log('test-extension-2 main')
