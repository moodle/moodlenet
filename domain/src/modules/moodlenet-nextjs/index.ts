import type { Layouts } from './types'
export * from './types'

export default interface MoodlenetNextjsDomain {
  event: { moodlenetNextjs: unknown }
  primary: {
    moodlenetNextjs: {
      webapp: {
        layouts(): Promise<Layouts>
      }
    }
  }
  secondary: {
    moodlenetNextjs: {
      queue: unknown
      query: unknown
      service: unknown
      write: unknown
      sync: unknown
    }
  }
}
