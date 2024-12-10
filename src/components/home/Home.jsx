import Header from "../header/Header";
import Gallery from "../gallery/Gallery";
import styles from "./home.module.css";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import {
  newPublicFolder,
  mailForRD,
  addMember,
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

  const [newName, setNewName] = useState("");
  var userFolderPath = "none";
  useEffect(() => {
    const unlisten = auth.onAuthStateChanged((user) => {
      if (user != null) {
        setUser(user.email);
        setMyGallery(user.email);
        userFolderPath = "users/" + mailForRD(user.email) + "/publicFolder";
        const starCountRef = ref(realTimeDatabase, userFolderPath);
        onValue(starCountRef, (snapshot) => {
          const updateAPF = [];
          const updatePF = [];
          const data = snapshot.val();
          for (const key in data) {
            if (data[key].role == "admin") {
              if (!adminPublicFolder.includes(key)) {
                // setAdminPublicFolder((old) => [...old, key]);
                updateAPF.push(key);
              }
            } else {
              if (!publicFolder.includes(key)) {
                // setPublicFolder((old) => [...old, key]);
                updatePF.push(key);
              }
            }
          }
          if (updateAPF.length == 0) {
            updateAPF.push("none");
          }
          if (updatePF.length == 0) {
            updatePF.push("none");
          }
          setAdminPublicFolder(updateAPF);
          setPublicFolder(updatePF);
          // console.log(adminPublicFolder);
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
    // console.log("setMyGallery");
    setFolder("users-private-folders/" + user + "/files");
  }
  function setPublicGallery(e) {
    // console.log("setGallery " + e);
    setFolder("users-shared-folders/" + e + "/files");
  }

  function createPublicFolder(user, newName) {
    if (newPublicFolder(user, newName)) {
      setPublicGallery(newName);
    }
  }

  const [member, setMember] = useState("");

  function testHome() {
    console.log(publicFolder);
  }

  function upMenu(folder) {
    const folderShortName = folder.substring(
      folder.indexOf("/") + 1,
      folder.lastIndexOf("/")
    );
    return (
      <div className={styles.softColorMember}>
        {adminPublicFolder.includes(folderShortName) ? (
          <div className={styles.memberDiv}>
            <input
              className={styles.memberInput}
              placeholder="friend email"
              onChange={(e) => {
                setMember(e.target.value);
              }}
            ></input>
            <button
              className={styles.memberButton}
              onClick={() => addMember(member, folderShortName)}
            >
              add
            </button>
          </div>
        ) : (
          ""
        )}
        <h3 className={styles.folderName}>
          {folderShortName == user ? "Personal gallery" : folderShortName}
        </h3>
        {adminPublicFolder.includes(folderShortName) ? (
          <div className={styles.memberDiv}>
            <input
              className={styles.memberInput}
              placeholder="friend email"
              onChange={(e) => {
                setMember(e.target.value);
              }}
            ></input>
            <button
              className={styles.memberButton}
              onClick={() => removeMember(member)}
            >
              remove
            </button>
          </div>
        ) : (
          ""
        )}
      </div>
    );
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
                  className={styles.newFolderDivMenu}
                  // onClick={() => newPublicFolder(user)}
                >
                  <div className={styles.softColor}>
                    <div className={styles.newFolderDivIn}>
                      <input
                        className={styles.newNameInput}
                        placeholder=" new folder name"
                        onChange={(e) => {
                          setNewName(e.target.value);
                        }}
                      ></input>
                      <button
                        className={styles.newFolderButton}
                        onClick={() => createPublicFolder(user, newName)}
                      >
                        create
                      </button>
                    </div>
                  </div>
                </SubMenu>
                <SubMenu label="My shared folder" className={styles.softColorR}>
                  {adminPublicFolder.map((e) => (
                    <MenuItem key={e} onClick={() => setPublicGallery(e)}>
                      {e}
                    </MenuItem>
                  ))}
                </SubMenu>
                <SubMenu label="Public folder" className={styles.softColor}>
                  {publicFolder.map((e) => (
                    <MenuItem key={e} onClick={() => setPublicGallery(e)}>
                      {e}
                    </MenuItem>
                  ))}
                </SubMenu>
              </SubMenu>
              <MenuItem> Profilo utente </MenuItem>
              <MenuItem onClick={() => testHome()}>test button</MenuItem>
            </Menu>
          </Sidebar>
          <div className={styles.mainBox}>
            {upMenu(folder)}

            <Gallery filter={filter} folder={folder} setFolder={setFolder} />
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
