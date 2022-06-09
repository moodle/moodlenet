import type { ExtDef, ExtName, ExtVersion, SubcriptionPaths } from '@moodlenet/core'
import { Observable } from 'rxjs'
import { PriHttpSub } from '../types'
export type Sub = typeof sub
export const sub =
  <Def extends ExtDef>(extName: ExtName<Def>, extVersion: ExtVersion<Def>) =>
  <Path extends SubcriptionPaths<Def>>(path: Path) => {
    type HttpSubType = PriHttpSub<Def, Path>
    const httpPath: HttpSubType['path'] = `_/${extName}/${extVersion}/${path}`
    const method: HttpSubType['method'] = `POST`
    return (req: HttpSubType['req'] /* , opts?: Opts */) =>
      new Observable<HttpSubType['obsType']>(subscriber => {
        const headers = new Headers()
        headers.append('Content-Type', 'application/json')

        const body = JSON.stringify(req)

        const xhr = new XMLHttpRequest()
        xhr.withCredentials = true

        xhr.addEventListener('readystatechange', function () {
          if (this.readyState === 4) {
            // console.log('HTTP SUB DONE', {
            //   collectResponse: parsedOrString(`[${this.responseText.split('\n').filter(Boolean).join(',')}]`),
            // })
          }
        })
        let last_index = 0
        xhr.addEventListener('progress', function () {
          // console.log('HTTP SUB progress status:', xhr.status)
          const curr_index = xhr.responseText.length
          if (last_index == curr_index) return
          const s = xhr.responseText.substring(last_index, curr_index)
          last_index = curr_index
          if (xhr.status < 200 || xhr.status >= 400) {
            const error = parsedOrString(s)
            subscriber.error(error)
            return console.error('HTTP SUB progress error:', error)
          }

          s.split('\n')
            .filter(Boolean)
            .map(_ => JSON.parse(_))
            .forEach(_ => subscriber.next(_))
        })

        //setTimeout(()=>xhr.abort(),8000)
        xhr.open(method, httpPath)
        xhr.setRequestHeader('Content-Type', 'application/json')

        xhr.send(body)
        return () => {
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
