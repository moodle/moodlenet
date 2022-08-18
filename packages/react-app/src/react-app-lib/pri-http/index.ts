import { dematMessage, fetch, fetchHook, lazyFetchHook, subRaw } from './xhr-adapter'

const priHttp = {
  sub: subRaw,
  dematMessage,
  fetch,
  fetchHook,
  lazyFetchHook,
}
export default priHttp
