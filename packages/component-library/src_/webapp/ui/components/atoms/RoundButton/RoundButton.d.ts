import { FC, ReactNode } from 'react';
import './RoundButton.scss';
export declare type RoundButtonProps = {
    onClick?(arg0: unknown): unknown;
    onKeyUp?: {
        key: string;
        func: () => void;
    };
    className?: string;
    tabIndex?: number;
    type?: 'cross' | 'trash' | 'edit' | 'refresh' | 'search' | 'file' | 'upload';
    color?: 'gray' | 'red';
    onHoverColor?: 'gray' | 'red' | 'fill-red';
    abbrTitle?: string;
    icon?: ReactNode;
};
export declare const RoundButton: FC<RoundButtonProps>;
export default RoundButton;
//# sourceMappingURL=RoundButton.d.ts.map