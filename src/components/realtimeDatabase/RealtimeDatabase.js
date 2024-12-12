import { realTimeDatabase } from "../firebase/firebase-config";
import { set, ref, onValue, get, child, remove, push } from "firebase/database";
import { deleteFolder } from "../firebaseStorage/firebaseStorage";

export const folderSet = new Set([]);

export function readTest() {
  const path = "users/test6@test%com/publicFolder";
  const starCountRef = ref(realTimeDatabase, path);
  console.log("onValue attivo");
  onValue(starCountRef, (snapshot) => {
    const data = snapshot.val();
    // console.log("update file: " + data);
    for (const key in data) {
      folderSet.add(data[key].folderName);
    }
    // console.log(folderSet);
  });
}

// lettura file da path
function readRD(path) {
  const starCountRef = ref(realTimeDatabase, path);
  onValue(starCountRef, (snapshot) => {
    const data = snapshot.val();
    console.log("update file: " + data);
    for (const key in data) {
      console.log(data[key].folderName);
    }
    return data;
  });
}

// crea nuova cartella condivisa
function writeFolderRD(publicFolderPath, userFolderPath, admin) {
  set(ref(realTimeDatabase, publicFolderPath), {
    admin: mailForRD(admin),
  });
  set(ref(realTimeDatabase, userFolderPath), {
    role: "admin",
  });
  if (checkRD(path) == true) {
    return "succes";
  } else {
    return "write error";
  }
}

// crea nuovo utente
function writeUserRD(path, eta, nazione, citta) {
  set(ref(realTimeDatabase, path), {
    eta: eta,
    nazione: nazione,
    citta: citta,
  });
}

export function checkRDPublicFolder(folderName) {
  const publicFolderPath = "publicFolder/" + folderName;
  get(child(ref(realTimeDatabase), publicFolderPath))
    .then((snapshot) => {
      const data = snapshot.val();
      if (data.admin) {
        return true;
      }
    })
    .catch((error) => {
      if (error.message != "Cannot read properties of null (reading 'admin')") {
        console.log(error);
      }
    });
}

// tentativo di creare nuova cartella condivisa
export function newPublicFolder(user, folderName) {
  const publicFolderPath = "publicFolder/" + folderName;
  get(child(ref(realTimeDatabase), publicFolderPath))
    .then((snapshot) => {
      const data = snapshot.val();
      const userFolderPath =
        "users/" + mailForRD(user) + "/publicFolder/" + folderName;
      // console.log(data.admin);
      if (data.admin) {
        // console.log("nome galleria già in uso");
        // notifica galleria già esistente ----------------------------------------------------------------------------------------------------------------
        const notificationPath = "users/" + mailForRD(user) + "/notification";
        push(ref(realTimeDatabase, notificationPath), {
          text: "il nome " + folderName + " è già in uso",
        });
        return false;
      }
    })
    .catch((error) => {
      if (error.message == "Cannot read properties of null (reading 'admin')") {
        const publicFolderPath = "publicFolder/" + folderName;
        const userFolderPath =
          "users/" + mailForRD(user) + "/publicFolder/" + folderName;
        set(ref(realTimeDatabase, publicFolderPath), {
          admin: mailForRD(user),
        });
        set(ref(realTimeDatabase, userFolderPath), {
          role: "admin",
        });
      } else {
        console.error(error);
      }
    });
}

// tentativo di aggiunge un utente con le sue informazioni
export function newUser(Email, eta, nazione, citta) {
  const path = "users/" + mailForRD(Email) + "/infoUser";
  if (checkRD(path) == true) {
    // questo controllo dovrebbe essere inutile perché già fatto sugli utenti registrati direttamente
    // è comodo in fase di sviluppo quando sposto il codice
    return "utente già esistente";
  } else {
    // checkRD(..) == false
    return writeUserRD(path, eta, nazione, citta);
  }
}

// restituisce l'esistenza di un utente
export function existUser(email) {
  const path = "users/" + mailForRD(Email);
  return checkRD(path);
}

