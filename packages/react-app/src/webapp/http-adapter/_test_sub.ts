import * as core from '@moodlenet/core'
import { sub } from './xhr-adapter'
sub<core.ext.MoodlenetCoreExt>(
  'moodlenet.core',
  '0.1.10',
)('deployedExtensions')().subscribe({
  next: ({ msg }) => {
    console.log(msg)
  },
  error: console.error,
  complete: console.log.bind(null, 'complete'),
})
