import { KernelExt } from '@moodlenet/kernel'
import { sub } from './xhr-adapter'
sub<KernelExt>(
  'moodlenet.kernel',
  '0.1.10',
)('ext/listDeployed')().subscribe({
  next: ({ msg }) => {
    console.log(msg)
  },
  error: console.error,
  complete: () => console.log('complete'),
})
