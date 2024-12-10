import { realTimeDatabase } from "../firebase/firebase-config";
import { set, ref, onValue, get, child } from "firebase/database";

export const folderSet = new Set([]);

export function readTest() {
  const path = "users/test6@test%com/publicFolder";
  const starCountRef = ref(realTimeDatabase, path);
  console.log("onValue attivo");
  onValue(starCountRef, (snapshot) => {
    const data = snapshot.val();
    // console.log("update file: " + data);s
    for (const key in data) {
      folderSet.add(data[key].folderName);
    }
    // console.log(folderSet);
  });
}

// lettura file da path DA RIVEDERE: USO QUESTO MECCANISMO PER IL MANTENIMENTO DELLE CARTELLE CONDIVISA
function readRD(path) {
  const starCountRef = ref(realTimeDatabase, path);
  onValue(starCountRef, (snapshot) => {
    const data = snapshot.val();
    // updateStarCount(diocane, data);
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
  if (checkRD(path) == true) {
    return "succes";
  } else {
    return "write error";
  }
}

// verifica l'esistenza di un file
function checkRD(path) {
  const refRD = ref(realTimeDatabase, path);
  onValue(refRD, (snapshot) => {
    if (snapshot.val() == null) {
      //   console.log(path + " = null");
      return false;
    } else {
      //   console.log(path + " = qualcosa");
      return true;
    }
  });
}

// tentativo di creare nuova cartella condivisa
export function newPublicFolder(user, folderName) {
  // const folderName = Math.floor(Math.random(100) * 100); // limite impostato per leggere meglio in fase di debug
  // id da sostituire con il nome ----------------------
  const publicFolderPath = "publicFolder/" + folderName;
  const userFolderPath =
    "users/" + mailForRD(user) + "/publicFolder/" + folderName;
  if (checkRD(publicFolderPath) == true) {
    console.log("nome già in uso: " + publicFolderPath);
    // return "nome già in uso"; ----------------------
    // return newPublicFolder(user);
  } else {
    // checkRD(..) == false
    set(ref(realTimeDatabase, publicFolderPath), {
      admin: mailForRD(user),
    });
    set(ref(realTimeDatabase, userFolderPath), {
      role: "admin",
    });
  }
  return true;
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
        "publicFolder/" + folderName + "/" + mailForRD(member);
      const userFolderPath =
        "users/" + mailForRD(member) + "/publicFolder/" + folderName;
      if (data.infoUser.citta) {
        // aggiungere nome alla lista della cartella condivisa
        console.log("dioporcone");
        set(ref(realTimeDatabase, publicFolderPath), {
          role: "client",
        });
        // aggiungere cartella nel profilo utente
        set(ref(realTimeDatabase, userFolderPath), {
          role: "client",
        });
      }
    })
    .catch((error) => {
      // console.error(error);
      // console.log("utente non trovato");
      // notifica utente non esistente ----------------------------------------------------------------------------------------------------------------
    });
}

export function test() {
  // inserimento folderPubblica in user/publicFolder/key/folderName
  const path = "users/test6@test%com/publicFolder";
  // console.log("dio cane " + readRD(path));
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

// trasforma i caratteri della mail non supportati dal realtime database
export function mailForRD(email) {
  return email.replace(".", "%");
}

// trasforma i caratteri della mail del realtime database come la norma
export function mailFromRD(email) {
  return email.replace("%", ".");
}
