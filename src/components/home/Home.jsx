import Header from "../header/Header";
import Gallery from "../gallery/Gallery";
import styles from "./home.module.css";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import { newPublicFolder } from "../realtimeDatabase/RealtimeDatabase";
import { auth } from "../firebase/firebase-config";

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

  function createNewFolder() {
    const userId = 10;
    const name = "nomediprova";
    const email = "testemaildiprova";
    set(ref(realTimeDatabase, "users/" + userId), {
      username: name,
      email: email,
      // profile_picture : imageUrl
    });
  }

  return (
    <div className={styles.home}>
      {/* {CurrentUser()} servira'*/}
      <Header setFilter={setFilter} />
      {user == "ospite" ? (
        <p className={styles.messageToLogin}>
          effettua il login o la registrazione prima di caricare i tuoi file
        </p>
      ) : (
        <div className={styles.box}>
          {/*senza sidebar modificare with in gallery.css*/}
          <Sidebar className={styles.sidebar}>
            <Menu>
              <MenuItem
                onClick={() =>
                  setFolder("users-private-folders/" + user.email + "-id/files")
                }
              >
                Galleria privata
              </MenuItem>
              <MenuItem>
                <div id="postElement"></div>
              </MenuItem>
              <SubMenu label="Cartelle condivise">
                <MenuItem onClick={() => createNewFolder()}>
                  {" "}
                  "crea nuova cartella condivisa"{" "}
                </MenuItem>
                <MenuItem onClick={() => readFolder()}> "readFolder" </MenuItem>
                <MenuItem onClick={() => newPublicFolder()}>
                  "crea nuova cartella condivisa"
                </MenuItem>
              </SubMenu>
              <MenuItem> Profilo utente </MenuItem>
            </Menu>
          </Sidebar>
          <Gallery filter={filter} folder={folder} setFolder={setFolder} />
        </div>
      )}
    </div>
  );
}

export default Home;
