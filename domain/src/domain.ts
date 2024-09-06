declare const _: unique symbol
export interface MoodleDomain {
  version: '5.0'
  modules: Modules
}

export interface MoodleMods {
  [_]: never
}

export interface Modules {
  moodle: MoodleMods
}
