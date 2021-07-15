import { Trans } from '@lingui/macro';
import { FC, useState } from "react";
import CheckButton, { SortState } from '../../atoms/CheckButton/CheckButton';
import "./styles.scss";

export type SortCardProps = {
    className: string,
    title: string,
    content: [string, SortState][]
}

export const SortCard: FC <SortCardProps> = ({
    className,
    content,
    title,
}) => {

  const [currentSort, setCurrentSort] = useState(content[1] ? content[1][0] : 'none') 

  const onClick: (label: string) => void = (label) => {
    setCurrentSort(label)
  }

  const inContent = content.map(([label, state])=>(
  <CheckButton label={label} state={state} active={currentSort===label ? true : false} clicked={onClick}/>
  ))

  return (
    <div className={"sort-card " + className}>
        <div className="title"><Trans>{title}</Trans></div>
        <div className="content">{inContent}</div>
    </div>
  );
}

export default SortCard;
