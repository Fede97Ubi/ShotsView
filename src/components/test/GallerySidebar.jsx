import Sidebar from "../gallery/Sidebar";
import styles from "./gallery.module.css";
import trashbin from "../../icon/trashbin.png";
import plus from "../../icon/plus.png";
import {
  uploadBytes,
  deleteObject,
  getDownloadURL,
  listAll,
  ref,
} from "firebase/storage";
import { fireStorage, auth } from "../firebase/firebase-config";
import { useEffect, useState } from "react";
import { useRef } from "react"; //////////// solo per <React.StrictMode> vedi sotto
import { CurrentUser, useAuth } from "../auth/AuthPage";
import { onAuthStateChanged } from "firebase/auth";
// import { CurrentUser } from "../auth/AuthPage"; // servira' per l'autenticazione

export default function Gallery({ filter }) {
  const [photoGallery, setPhotoGallery] = useState([]);

  const [authUser, setAuthUser] = useState(null);

  // const [termsValidation, setTermsValidation] = useState(false);
  // upload
  const [img, setImg] = useState(null);
  function selectNewFile(e) {
    for (var i = 0; i < e.target.files.length; i++) {
      var imgFile = e.target.files[i];
      uploadImageAsPromise(imgFile);
    }
  }

  function uploadImageAsPromise(imgFile) {
    return new Promise(function (resolve, reject) {
      if (imgFile == null) {
        console.log("nessun immagine caricata");
      } else {
        if (authUser != null) {
          var imgPath =
            "users-private-folders/" +
            authUser.email +
            "-id/files/" +
            imgFile.name;
          // console.log("imgPath: " + imgPath);
          var imgRef = ref(fireStorage, imgPath);

          //Upload v2
          var task = uploadBytes(imgRef, imgFile, "metadataaaaaaa").then(
            (snaphshot) => {
              getDownloadURL(snaphshot.ref).then((url) => {
                setPhotoGallery((data) => [...data, url]);
              });
            }
          );
        } else {
          console.log("authUser == null ");
        }
      }
    });
  }

  //----------------------------------------------------------------------

  //verifica utente collegato e caricamento galleria
  useEffect(() => {
    const unlisten = auth.onAuthStateChanged((authUser) => {
      setPhotoGallery([]);
      if (authUser != null) {
        setAuthUser(authUser);
        listAll(
          // ref(fireStorage, "fireImage")
          ref(
            fireStorage,
            "users-private-folders/" + authUser.email + "-id/files"
          )
        ).then((allFile) => {
          allFile.items.forEach((val) =>
            getDownloadURL(val).then((url) => {
              setPhotoGallery((data) => [...data, url]);
            })
          );
        });
      } else {
        setAuthUser(null);
      }
    });
    return () => {
      unlisten();
    };
  }, []);

  //view uploaded file v1
  // const initialized = useRef(false);
  // useEffect(() => {
  //   if (!initialized.current) {
  //     //////////// questa sezione di codice serve solo perchè il progetto viene sviluppato
  //     initialized.current = true; //////////// in <React.StrictMode> quindi avrei le immagini duplicate,
  //     listAll(
  //       ref(fireStorage, "fireImage")
  //       // ref(
  //       //   fireStorage,
  //       //   "users-private-folders/" + authUser.email + "-id/files"
  //       // )
  //     ).then((allFile) => {
  //       allFile.items.forEach((val) =>
  //         getDownloadURL(val).then((url) => {
  //           setPhotoGallery((data) => [...data, url]);
  //         })
  //       );
  //     });
  //   }
  // }, []);

  // delete
  const [list, setList] = useState([]);
  const deleteImage = (e) => {
    const onlyName = e

      .slice(e.lastIndexOf("%2F") + 3, e.lastIndexOf("?"))
      .replace("%20", " ");
    console.log(onlyName);
    const imgPath =
      "users-private-folders/" + authUser.email + "-id/files/" + onlyName;
    const delRef = ref(fireStorage, imgPath);
    deleteObject(delRef);
    setPhotoGallery((photo) => photo.filter((item) => item !== e));
  };

  return (
    <div className={styles.galleryHome}>
      <Sidebar />
      <div className={styles.container}>
        <div className={styles.photoDiv}>
          <div className={styles.inputDiv}>
            <input
              type="file"
              id="upload"
              hidden
              multiple
              onChange={(e) => selectNewFile(e)}
            ></input>
            <label htmlFor="upload">
              <div className={styles.imagePlus}>
                <img src={plus}></img>
              </div>
            </label>
          </div>
        </div>
        {/* {photoGallery.map((e) => ( */}
        {photoGallery
          .filter((element) =>
            element
              .slice(element.lastIndexOf("%") + 3, element.lastIndexOf("?"))
              .includes(filter)
          )
          .map((e) => (
            <div id="photoDiv" key={e} className={styles.fileDiv}>
              <div className={styles.photoDiv}>
                <button
                  className={styles.button}
                  id="del"
                  onClick={() => deleteImage(e)}
                >
                  <div className={styles.imageTrashbin}>
                    <img src={trashbin}></img>
                  </div>
                </button>
                <img className={styles.photo} src={e}></img>
              </div>
              <div className={styles.fileNameDiv}>
                <p className={styles.fileName}>
                  {e.slice(e.lastIndexOf("%") + 3, e.lastIndexOf("?"))}
                </p>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
