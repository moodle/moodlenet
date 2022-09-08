import { dematMessage, fetch, subRaw } from './xhr-adapter'

const priHttp = {
  sub: subRaw,
  dematMessage,
  fetch,
}
export default priHttp
