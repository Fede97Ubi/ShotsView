import Header from "../header/Header";
import Gallery from "../gallery/Gallery";
import styles from "./home.module.css";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// import { Sidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import { auth, fireStorage } from "../firebase/firebase-config";

function Home() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("");

  const [user, setUser] = useState("ospite");
  const [folder, setFolder] = useState(null);
  useEffect(() => {
    const unlisten = auth.onAuthStateChanged((user) => {
      if (user != null) {
        setUser(user.email);
        setFolder("users-private-folders/" + user.email + "-id/files");
      } else {
        setUser("ospite");
        setFolder("public");
      }
    });
    return () => {
      unlisten();
    };
  }, []);

  return (
    <div className={styles.home}>
      {/* {CurrentUser()} servira'*/}
      <Header setFilter={setFilter} />
      <div className={styles.box}>
        {/* <Sidebar className={styles.sidebar}> ricordarsi di decommentare width in gallery.css
          <Menu>
            <MenuItem> Area privata </MenuItem>
            <SubMenu label="Cartelle condivise">
              <MenuItem> "nuova cartella condivisa" </MenuItem>
              <MenuItem> "shared-folder1" </MenuItem>
              <MenuItem> "shared-folder2" </MenuItem>
            </SubMenu>
            <MenuItem> Informazioni utente </MenuItem>
          </Menu>
        </Sidebar> */}
        {user == "ospite" ? (
          <p className={styles.messageToLogin}>
            effettua il login o la registrazione prima di caricare i tuoi file
          </p>
        ) : (
          <Gallery filter={filter} folder={folder} setFolder={setFolder} />
        )}
      </div>
    </div>
  );
}

export default Home;
