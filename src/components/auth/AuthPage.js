import { useState, useEffect } from "react";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth } from "../firebase/firebase-config";
import { useAuthState } from "react-firebase-hooks/auth";

var userVar;

// REGISTER FIREBASE
export const registerAuth = async (email, password) => {
  try {
    const user = await createUserWithEmailAndPassword(auth, email, password);
    userVar = user;
    return "success";
  } catch (error) {
    console.log(error.message);
    if (error.message == "Firebase: Error (auth/invalid-email).") {
      return "email non valida";
    }
    console.log("nuovo errore da gestire");
    return "Register: nuovo errore da gestire " + error.message;
  }
};

// LOGIN FIREBASE
export const loginAuth = async (email, password) => {
  try {
    const user = await signInWithEmailAndPassword(auth, email, password);
    userVar = user;
    return "success";
  } catch (error) {
    console.log(error.message);
    if (error.message == "Firebase: Error (auth/invalid-email).") {
      return "email non valida";
    }
    if (error.message == "Firebase: Error (auth/invalid-credential).") {
      return "email o password errati";
    }
    console.log("nuovo errore da gestire");
    return "Login: nuovo errore da gestire " + error.message;
  }
};

// LOGOUT FIREBASE
export const logoutAuth = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.log("Logout: nuovo errore da gestire " + error.message);
    return;
  }
  return;
};

// ricezione utente collegato (solo per visualizzazione di pagina)
export const CurrentUser = () => {
  const [user, loading, error] = useAuthState(auth);

  if (loading) {
    return "Initialising User...";
  }
  if (error) {
    return "Error currentUser";
  }
  if (user) {
    const userInfo = user.email;
    return userInfo;
  }
  return "ospite";
};

// CANCELLARE
// recupero email per operazioni su server
// export function userMail() {
//   if (auth.currentUser != null) {
//     return auth.currentUser.email;
//   } else {
//     console.log(auth.currentUser);
//     console.log("ospite");
//   }
// }

// CANCELLARE
// recupero id per operazioni su server
// export function userID() {
//   if (auth.currentUser != null) {
//     return auth.currentUser.uid;
//   } else {
//     console.log("ospite");
//   }
// }

//---------------------------------------------------------------------------

//-----------------------------------
export function useAuth() {
  const [authState, setAuthState] = useState({
    isSignedIn: false,
    pending: true,
    user: null,
  });

  useEffect(() => {
    const unregisterAuthObserver = auth.onAuthStateChanged((user) =>
      setAuthState({ user, pending: false, isSignedIn: !!user })
    );
    return () => unregisterAuthObserver();
  }, []);

  return { auth, ...authState };
}
//---------------------------------------------------------------------------

function AuthPage() {
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentuser) => {});
    return () => {
      unsubscribe();
    };
  }, []);
}
