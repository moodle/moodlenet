import React from 'react';
import { render } from '@testing-library/react';

import Page from '../src/_initial_gen_layout_page/page';

describe('Page', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Page />);
    expect(baseElement).toBeTruthy();
  });
});
