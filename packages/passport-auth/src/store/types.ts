export type Provider = string
export type ConfigId = string

export type ConfigApiKey = {
    id:ConfigId,
    provider?: Provider;
    apiKey: string;
    apiSecret?: string;
}

export type ApiConfigs = Record<ConfigId, ConfigApiKey>
