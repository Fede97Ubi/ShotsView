import styles from "./sidebar.module.css";
import profileImageDrop from "./user.png";
import house from "../../icon/house-simple-bold.png";
import arrow from "../../icon/caret-down-bold.png";
import user from "../../icon/user-bold.png";
import fileText from "../../icon/file-text-bold.png";
import chart from "../../icon/chart-bar-bold.png";

export default function Sidebar() {
  return (
    <div className={styles.sidebarDiv}>
      <div className={styles.container}>
        <div className={styles.sidebar}>
          <div className={styles.head}>
            <div className={styles.userImg}>
              <img src={profileImageDrop} alt=""></img>
            </div>
            <div className={styles.userDetail}>
              <p className={styles.title}>user title</p>
              <p className={styles.name}>user name</p>
            </div>
          </div>
          <div className={styles.nav}>
            <div className={styles.menu}>
              <p className={styles.title}>main</p>
              <ul>
                <li>
                  <a href="#">
                    <img src={house} className={styles.icon}></img>
                    <span className={styles.text}>Dashboard</span>
                  </a>
                </li>
                <li>
                  <a href="#">
                    <img src={user} className={styles.icon}></img>
                    <span className={styles.text + " " + styles.smallText}>
                      Audience
                    </span>
                    <img src={arrow} className={styles.arrow}></img>
                  </a>
                  <ul className={styles.subMenu}>
                    <li>
                      <a href="#">
                        <span className={styles.text}>Users</span>
                      </a>
                    </li>
                    <li>
                      <a href="#">
                        <span className={styles.text}>subscribers</span>
                      </a>
                    </li>
                  </ul>
                </li>

                <li className="active">
                  <a href="#">
                    <img src={fileText} className={styles.icon}></img>
                    <span className={styles.text}>Post</span>
                  </a>
                </li>
                <li className="active">
                  <a href="#">
                    <img src={chart} className={styles.icon}></img>
                    <span className={styles.text}>Income</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
