import { FC } from 'react';
import '../../../styles/tags.css';
import "./styles.scss";

export type CollectionCardProps = {
  imageUrl: string
  title:string
  fontSize?: string
}

export const CollectionCard:FC<CollectionCardProps>=({ imageUrl, title, fontSize }) =>{
  const background = {
    backgroundImage: "url(" + imageUrl + ")",
    backgroundSize: "cover"
  }
  
  return (
    <div className="collection-card" style={background}>
      <div className="title" style={{fontSize: fontSize}}>
      <abbr title={title}>{title}</abbr>
      </div>
    </div>
  );
}

CollectionCard.defaultProps = {
  fontSize: '12px'
}

