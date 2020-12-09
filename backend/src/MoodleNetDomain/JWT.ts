export type MoodelNetJwt = {
  user: string
}
//FIXME: implement proper typeguard
export const isMoodelNetJwt = (_obj: object): _obj is MoodelNetJwt => true
