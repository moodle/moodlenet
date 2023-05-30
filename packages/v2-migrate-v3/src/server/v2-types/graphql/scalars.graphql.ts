export type Credits = {
  owner: { url: string; name: string }
  provider?: { name: string; url: string }
}

export type Empty = Record<string, never>
export type ID = string
