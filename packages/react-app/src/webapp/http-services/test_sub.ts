import * as core from '@moodlenet/core'
import { sub } from './sub'
sub<core.ext.MoodlenetCoreExt>(
  'moodlenet.core',
  '0.1.10',
)('_test')({ a: 'ksssdjjdsa' }).subscribe({
  next: ({ msg }) => {
    console.log(msg.data.a.toPrecision(10), msg)
  },
  error: console.error,
  complete: console.log.bind(null, 'complete'),
})
