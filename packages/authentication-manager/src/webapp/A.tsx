import lib from 'moodlenet-react-app-lib'
import { FC } from 'react'
lib
  .getExposed('moodlenet-pri-http')
  .sub(
    'moodlenet-core',
    '0.1.10',
  )('ext/listDeployed')()
  .subscribe((fromAuth: any) => console.log({ fromAuth }))

const A: FC = () => {
  const [params] = lib.router.useSearchParams()
  const xParam = params.get('x')
  const testStr = lib.useTest('aaa').join(':::')
  return (
    <div>
      <h2>
        AAA {testStr} ** {xParam}
      </h2>
    </div>
  )
}

export default A
