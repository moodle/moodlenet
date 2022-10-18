import { FC, ReactNode } from 'react';
import './PrimaryButton.scss';
export declare type PrimaryButtonProps = {
    onClick?(arg0?: unknown): unknown | any;
    className?: string;
    disabled?: boolean;
    color?: '' | 'green' | 'red' | 'grey' | 'blue' | 'card' | 'light-gray';
    onHoverColor?: '' | 'green' | 'orange' | 'red' | 'green';
    noHover?: boolean;
    children?: ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;
export declare const PrimaryButton: FC<PrimaryButtonProps>;
export default PrimaryButton;
//# sourceMappingURL=PrimaryButton.d.ts.map