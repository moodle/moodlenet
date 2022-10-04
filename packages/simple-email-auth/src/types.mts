export type SignupReq = { email: string; password: string; displayName: string }
export type ConfirmEmailPayload = { req: SignupReq }
