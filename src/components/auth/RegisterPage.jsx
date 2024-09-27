import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../header/Header";
import { registerAuth } from "./AuthPage";
import styles from "./authPage.module.css";
import { fireStorage } from "../firebase/firebase-config";
import { uploadString, ref } from "firebase/storage";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");

  const [eta, setEta] = useState("");
  const [nazione, setNazione] = useState("");
  const [citta, setCitta] = useState("");

  const handleEnterKey = (e) => {
    if (e.key === "Enter") {
      register();
    }
  };

  const [registerExitCode, setRegisterExitCode] = useState("success");
  const register = async () => {
    var reg = await registerAuth(Email, Password);
    setRegisterExitCode(reg);
    if (reg == "success") {
      if (Email != "") {
        ////////// questa condizione if (Email != "") serve solo perchè il progetto è in <React.StrictMode>
        // creazione file json con le informazioni, utilizzate successivamente per la condivisione
        const userJson = {
          emailID: Email,
        };
        const infoRef = ref(fireStorage, "list-users/" + Email + ".json");
        uploadString(infoRef, JSON.stringify(userJson));
        const userInfo = {
          emailID: Email,
          eta: eta,
          nazione: nazione,
          citta: citta,
          sharedFolder: [
            "cartellaCondivisa1",
            "cartellaCondivisa2",
            "cartellaCondivisa3",
          ],
        };
        const userInfoRef = ref(
          fireStorage,
          "users-private-folders/" + Email + "-id/userInfo.json"
        );
        uploadString(userInfoRef, JSON.stringify(userInfo));
        // Upload file per creare cartella privata,
        // è stato tolto perche la cartella si crea e si distrugge in base a se ha o non ha file dentro
        // vorrei usare l'immagine "../../icon/welcome.png" ma non riesco
        // a recuperarla tramite codice
        // const temp =
        //   "users-private-folders/" + Email + "-id/files/welcome.ghost";
        // console.log(temp);
        // const imgWelcomeRef = ref(fireStorage);
        // const newDir = ref(fireStorage, temp);
        navigate("/Home");
      }
    }
  };

  const ErrorMessage = () => {
    if (registerExitCode !== "success") {
      return <p className={styles.errorColor}>{registerExitCode}</p>;
    }
  };

  return (
    <div>
      <Header />
      <div className={styles.box}>
        <div className={styles.credentialForm}>
          register with
          <ErrorMessage />
          <div>
            <input
              className={styles.input}
              placeholder="email"
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              onKeyDown={handleEnterKey}
            ></input>
          </div>
          <div>
            <input
              className={styles.input}
              placeholder="password"
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              onKeyDown={handleEnterKey}
            ></input>
          </div>
          <div>
            <input
              className={styles.input}
              placeholder="eta"
              onChange={(e) => {
                setEta(e.target.value);
              }}
              onKeyDown={handleEnterKey}
            ></input>
          </div>
          <div>
            <input
              className={styles.input}
              placeholder="nazione"
              onChange={(e) => {
                setNazione(e.target.value);
              }}
              onKeyDown={handleEnterKey}
            ></input>
          </div>
          <div>
            <input
              className={styles.input}
              placeholder="città"
              onChange={(e) => {
                setCitta(e.target.value);
              }}
              onKeyDown={handleEnterKey}
            ></input>
          </div>
          <div>
            <button className={styles.button} onClick={register}>
              register
            </button>
          </div>
        </div>
        <p className={styles.textBlack}>or</p>
        <button
          onClick={() => navigate("/LoginPage")}
          className={styles.texting}
        >
          login
        </button>
      </div>
    </div>
  );
}
