import { newsType } from "../types";
import styles from "./NewsItem.module.scss";
import IonIcon from "@reacticons/ionicons";
import { fromUnixTimeToDate } from "../exportedFunctions";

const NewsItem: React.FC<{ newsItem: newsType }> = (props) => {
  return (
    <div className={styles.news_container}>
      <div className={styles.mainInfo}>
        <h3>{props.newsItem.title}</h3>
        <span>
          <IonIcon name="heart" className={styles.heartIcon} />
          <span>{props.newsItem.score}</span>
        </span>
      </div>
      <div className={styles.footerInfo}>
        <span>by {props.newsItem.by}</span>
        <span>{fromUnixTimeToDate(props.newsItem.time)}</span>
      </div>
    </div>
  );
};

export default NewsItem;
