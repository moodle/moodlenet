import { jsx as _jsx } from "react/jsx-runtime";
import './styles.scss';
export const SnackbarStack = ({ snackbarList, className, position, }) => {
    return (_jsx("div", { className: `snackbar-stack ${className} position-${position}`, children: snackbarList &&
            snackbarList.map((snackbar, i) => {
                return (_jsx("div", { className: "inside-snackbar", children: snackbar }, i));
            }) }));
};
export default SnackbarStack;
SnackbarStack.defaultProps = {
    position: 'bottom',
    className: '',
};
//# sourceMappingURL=SnackbarStack.js.map