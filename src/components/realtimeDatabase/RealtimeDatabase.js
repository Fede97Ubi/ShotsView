import { realTimeDatabase } from "../firebase/firebase-config";
import { set, ref, onValue, push } from "firebase/database";

function readRD(path) {
  const starCountRef = ref(realTimeDatabase, path);
  onValue(starCountRef, (snapshot) => {
    const data = snapshot.val();
    // updateStarCount(diocane, data);
    return data;
  });
}

function writeFolderRD(path) {
  const adminMail = "adminEmail";
  const folderName = "pincopalloFolder";
  set(ref(realTimeDatabase, path), {
    folderName: folderName, // da sostituire con nome scelto
    adminMail: mailForRD(adminMail), // da sostituire con email dell'utente
  });
  if (checkRD(path) == true) {
    return "succes";
  } else {
    return "write error";
  }
}

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

function checkRD(path) {
  const refRD = ref(realTimeDatabase, path);
  onValue(refRD, (snapshot) => {
    if (snapshot.val() == null) {
      console.log(path + " = null");
      return false;
    } else {
      console.log(path + " = qualcosa");
      return true;
    }
  });
}

export function newPublicFolder() {
  const newFolderId = Math.floor(Math.random(100) * 100); // limite impostato per leggere meglio in fase di debug
  const path = "publicFolder/";
  if (checkRD(path + newFolderId) == true) {
    return newPublicFolder();
  } else {
    // checkRD(..) == false
    return writeFolderRD(path + newFolderId);
  }
}

export function newUser(Email, eta, nazione, citta) {
  const newUserId = Math.floor(Math.random(100) * 100); // da sostituire con email
  const path = "users/" + mailForRD(Email);
  if (checkRD(path + newUserId) == true) {
    // questo controllo dovrebbe essere inutile perché già fatto sugli utenti registrati direttamente
    // è comodo in fase di sviluppo quando sposto il codice
    return "utente già esistente";
  } else {
    // checkRD(..) == false
    return writeUserRD(path + newUserId, eta, nazione, citta);
  }
}

function mailForRD(email) {
  return email.replace(".", "%");
}

function mailFromRD(email) {
  return email.replace("%", ".");
}
