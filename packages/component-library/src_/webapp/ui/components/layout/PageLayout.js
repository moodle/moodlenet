import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from 'react/jsx-runtime'
import './PageLayout.scss'
const PageLayout = ({ title, children }) => {
  return _jsxs(_Fragment, {
    children: [
      _jsx('div', { title: title }),
      _jsx('div', { className: 'page-content', children: children }),
    ],
  })
}
export default PageLayout
//# sourceMappingURL=PageLayout.js.map
