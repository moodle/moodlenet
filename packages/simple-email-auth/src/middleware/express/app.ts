// import csrf from 'csurf'

export function prepareApp(app: any) {
  // app.use(csrf())
  app.get('/confirm', async (_: any, res: any) => {
    console.log('email has confirm xxxxxxxxxxxxx')
    res.send('bravo ciccio')
  })
}
