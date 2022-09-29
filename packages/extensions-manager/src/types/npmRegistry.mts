export interface Links {
  npm?: string
  homepage?: string
  repository?: string
  bugs?: string
}

export type Author =
  | string
  | {
      name?: string
      email?: string
      username?: string
      url?: string
    }

export interface Publisher {
  username?: string
  email?: string
}

export interface Maintainer {
  username?: string
  email?: string
}

export interface Package {
  name: string
  scope?: string
  version?: string
  description?: string
  keywords?: string[]
  date: string
  links?: Links
  author?: Author
  publisher?: Publisher
  maintainers?: Maintainer[]
}

export interface Flags {
  unstable?: boolean
}

export interface Detail {
  quality: number
  popularity: number
  maintenance: number
}

export interface Score {
  final: number
  detail: Detail
}

export interface SearchResponseObj {
  package: Package
  flags: Flags
  score: Score
  searchScore: number
}

export interface SearchResponse {
  objects: SearchResponseObj[]
  total: number
  time: string
}
