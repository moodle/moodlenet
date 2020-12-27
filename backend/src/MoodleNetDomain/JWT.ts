export type MoodleNetExecutionAuth = {
  username: string
}
//FIXME: implement proper typeguard
export const isMoodleNetJwt = (_obj: object): _obj is MoodleNetExecutionAuth => true
