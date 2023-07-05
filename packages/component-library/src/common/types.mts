export type Credits = {
  owner: { url: string; name: string }
  provider?: { name: string; url: string }
}

export type Location = string

export type AssetInfo = {
  location: Location
  credits: Credits | null
}

export type AssetInfoForm = {
  location: Location | File
  credits: Credits | null
}