export function addMember(member, folderName) {
  const path = "users/" + mailForRD(member);
  get(child(ref(realTimeDatabase), path))
    .then((snapshot) => {
      const data = snapshot.val();
      const publicFolderPath =
        "publicFolder/" + folderName + "/member/" + mailForRD(member);
      const userFolderPath =
        "users/" + mailForRD(member) + "/publicFolder/" + folderName;
      if (data.infoUser.citta) {
        // aggiungere nome alla lista della cartella condivisa
        set(ref(realTimeDatabase, publicFolderPath), {
          role: "member",
        });
        // aggiungere cartella nel profilo utente
        set(ref(realTimeDatabase, userFolderPath), {
          role: "member",
        });
        const notificationPath = "users/" + mailForRD(member) + "/notification";
        push(ref(realTimeDatabase, notificationPath), {
          text: "Sei stato aggiunto alla galleria " + folderName + "!",
        });
      }
    })
    .catch((error) => {
      // console.error(error);
      console.log("utente non trovato");
      // notifica utente non esistente ----------------------------------------------------------------------------------------------------------------
    });
}

export function removeMember(member, folderName) {
  const publicFolderPath =
    "publicFolder/" + folderName + "/member/" + mailForRD(member);
  get(child(ref(realTimeDatabase), publicFolderPath))
    .then((snapshot) => {
      const data = snapshot.val();
      const userFolderPath =
        "users/" + mailForRD(member) + "/publicFolder/" + folderName;
      if (data.role) {
        remove(ref(realTimeDatabase, publicFolderPath));
        remove(ref(realTimeDatabase, userFolderPath));
        const notificationPath = "users/" + mailForRD(member) + "/notification";
        push(ref(realTimeDatabase, notificationPath), {
          text: "Sei stato rimosso dalla galleria " + folderName + "!",
        });
      }
    })
    .catch((error) => {
      console.error(error);
      console.log("utente non trovato");
      // notifica membro non esistente ----------------------------------------------------------------------------------------------------------------
    });
}

export function exitToFolder(folderName, user) {
  // verificare esitenza -> catch fa già da solo
  const publicFolderPath = "publicFolder/" + folderName;
  get(child(ref(realTimeDatabase), publicFolderPath))
    .then((snapshot) => {
      const data = snapshot.val();

      // verificare se user è l'admin
      if (data.admin == mailForRD(user)) {
        // se si cancellare cartella, e i rimuoverla da tutti i membri
        const AdminPath =
          "users/" + mailForRD(user) + "/publicFolder/" + folderName;
        remove(ref(realTimeDatabase, AdminPath));
        remove(ref(realTimeDatabase, publicFolderPath));
        for (const member in data.member) {
          const memberPath = "users/" + member + "/publicFolder/" + folderName;
          remove(ref(realTimeDatabase, memberPath));
          const notificationPath = "users/" + member + "/notification";
          push(ref(realTimeDatabase, notificationPath), {
            text: "La galleria " + folderName + " è stata chiusa",
          });
        }
        // cancellare cartella da firebase
        deleteFolder("users-shared-folders/" + folderName + "/files");
      } else {
        // se no cancella solo la cartella dell'utente, e il membro
        const memberPath =
          "users/" + mailForRD(user) + "/publicFolder/" + folderName;
        remove(ref(realTimeDatabase, memberPath));
        const publicFolderMemberPath =
          "publicFolder/" + folderName + "/member/" + mailForRD(user);
        remove(ref(realTimeDatabase, publicFolderMemberPath));
      }
    })
    .catch((error) => {
      console.error(error);
    });
}

// trasforma i caratteri della mail non supportati dal realtime database
export function mailForRD(email) {
  return email.replace(".", "%");
}

// trasforma i caratteri della mail del realtime database come la norma
export function mailFromRD(email) {
  return email.replace("%", ".");
}

// codice di test non lo elimino perchè è un ripasso rapido di come funziona
export function test() {
  // inserimento folderPubblica in user/publicFolder/key/folderName
  const path = "users/test6@test%com/publicFolder";
  // console.log("cane " + readRD(path));
  // push(ref(realTimeDatabase, path), {
  //   folderName: "tendone",
  // });

  // ${userId}
  // restituisce il risultato
  // get(child(ref(realTimeDatabase), path))
  //   .then((snapshot) => {
  //     if (snapshot.exists()) {
  //       // console.log(snapshot.val());
  //       const data = snapshot.val();
  //       for (const key in data) {
  //         console.log(data[key].folderName);
  //       }
  //     } else {
  //       console.log("No data available");
  //     }
  //   })
  //   .catch((error) => {
  //     console.error(error);
  //   });

  // cancellare file
  // remove(
  //   ref(
  //     realTimeDatabase,
  //     "users/test6@test%com/publicFolder/-ODbu7X9DxIVkyKpoQ1D"
  //   )
  // );
  readRD(path);
}
