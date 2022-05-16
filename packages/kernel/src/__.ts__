import { Observable, Observer } from 'rxjs'
import { filter, take, timeout } from 'rxjs/operators'
import type { Message } from './types'
declare class DB {}
declare function db(): Promise<DB>
export type Hook = (pull: Observable<Message<any>>, push: Observer<Message<any>>, spawn: () => Hook) => void
export const hook: Hook = (pull, push) => {
  const dbP = db().finally(() => push.next('ready'))

  const x = pull.subscribe(message => {
    if (isSendTo(message, 'xxx@1.0.0::get/req')) {
      get(message.payload.a).then(
        async res => {
          push.next({ to: 'xxx@1.0.0::get/resp', payload: res })
        },
        e => {
          push.next({ to: 'xxx@1.0.0::get/err', payload: e })
        },
      )
    }
  })
  async function get(a) {
    const db = await dbP
    const res = db.get(a)
    return res
  }
  async function doGet(a: any) {
    const msg: Message<any> = {
      id: '',
      payload: { a },
      source: 'xxx@1.0.0::get/req',
      pointer: 'xxx@1.0.0::get/req',
      parentMsgId: '',
      ctx: {},
    }
    pull
      .pipe(
        filter<Message<1>>(_msg => _msg.parentMsgId === msg.id),
        take(1),
        timeout(1000),
      )
      .subscribe({
        next: v => push.next(v),
        error: e => push.next({ payload: { error: e } }),
        complete: () => push.complete(),
      })

    push.next(msg)
  }
}
