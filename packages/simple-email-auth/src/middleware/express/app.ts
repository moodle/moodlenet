// import csrf from 'csurf'
import { Shell } from '@moodlenet/core'

export function prepareApp(shell: Shell<any>, app: any) {
  // app.use(csrf())
  app.get('/confirm', async (req:any, res:any, next:any) => {
   console.log('email has confirm xxxxxxxxxxxxx')
  })


}
