import { FC } from 'react';
import { BrowserRouter } from 'react-router-dom';

export const RouterProvider: FC = ({ children }) => {
  return <BrowserRouter>{children}</BrowserRouter>;
};
