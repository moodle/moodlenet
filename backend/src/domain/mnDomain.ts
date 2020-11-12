import { make } from '../lib/domain/domain'
import { mockWFPersistence } from '../lib/domain/persistence/mock'
import { MoodleNetDomain } from './MoodleNetDomain'

export const mnDomain = make<MoodleNetDomain>('MoodleNetDomain', mockWFPersistence)
