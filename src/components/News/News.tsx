import { Link } from "react-router-dom";
import styles from "./News.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { newsActions } from "../redux-store/NewsSlice";
import { RootState } from "../redux-store/ReduxStore";
import NewsItem from "./NewsItem";
import gif from "../common/cat2.1.gif";
import RingStyles from "../common/LoaderRing.module.scss";
import LoaderRing from "../common/LoaderRing";
const News: React.FC<{ updateNews: () => void; fetchDataError: boolean }> = (
  props
) => {
  const dispatch = useDispatch();
  const newsState = useSelector((state: RootState) => state.news);
  let content = <p>Not found(</p>;
  if (newsState.news.length > 0) {
    content = (
      <ul className={styles.ul}>
        {newsState.news.map((el) => {
          return (
            <li key={el.id}>
              <Link to={`/news-item/${el.id}`} className={styles.link}>
                <NewsItem newsItem={el} />
              </Link>
            </li>
          );
        })}
      </ul>
    );
  }
  return (
    <div className={styles.news}>
      <h2
        onClick={() => {
          if (!newsState.isLoading) props.updateNews();
        }}
        title="update"
      >
        NEWS
      </h2>
      <div className={styles.news_block}>
        {newsState.isLoading && (
          <div className={styles.loader}>
            <img src={gif} />
          </div>
        )}
        {(!newsState.isLoading || newsState.news.length > 0) &&
        !props.fetchDataError
          ? content
          : null}
        {props.fetchDataError ? <p>Failed to fetch news</p> : null}
      </div>
    </div>
  );
};

export default News;
