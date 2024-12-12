import { CurrentUser } from "../auth/AuthPage";

export default function FormFilter({ setFilter }) {
  const user = CurrentUser();
  console.log("reload");
  if (user == "ospite") {
    return;
  }
  if (user == "Initialising User...") {
    return;
  }
  if (user == "Error currentUser") {
    return;
  }
  return (
    <div id="test1" className={styles.userDiv}>
      <input
        id="test"
        // className={styles.input}
        placeholder="search"
        onChange={(e) => {
          setFilter(e.target.value);
        }}
      ></input>
    </div>
  );
}
