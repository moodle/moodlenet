import { Service } from '../../../lib/moleculer'

export type AccountingService = Service<
  'accounting',
  {
    confirmAccountEmail: [{ email: string; token: string }, boolean]
  }
>
