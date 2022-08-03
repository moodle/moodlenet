import { CoreExt } from '@moodlenet/core'
import { subRaw } from './xhr-adapter'
subRaw<CoreExt>(
  '@moodlenet/core',
  '0.1.0',
)('ext/listDeployed')().subscribe({
  next: ({ msg }) => {
    console.log(msg)
  },
  error: console.error,
  complete: () => console.log('complete'),
})
