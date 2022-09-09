import type { ExtDef, ExtName, ExtVersion, SubcriptionPaths } from '@moodlenet/core'
import type { RawSubOpts } from '@moodlenet/http-server'
import { EmptyError, firstValueFrom, Observable } from 'rxjs'

export type Opts = {
  limit?: number
}
export type Sub = typeof subRaw
export const subRaw =
  <Def extends ExtDef>(extName: ExtName<Def>, extVersion: ExtVersion<Def>) =>
  <Path extends SubcriptionPaths<Def>>(path: Path) => {
    type HttpSubType = RawSubOpts<Def, Path>
    const httpPath: HttpSubType['path'] = `/_/_/raw-sub/${extName}/${extVersion}/${path}`
    const method: HttpSubType['method'] = `POST`
    return (req: HttpSubType['req'], opts?: Opts) =>
      new Observable<HttpSubType['obsType']>(subscriber => {
        const body = JSON.stringify(req)

        const xhr = new XMLHttpRequest()
        // xhr.withCredentials = true
        xhr.open(method, httpPath)
        const headers: HttpSubType['headers'] = {
          'content-type': 'application/json',
          'x-mn-http-pri-sub-limit': opts?.limit,
        }
        Object.entries(headers).forEach(([k, v]) => xhr.setRequestHeader(k, String(v)))

        xhr.addEventListener('readystatechange', function () {
          if (this.readyState === 4) {
            subscriber.complete()
          }
        })
        let last_index = 0
        xhr.addEventListener('progress', function () {
          const curr_index = xhr.responseText.length
          if (last_index == curr_index) return
          const s = xhr.responseText.substring(last_index, curr_index)
          last_index = curr_index
          if (xhr.status < 200 || xhr.status >= 400) {
            const error = parsedOrString(s)
            subscriber.error(error)
            return //console.debug('HTTP SUB progress error:', error)
          }

          s.split('\n')
            .filter(Boolean)
            .map(_ => JSON.parse(_))
            .forEach(notif => {
              if (!(notif && ['E', 'C', 'N'].includes(notif.kind))) {
                const errMsg = `Invalid notification`
                console.error(errMsg, { notif })
                subscriber.error(new TypeError(errMsg, { cause: notif as any }))
              } else if (notif.kind === 'E') {
                subscriber.error(new Error(notif.error))
              } else if (notif.kind === 'N') {
                subscriber.next(notif.value)
              } else {
                subscriber.complete()
              }
            })
        })

        xhr.send(body)
        return () => {
          //TODO:  do nothing if xhr is done
          xhr.abort()
        }
      })
  }

function parsedOrString(s: string) {
  try {
    return JSON.parse(s)
  } catch {
    return s
  }
}

export const fetch =
  <Def extends ExtDef>(extName: ExtName<Def>, extVersion: ExtVersion<Def>) =>
  <Path extends SubcriptionPaths<Def>>(path: Path) => {
    type HttpSubType = RawSubOpts<Def, Path>
    return async (req: HttpSubType['req']) => {
      const data = await firstValueFrom(subRaw(extName, extVersion)(path)(req, { limit: 1 })).catch(e => {
        throw e instanceof EmptyError ? new Error('Empty response from server') : e
      })
      return data
    }
  }
