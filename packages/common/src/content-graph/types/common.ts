export type Timestamp = number
export type AuthId = string
export const isAuthId = (_: any): _ is AuthId => 'string' === typeof _
