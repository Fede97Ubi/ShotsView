import Header from "../header/Header";
import Gallery from "../gallery/Gallery";
import styles from "./home.module.css";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import {
  newPublicFolder,
  test,
  folderSet,
  mailForRD,
} from "../realtimeDatabase/RealtimeDatabase";
import { auth, realTimeDatabase } from "../firebase/firebase-config";
import { ref, onValue, off } from "firebase/database";

function Home() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("");

  const [user, setUser] = useState("ospite");
  const [folder, setFolder] = useState(null);

  const [adminPublicFolder, setAdminPublicFolder] = useState([]);
  const [publicFolder, setPublicFolder] = useState([]);
  var userFolderPath = "test";
  useEffect(() => {
    const unlisten = auth.onAuthStateChanged((user) => {
      if (user != null) {
        setUser(user.email);
        setMyGallery(user.email);
        userFolderPath = "users/" + mailForRD(user.email) + "/publicFolder";
        const starCountRef = ref(realTimeDatabase, userFolderPath);
        onValue(starCountRef, (snapshot) => {
          const data = snapshot.val();
          setPublicFolder([]);
          for (const key in data) {
            if (data[key].role == "admin") {
              if (!adminPublicFolder.includes(key)) {
                setAdminPublicFolder((old) => [...old, key]);
              }
            } else {
              if (!publicFolder.includes(key)) {
                setPublicFolder((old) => [...old, key]);
              }
            }
          }
        });
      } else {
        setUser("ospite");
        setFolder("public");
        const starCountRef = ref(realTimeDatabase, userFolderPath);
        off(starCountRef, (snapshot) => {
          // console.log("chiusura listner");
        });
        setPublicFolder([]);
      }
    });
    return () => {
      unlisten();
    };
  }, []);

  // FUNZIONA
  // function readTest3() {
  //   const path = "users/test6@test%com/publicFolder";
  //   const starCountRef = ref(realTimeDatabase, path);
  //   onValue(starCountRef, (snapshot) => {
  //     const data = snapshot.val();
  //     // console.log("update file: " + data);s
  //     for (const key in data) {
  //       if (!publicFolder.includes(data[key].folderName)) {
  //         setPublicFolder((old) => [...old, data[key].folderName]);
  //       }
  //     }
  //     console.log(publicFolder);
  //     console.log(folderSet);
  //   });
  // }

  // useEffect(() => {
  //   setPublicFolder([]);
  //   for (const key in folderSet) {
  //     if (!publicFolder.includes(folderSet[key].folderName)) {
  //       setPublicFolder((old) => [...old, folderSet[key].folderName]);
  //     }
  //   }
  // }, [folderSet]);

  function setMyGallery(user) {
    console.log("setMyGallery");
    setFolder("users-private-folders/" + user + "-id/files");
  }
  function setPublicGallery(e) {
    console.log("setGallery " + e);
    setFolder("users-shared-folders/" + e + "-id/files");
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
            <Menu className={styles.Menu}>
              <MenuItem onClick={() => setMyGallery(user)}>
                Personal gallery
              </MenuItem>
              <SubMenu label="Shared folders">
                <SubMenu
                  label="Create new shared folders"
                  className={styles.darkBackgroud}
                  // onClick={() => newPublicFolder(user)}
                >
                  <MenuItem> none </MenuItem>
                </SubMenu>
                <MenuItem onClick={() => readTest3()}> readFolder </MenuItem>
                <SubMenu label="My shared folder">
                  {adminPublicFolder.map((e) => (
                    <MenuItem key={e} onClick={() => setPublicGallery(e)}>
                      {e}
                    </MenuItem>
                  ))}
                </SubMenu>
                <SubMenu label="Public folder">
                  {publicFolder.map((e) => (
                    <MenuItem key={e} onClick={() => setPublicGallery(e)}>
                      {e}
                    </MenuItem>
                  ))}
                </SubMenu>
              </SubMenu>
              <MenuItem> Profilo utente </MenuItem>
            </Menu>
          </Sidebar>
          <div className={styles.mainBox}>
            <div>ciaooooo</div>
            <Gallery filter={filter} folder={folder} setFolder={setFolder} />
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
