import { CoreExt } from '@moodlenet/core'
import { sub } from './xhr-adapter'
sub<CoreExt>(
  'moodlenet-core',
  '0.1.10',
)('ext/listDeployed')().subscribe({
  next: ({ msg }) => {
    console.log(msg)
  },
  error: console.error,
  complete: () => console.log('complete'),
})
