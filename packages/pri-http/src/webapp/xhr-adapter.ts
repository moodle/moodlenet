import type { DataMessage, ExtDef, ExtName, ExtVersion, SubcriptionPaths, ValueData } from '@moodlenet/core'
import { Observable, ObservableInput, throwError } from 'rxjs'
import { mergeMap } from 'rxjs/operators'
import { PriHttpSub } from '../types'
export type Sub = typeof sub
export const sub =
  <Def extends ExtDef>(extName: ExtName<Def>, extVersion: ExtVersion<Def>) =>
  <Path extends SubcriptionPaths<Def>>(path: Path) => {
    type HttpSubType = PriHttpSub<Def, Path>
    const httpPath: HttpSubType['path'] = `/_/sub/${extName}/${extVersion}/${path}`
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

export function dematMessage<T>() {
  return mergeMap<{ msg: DataMessage<ValueData<T>> }, ObservableInput<{ msg: DataMessage<T> }>>(({ msg }) => {
    const notif = msg.data.value
    // console.log({ msg, notif, ________________________: '' })
    return typeof notif.kind !== 'string'
      ? (throwError(() => new TypeError('Invalid notification, missing "kind"')) as unknown as {
          msg: DataMessage<T>
        }[])
      : notif.kind === 'E'
      ? (throwError(() => new Error(notif.error, { cause: notif.error })) as unknown as { msg: DataMessage<T> }[])
      : notif.kind === 'N'
      ? [{ msg: { ...msg, data: notif.value } }]
      : notif.kind === 'C'
      ? []
      : (throwError(
          () =>
            new TypeError(
              `Invalid notification, unknown "kind" ` +
                // @ts-expect-error
                notif.kind,
            ),
        ) as unknown as { msg: DataMessage<T> }[])
  })
}
