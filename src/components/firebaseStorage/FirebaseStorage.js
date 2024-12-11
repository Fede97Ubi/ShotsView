import { deleteObject, ref, getDownloadURL, listAll } from "firebase/storage";
import { fireStorage } from "../firebase/firebase-config";

export function deleteFolder(path) {
  //   const delRef = ref(fireStorage, path);
  //   deleteObject(delRef);
  const folderRefTry = ref(
    fireStorage,
    // "users-private-folders/" + authUser.email + "-id/files"
    path
  );
  listAll(folderRefTry).then((allFile) => {
    allFile.items.forEach((val) =>
      getDownloadURL(val).then((url) => {
        deleteObject(
          ref(
            fireStorage,
            url
              .substring(
                url.indexOf(path.substring(0, path.indexOf("/"))),
                url.indexOf("?")
              )
              .replace("%40", "@")
              .replaceAll("%2F", "/")
              .replaceAll("%20", " ")
          )
        );
      })
    );
  });
}
