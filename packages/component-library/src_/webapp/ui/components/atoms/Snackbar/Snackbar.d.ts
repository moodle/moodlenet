import React, { CSSProperties, ReactNode } from 'react';
import './styles.scss';
export declare type SnackbarProps = {
    actions?: ReactNode;
    icon?: ReactNode;
    showIcon?: boolean;
    buttonText?: string;
    style?: CSSProperties;
    type?: 'error' | 'warning' | 'info' | 'success';
    className?: string;
    autoHideDuration?: number;
    waitDuration?: number;
    position?: 'top' | 'bottom';
    showCloseButton?: boolean;
    children?: ReactNode;
    onClose?: () => void;
};
export declare const Snackbar: React.FC<SnackbarProps>;
export default Snackbar;
//# sourceMappingURL=Snackbar.d.ts.map