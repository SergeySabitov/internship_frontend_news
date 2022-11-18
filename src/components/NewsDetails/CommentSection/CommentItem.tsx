import { useEffect, useState } from "react";
import { commentType } from "../../types";
import Comments from "./Comments";
import styles from "./CommentItem.module.scss";
import IonIcon from "@reacticons/ionicons";

let commentWasInserted = false;

const CommentItem: React.FC<{
  commentItem: commentType;
  marginLeft: number;
}> = (props) => {
  const [showKids, setShowKids] = useState(false);
  let isThereAnyKids = false;
  if (props.commentItem.kids && props.commentItem.kids.length > 0) {
    isThereAnyKids = true;
  }
  useEffect(() => {
    commentWasInserted = true;
    let c = document.getElementById(`${props.commentItem.id}`);
    if (c && c?.textContent?.split("").length === 0)
      c.insertAdjacentHTML("afterbegin", props.commentItem.text);
  }, []);

  return (
    <div className={styles.comment}>
      <div
        onClick={() => {
          setShowKids((prev) => !prev);
        }}
      >
        <p className={styles.author}>{props.commentItem.by}</p>
        <p id={`${props.commentItem.id}`} className={styles.commentText}></p>
        {isThereAnyKids && (
          <div className={styles.subComments}>
            <IonIcon name="return-down-forward" />
            {!showKids ? <span className={styles.threeDote}>...</span> : null}
          </div>
        )}
      </div>
      {showKids && isThereAnyKids && props.commentItem.kids && (
        <Comments ids={props.commentItem.kids} marginLeft={3} />
      )}
    </div>
  );
};

export default CommentItem;
