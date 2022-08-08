// import csrf from 'csurf'
import { Shell } from '@moodlenet/core'

export function prepareApp(_: Shell<any>, app: any) {
  // app.use(csrf())
  app.get('/confirm', async (_:any, __:any) => {
   console.log('email has confirm xxxxxxxxxxxxx')
  })


}
