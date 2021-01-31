import { routes } from '../../../lib/domain'
import { MoodleNetDomain } from '../../MoodleNetDomain'

export type ContentGraphRoutes = '*'
export const contentGraphRoutes = routes<MoodleNetDomain, ContentGraphRoutes>()
