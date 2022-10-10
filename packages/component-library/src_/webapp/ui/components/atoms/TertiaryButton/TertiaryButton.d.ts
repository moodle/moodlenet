import { FC, ReactNode } from 'react';
import './TertiaryButton.scss';
export declare type TertiaryButtonProps = {
    className?: string;
    disabled?: boolean;
    children: ReactNode;
    color?: 'black';
    onClick?(arg0?: unknown): unknown | any;
};
export declare const TertiaryButton: FC<TertiaryButtonProps>;
export default TertiaryButton;
//# sourceMappingURL=TertiaryButton.d.ts.map