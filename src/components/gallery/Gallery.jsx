import styles from "./gallery.module.css";
import trashbin from "../../icon/trashbin-min.png";
import download from "../../icon/download.png";
import plus from "../../icon/plus-min.png";
import {
  uploadBytes,
  deleteObject,
  getDownloadURL,
  listAll,
  ref,
  getBlob,
} from "firebase/storage";
import {
  fireStorage,
  auth,
  realTimeDatabase,
} from "../firebase/firebase-config";
import { useEffect, useState } from "react";
import { saveAs } from "file-saver";
import axios from "axios";

export default function Gallery({ filter, folder, setFolder }) {
  const [photoGallery, setPhotoGallery] = useState([]);

  const [authUser, setAuthUser] = useState(null);

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
            // "users-private-folders/" +
            // authUser.email +
            // "-id/files/" +
            folder + "/" + imgFile.name;
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
        const folderRefTry = ref(
          fireStorage,
          // "users-private-folders/" + authUser.email + "-id/files"
          folder
        );
        listAll(folderRefTry).then((allFile) => {
          allFile.items.forEach((val) =>
            getDownloadURL(val).then((url) => {
              setPhotoGallery((data) => [...data, url]);
              // console.log(url);
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
  }, [folder]);

  function internalPath(e) {
    return e
      .substring(e.indexOf("shotsview-2024.appspot.com") + 29, e.indexOf("?"))
      .replace("%40", "@")
      .replaceAll("%2F", "/")
      .replaceAll("%20", " ");
  }

  function getNameOfFile(elem) {
    return elem.substring(elem.lastIndexOf("/") + 1);
  }

  // delete
  const [list, setList] = useState([]);
  const deleteImage = (e) => {
    console.log("test delete image " + e);
    const elem = internalPath(e);
    const delRef = ref(fireStorage, elem);
    deleteObject(delRef);
    setPhotoGallery((photo) => photo.filter((item) => item !== e));
  };

  const downloadImage = (e) => {
    console.log("test download image " + e);
    const elem = internalPath(e);
    getDownloadURL(ref(fireStorage, elem))
      .then((url) => {
        // `url` is the download URL for 'images/stars.jpg'

        // This can be downloaded directly:
        const xhr = new XMLHttpRequest();
        xhr.responseType = "blob";
        xhr.onload = (event) => {
          const blob = xhr.response;
        };
        xhr.open("GET", url);
        xhr.send();

        // 4. Questo codice viene chiamato dopo la ricezione della risposta
        xhr.onload = function () {
          if (xhr.status != 200) {
            // analizza lo status HTTP della risposta
            alert(`Error ${xhr.status}: ${xhr.statusText}`); // ad esempio 404: Not Found
          } else {
            // mostra il risultato
            // alert(`Done, got ${xhr.response.length} bytes`); // response contiene la risposta del server
            console.log(xhr.response);
            const fileName = getNameOfFile(elem);
            saveAs(xhr.response, fileName);
          }
        };

        xhr.onprogress = function (event) {
          if (event.lengthComputable) {
            // alert(`Received ${event.loaded} of ${event.total} bytes`);
          } else {
            alert(`Received ${event.loaded} bytes`); // nessun Content-Length
          }
        };

        xhr.onerror = function () {
          alert("Request failed");
        };

        // // Or inserted into an <img> element
        // const img = document.getElementById("myimg");
        // img.setAttribute("src", url);
      })
      .catch((error) => {
        // Handle any errors
        console.log("download error: " + error);
      });
  };

  return (
    <div className={styles.allBox}>
      folder {folder}
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
              .toLowerCase()
              .includes(filter.toLowerCase())
          )
          .map((e) => (
            <div id="photoDiv" key={e} className={styles.fileDiv}>
              <div className={styles.photoDiv}>
                <button
                  className={styles.buttonTrash}
                  id="del"
                  onClick={() => deleteImage(e)}
                >
                  <div className={styles.imageTrashbin}>
                    <img src={trashbin}></img>
                  </div>
                </button>
                <button
                  className={styles.buttonDownload}
                  id="del"
                  onClick={() => downloadImage(e)}
                >
                  <div className={styles.imageDownload}>
                    <img src={download}></img>
                  </div>
                </button>
                <img className={styles.photo} src={e}></img>
              </div>
              <div className={styles.fileNameDiv}>
                <p className={styles.fileName}>
                  {e
                    .slice(e.lastIndexOf("%2F") + 3, e.lastIndexOf("?"))
                    .replaceAll("%20", " ")}
                </p>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
