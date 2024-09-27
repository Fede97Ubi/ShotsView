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

        // questo è il meccanismo che ha riscontrato il problema delle cors policies
        // var userInfoPath =
        //   "users-private-folders/" + user.email + "-id/userInfo.json";
        // const userInfo = ref(fireStorage, userInfoPath);
        // getDownloadURL(userInfo)
        //   .then((url) => {
        //     console.log(url);
        //     // const xhr = new XMLHttpRequest();
        //     // xhr.responseType = "blob";
        //     // xhr.onload = (event) => {
        //     //   const blob = xhr.response;
        //     // };
        //     // xhr.open("GET", url);
        //     // xhr.send();
        //     // xhr.onprogress = function (event) {
        //     //   // triggers periodically
        //     //   // event.loaded - how many bytes downloaded
        //     //   // event.lengthComputable = true if the server sent Content-Length header
        //     //   // event.total - total number of bytes (if lengthComputable)
        //     //   alert(`Received ${event.loaded} of ${event.total}`);
        //     // };
        //   })
        //   .catch((err) => {
        //     console.log(
        //       // si verifica anche quando viene fatta la registrazione
        //       // perchè ancora il file non è stato creato
        //       "ERRORE (non considerare in fase di registrazione), file non trovato, " +
        //         "oppure errore nella logica di sviluppo o account troppo vecchio"
        //     );
        //     setFolder("public");
        //   });
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
