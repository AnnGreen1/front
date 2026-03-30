import styles from "./coustom.module.css";

function CSS() {
  const styleObj = {
    color: "hotpink",
    fontSize: 20,
  };

  return (
    <>
      <div>
        <span>没有样式</span>
        <span style={{ color: "hotpink" }}>传统css内联样式</span>
        <span style={styleObj}>具有样式</span>
      </div>
      <button className={`${styles.button} ${styles.confirm}`}>confirm</button>
      <button className={`${styles.button} ${styles.cancel}`}>cancel</button>
    </>
  );
}

export default CSS;
