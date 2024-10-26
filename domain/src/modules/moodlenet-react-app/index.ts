import type { Layouts } from './types'
export * from './types'

export default interface MoodlenetReactAppDomain {
  event: { moodlenetReactApp: unknown }
  service: { moodlenetReactApp: unknown }
  primary: {
    moodlenetReactApp: {
      webapp: {
        layouts(): Promise<Layouts>
      }
    }
  }
  secondary: {
    moodlenetReactApp: {
      query?: unknown
      service?: unknown
      write?: unknown
      sync?: unknown
    }
  }
}
