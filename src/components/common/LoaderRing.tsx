import styles from "./LoaderRing.module.scss";

const LoaderRing: React.FC<{ className: string }> = (props) => {
  return (
    <div className={`${styles.loader_container} ${props.className}`}>
      <div className={styles.lds_ellipsis}>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
};

export default LoaderRing;
