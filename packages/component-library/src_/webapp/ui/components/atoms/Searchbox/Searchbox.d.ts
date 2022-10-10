import { Dispatch, FC, SetStateAction } from 'react';
import './Searchbox.scss';
export declare type SearchboxProps = {
    placeholder: string;
    size?: 'small' | 'big';
    setIsSearchboxInViewport?: Dispatch<SetStateAction<boolean>>;
    marginTop?: number;
};
export declare const Searchbox: FC<SearchboxProps>;
export default Searchbox;
//# sourceMappingURL=Searchbox.d.ts.map