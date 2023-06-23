export type Credits = {
  owner: { url: string; name: string }
  provider?: { name: string; url: string }
}

export type AssetInfo = {
  location: string | File
  credits: Credits | null
}
