export type AssetRef = {
  ext: boolean
  location: string
  mimetype: string
  credits?: Credits | null
}

export type Credits = {
  owner: { url: string; name: string }
  provider?: { name: string; url: string }
}

export type Timestamp = number
export type Empty = Record<string, never>
export type Cursor = string
export type Never = never
export type ID = string
