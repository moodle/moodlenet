export type signedTokenPayloadProp = 'tokenPayload'
export const SIGNED_TOKEN_PAYLOAD_PROP: signedTokenPayloadProp = 'tokenPayload'
export type signed_token_payload_data<t> = {
  [k in signedTokenPayloadProp]: t
}
