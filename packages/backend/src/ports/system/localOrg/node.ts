import { Organization } from '@moodlenet/common/dist/content-graph/types/node'
import { ns } from '../../../lib/ns/namespace'
import { value } from '../../../lib/plug'

export const adapter = value<Organization>(ns(module, 'adapter'))
