export type Credits = {
  owner: { url: string; name: string }
  provider?: { name: string; url: string }
}

export type Location = string

export type CreditedImage = {
  location: Location
  credits: Credits | null
}

export type CreditedImageForm = {
  location: Location | File
  credits: Credits | null
}
