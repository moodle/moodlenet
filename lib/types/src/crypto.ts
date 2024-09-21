export type encryptedTokenPayloadProp = 'tokenPayload'
export const ENCRYPTED_TOKEN_PAYLOAD_PROP: encryptedTokenPayloadProp = 'tokenPayload'
export type encrypted_token_payload_data<t> = {
  [k in encryptedTokenPayloadProp]: t
}
