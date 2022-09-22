import { connect } from '@moodlenet/core/lib/pkg-shell.mjs'
export const connection = await connect(import.meta, {})

import('./doo.mjs')
console.log('test-extension-2 main')
