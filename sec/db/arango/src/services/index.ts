import { provideQueueService } from './lib'
import { domainAccessJobData } from './types'

export const provideDomainAccessJobQueueService = provideQueueService<domainAccessJobData>
