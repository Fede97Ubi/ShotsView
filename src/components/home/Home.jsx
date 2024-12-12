import Header from "../header/Header";
import Gallery from "../gallery/Gallery";
import styles from "./home.module.css";
// import trashbin from "/src/icon/trashbin-min.png";
// import backspace from "/src/icon/backspace.png";

import { useEffect, useState } from "react";
import { Sidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import {
  newPublicFolder,
  mailForRD,
  addMember,
  removeMember,
  exitToFolder,
} from "../realtimeDatabase/RealtimeDatabase";
import { auth, realTimeDatabase } from "../firebase/firebase-config";
import { ref, onValue, off, remove } from "firebase/database";
import { deleteFolder } from "../firebaseStorage/firebaseStorage";
import { notifierRequest } from "../notifier/Notifier";

function Home() {
  const [filter, setFilter] = useState("");

  const [user, setUser] = useState("ospite");
  const [folder, setFolder] = useState(null);

  const [adminPublicFolder, setAdminPublicFolder] = useState([]);
  const [publicFolder, setPublicFolder] = useState([]);

  const [newName, setNewName] = useState("");
  var userFolderPath = "none";

  window.addEventListener("offline", (e) => {
    console.log("offline");
    notifierRequest("You are offline");
  });

  window.addEventListener("online", (e) => {
    console.log("online");
    window.location.reload();
    notifierRequest("You return online");
  });

  useEffect(() => {
    const unlisten = auth.onAuthStateChanged((user) => {
      if (user != null) {
        setUser(user.email);
        setMyGallery(user.email);
        userFolderPath = "users/" + mailForRD(user.email) + "/publicFolder";
        const starCountRef = ref(realTimeDatabase, userFolderPath);
        const notificationPath =
          "users/" + mailForRD(user.email) + "/notification";
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
            updateAPF.push("Non hai gallerie create");
          }
          if (updatePF.length == 0) {
            updatePF.push("Non hai gallerie condivise");
          }
          setAdminPublicFolder(updateAPF);
          setPublicFolder(updatePF);
          // console.log(adminPublicFolder);
        });
        const notificationRef = ref(realTimeDatabase, notificationPath);
        onValue(notificationRef, (snapshot) => {
          // aggiungere cosa fare quando si riceve una notifica -----------------------------------------------------------------------------------------------------
          const data = snapshot.val();
          for (const newNotify in data) {
            console.log(data[newNotify].text);
            if (newNotify != undefined) {
              notifierRequest(data[newNotify].text);
              // console.log(notificationPath + "/" + newNotify  );
            }
          }
          remove(ref(realTimeDatabase, notificationPath)); // da finire di testare-----------------------------------------------------------------------------------------------------
        });
      } else {
        setUser("ospite");
        setFolder("public");
        const starCountRef = ref(realTimeDatabase, userFolderPath);
        off(starCountRef, (snapshot) => {
          // console.log("chiusura listner");
        });
        const notifierCloser = ref(realTimeDatabase, notificationPath);
        off(notifierCloser, (snapshot) => {
          // console.log("chiusura listner notifiche");
        });
        setPublicFolder([]);
      }
    });
    return () => {
      unlisten();
    };
  }, []);

  function setMyGallery(user) {
    // console.log("setMyGallery");
    setFolder("users-private-folders/" + user + "/files");
  }
  function setPublicGallery(e) {
    // console.log("setGallery " + e);
    if (e != "Non hai gallerie condivise" && e != "Non hai gallerie create") {
      setFolder("users-shared-folders/" + e + "/files");
    }
  }

  function createPublicFolder(user, newName) {
    if (newPublicFolder(user, newName) == undefined) {
      setPublicGallery(newName);
    }
  }

  const handleEnterKeyCreatePublicFolder = (e) => {
    if (e.key === "Enter") {
      createPublicFolder(user, newName);
    }
  };

  const [member, setMember] = useState("");

  function exitToFolderMain(e, user) {
    exitToFolder(e, user);
    if (e == folder) {
      setMyGallery(user);
    }
  }

  function testHome() {
    deleteFolder("users-shared-folders/ciao/files");
  }

  function upMenu(folder) {
    const folderShortName = folder.substring(
      folder.indexOf("/") + 1,
      folder.lastIndexOf("/")
    );

    const handleEnterKeyAddMember = (e) => {
      if (e.key === "Enter") {
        console.log("addMember " + member + " in " + folderShortName);
        addMember(member, folderShortName);
      }
    };

    const handleEnterKeyRemoveMember = (e) => {
      if (e.key === "Enter") {
        removeMember(member, folderShortName);
      }
    };
    return (
      <div className={styles.softColorMember}>
        {adminPublicFolder.includes(folderShortName) ? (
          <div className={styles.memberDiv} onKeyDown={handleEnterKeyAddMember}>
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
          <div
            className={styles.memberDiv}
            onKeyDown={handleEnterKeyRemoveMember}
          >
            <input
              className={styles.memberInput}
              placeholder="friend email"
              onChange={(e) => {
                setMember(e.target.value);
              }}
            ></input>
            <button
              className={styles.memberButton}
              onClick={() => removeMember(member, folderShortName)}
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
                    <div
                      className={styles.newFolderDivIn}
                      onKeyDown={handleEnterKeyCreatePublicFolder}
                    >
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
                      <div className={styles.folderDescription}>
                        {e == "Non hai gallerie create" ? (
                          <></>
                        ) : (
                          <button
                            className={styles.buttonTrash}
                            id="del"
                            onClick={() => exitToFolderMain(e, user)}
                          >
                            <div className={styles.imageTrashbin}>
                              <img src={"/icon/trashbin-min.png"}></img>
                            </div>
                          </button>
                        )}
                        {e}
                      </div>
                    </MenuItem>
                  ))}
                </SubMenu>
                <SubMenu label="Public folder" className={styles.softColor}>
                  {publicFolder.map((e) => (
                    <MenuItem key={e} onClick={() => setPublicGallery(e)}>
                      <div className={styles.folderDescription}>
                        {e == "Non hai gallerie condivise" ? (
                          <></>
                        ) : (
                          <button
                            className={styles.buttonTrash}
                            id="del"
                            onClick={() => exitToFolderMain(e, user)}
                          >
                            <div className={styles.imageTrashbin}>
                              <img src={"/icon/backspace.png"}></img>
                            </div>
                          </button>
                        )}
                        {e}
                      </div>
                    </MenuItem>
                  ))}
                </SubMenu>
              </SubMenu>
              {/* <MenuItem> Profilo utente </MenuItem>
              <MenuItem onClick={() => testHome()}>test button</MenuItem> */}
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
