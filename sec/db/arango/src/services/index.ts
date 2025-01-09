import { provideQueueService } from '@moodle/lib-job-queue-arangodb'
import { domainAccessJobData } from './types'

export const provideDomainAccessJobQueueService = provideQueueService<domainAccessJobData>
