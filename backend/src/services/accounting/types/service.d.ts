import { Service } from '../../../lib/moleculer'
import { MNQJobMeta } from '../../../lib/queue/types'

export type AccountingService = Service<
  'accounting',
  {
    confirmAccountEmail: [{ email: string; token: string }, MNQJobMeta | null]
  }
>
