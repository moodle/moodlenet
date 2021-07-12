import { Trans } from '@lingui/macro';
import { FC, ReactNode } from "react";
import "./styles.scss";

export type FilterCardProps = {
    className: string,
    title: string,
    content: ReactNode[]
}

export const FilterCard: FC <FilterCardProps> = ({
    className,
    content,
    title,
}) => {

  return (
    <div className={"list-card " + className}>
        <div className="title"><Trans>{title}</Trans></div>
        <div className="content">{content}</div>
    </div>
  );
}

export default FilterCard;
