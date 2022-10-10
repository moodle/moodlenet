import React, { ReactNode } from 'react';
import './Modal.scss';
export declare type ModalProps = {
    title?: string;
    actions?: React.ReactNode;
    style?: React.CSSProperties;
    className?: string;
    closeButton?: boolean;
    children?: ReactNode;
    onClose: () => void;
};
export declare const Modal: React.FC<ModalProps>;
export default Modal;
//# sourceMappingURL=Modal.d.ts.map