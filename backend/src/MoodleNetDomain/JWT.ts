export type MoodelNetJwt = {
  username: string
}
//FIXME: implement proper typeguard
export const isMoodelNetJwt = (_obj: object): _obj is MoodelNetJwt => true
