export type ConfigApiKey = {
    provider?: string;
    apiKey: string;
    apiSecret?: string;
    other?: string;
}

export type ErrorMsg = { field: string, msg: string }