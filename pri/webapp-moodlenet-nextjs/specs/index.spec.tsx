import { render } from '@testing-library/react'

import Page from '../src/app/layout'

describe('Page', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Page />)
    expect(baseElement).toBeTruthy()
  })
})
