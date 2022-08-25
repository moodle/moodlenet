import type { DataMessage, ExtDef, ExtId, ExtName, ExtVersion, SubcriptionPaths, ValueData } from '@moodlenet/core'
import type { RawSubOpts } from '@moodlenet/http-server'
import { firstValueFrom, Observable, ObservableInput, throwError } from 'rxjs'
import { mergeMap } from 'rxjs/operators'
export type Sub = typeof subRaw
export const subRaw =
  <Def extends ExtDef>(extId: ExtId<Def>) =>
  <Path extends SubcriptionPaths<Def>>(path: Path) => {
    type HttpSubType = RawSubOpts<Def, Path>
    const [extVersion, extName, scoped = false] = extId.split('@').reverse() as [
      extVersion: ExtVersion<Def>,
      extName: ExtName<Def>,
      scoped?: '',
    ]
    const mAt = scoped === false ? '' : ('@' as '')
    const httpPath: HttpSubType['path'] = `/_/_/raw-sub/${mAt}${extName}/${extVersion}/${path}`
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

export const fetch =
  <Def extends ExtDef>(extId: ExtId<Def>) =>
  <Path extends SubcriptionPaths<Def>>(path: Path) => {
    type HttpSubType = RawSubOpts<Def, Path>
    return async (req: HttpSubType['req']) => {
      const resp = await firstValueFrom(subRaw<Def>(extId)(path)(req).pipe(dematMessage()))
      return [resp.msg.data, resp] as const
    }
  }
// subRaw<CoreExt>('@moodlenet/core@0.1.0')('ext/listDeployed')().subscribe(_=>{
//   _.msg.data.value.kind==='N'&&_.msg.data.value.value.pkgInfos
// })
