import { useEffect, useState } from "react";
import LoaderRing from "../../common/LoaderRing";
import { fetchItemsByIds } from "../../exportedFunctions";
import { commentType } from "../../types";
import CommentItem from "./CommentItem";
import styles from "./Comments.module.scss";
import RingStyles from "../../common/LoaderRing.module.scss";
const URL = " https://hacker-news.firebaseio.com";

const Comments: React.FC<{
  ids: number[];
  marginLeft: number;
}> = (props) => {
  // marginLeft - отступ в зависимости от уровня списка комментариев
  const [fetchCommentsError, setFetchCommentsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [comments, setComments] = useState<commentType[]>([]);

  let commentsTSX = <></>;
  if (comments.length > 0) {
    commentsTSX = (
      <ul className={styles.ul}>
        {comments.map((el) => {
          return (
            <li key={el.id}>
              <CommentItem commentItem={el} marginLeft={props.marginLeft} />
            </li>
          );
        })}
      </ul>
    );
  }

  const commentsHandler = (comments: commentType[]) => {
    setComments(comments);
    setIsLoading(false);
    setFetchCommentsError(false);
  };

  const reloadComments = () => {
    setIsLoading(true);
    fetchItemsByIds(URL, props.ids, commentsHandler, () => {
      setFetchCommentsError(true);
      setIsLoading(false);
    });
  };
  useEffect(() => {
    reloadComments();
  }, [props.ids]);
  return (
    <section
      style={{
        marginLeft: `${props.marginLeft}%`,
        width: `${100 - props.marginLeft}%`,
      }}
    >
      {isLoading ? (
        <LoaderRing
          className={`${RingStyles.loading} ${RingStyles.comments}`}
        />
      ) : null}
      {!isLoading || comments.length > 0 ? commentsTSX : null}
      {fetchCommentsError && !isLoading ? (
        <p>
          <span>Failed to load comments</span>
          <span>
            <button
              className={styles.reloadAfterError}
              onClick={() => reloadComments()}
            >
              Try again
            </button>
          </span>
        </p>
      ) : null}
    </section>
  );
};

export default Comments;
