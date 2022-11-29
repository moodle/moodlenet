export type Provider = string
export type ConfigId = string

export type GoogleConfig = {
  apiKey: string
  apiSecret: string
}

export type PassportConfigs = Partial<{
  google: GoogleConfig
}>
