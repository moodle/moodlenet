import type { Layouts } from './types'
export * from './types'

export default interface MoodlenetReactAppDomain {
  event: { moodlenetReactApp: unknown }
  primary: {
    moodlenetReactApp: {
      service?: unknown
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
