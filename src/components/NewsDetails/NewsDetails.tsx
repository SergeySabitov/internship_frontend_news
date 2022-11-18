import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux-store/ReduxStore";
import styles from "./NewsDetails.module.scss";
import Comments from "./CommentSection/Comments";
import { fetchItemsByIds } from "../exportedFunctions";
import { newsType } from "../types";
import { newsActions } from "../redux-store/NewsSlice";
import LoaderRing from "../common/LoaderRing";
import RingStyles from "../common/LoaderRing.module.scss";
import { useEffect, useState } from "react";
import IonIcon from "@reacticons/ionicons";
import { fromUnixTimeToDate } from "../exportedFunctions";
import { Navigate } from "react-router-dom";
import { Link } from "react-router-dom";
const URL = " https://hacker-news.firebaseio.com";

let newsTextWasInserted = false;

// import { newsActions } from "../redux-store/NewsSlice";

const NewsDetails: React.FC<{}> = (props) => {
  const params = useParams();
  const dispatch = useDispatch();
  const newsState = useSelector((state: RootState) => state.news);
  const [isReloading, setIsReloading] = useState(false);

  let currNewsItem = newsState.news.find(
    (el) => el.id.toString() === params.newsId
  );

  const reloadNewsItem = () => {
    const updateNewsInfo = (newsItem: newsType[]) => {
      if (newsItem && newsItem[0].descendants > currNewsItem!.descendants)
        dispatch(newsActions.updateItem({ newNews: newsItem[0] }));
      setIsReloading(false);
    };
    setIsReloading(true);
    fetchItemsByIds(URL, [currNewsItem!.id], updateNewsInfo, () => {
      setIsReloading(false);
    });
  };

  useEffect(() => {
    if (currNewsItem?.text) {
      newsTextWasInserted = true;
      let c = document.getElementById(`${currNewsItem.id}`);
      if (c && c?.textContent?.split("").length === 0)
        c.insertAdjacentHTML("afterbegin", currNewsItem.text);
    }
  }, []);
  return (
    <section className={styles.newsDetails}>
      <div className={styles.back_container}>
        <Link to="/">
          <IonIcon
            name="chevron-back-circle"
            style={{ width: "30px", height: "30px", marginRight: "8px" }}
          />
          <span style={{ fontStyle: "italic" }}> Back</span>
        </Link>
      </div>
      <div className={styles.news}>
        <div className={styles.header}>
          <span className={styles.author}>
            <span>Author</span>{" "}
            <span>{currNewsItem?.by ? currNewsItem?.by : "not found"}</span>{" "}
          </span>
          <span>
            {currNewsItem?.time ? fromUnixTimeToDate(currNewsItem.time) : null}
          </span>
        </div>
        <h2>{currNewsItem?.title}</h2>

        {currNewsItem?.text ? (
          <p className={styles.text} id={`${currNewsItem.id}`}></p>
        ) : null}
        <div className={styles.footer}>
          <div className={styles.commentTitle}>
            <span>Comments({currNewsItem?.descendants})</span>
            <span className={styles.reload} onClick={reloadNewsItem}>
              <IonIcon
                name="reload-outline"
                style={{ width: "20px", height: "20px" }}
              />
            </span>
          </div>
          {currNewsItem?.url ? (
            <a href={`${currNewsItem.url}`}>
              <span className={styles.link}>link to the news</span>
            </a>
          ) : null}
        </div>
      </div>
      <div className={styles.comments}>
        {isReloading ? (
          <LoaderRing
            className={`${RingStyles.loading} ${RingStyles.comments}`}
          />
        ) : null}
        {currNewsItem!.descendants > 0 && currNewsItem?.kids ? (
          <Comments ids={currNewsItem.kids} marginLeft={0} />
        ) : (
          <p>Empty</p>
        )}
      </div>
    </section>
  );
};

export default NewsDetails;
