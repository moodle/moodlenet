export type MoodleNetJwt = {
  username: string
}
//FIXME: implement proper typeguard
export const isMoodleNetJwt = (_obj: object): _obj is MoodleNetJwt => true
