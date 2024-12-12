import { useNavigate } from "react-router-dom";
import { useState } from "react";

import styles from "./header.module.css";
import hamburgerIcon from "/src/icon/hamburger.png";
import logo from "/src/icon/shotsview_logo+text-min.png";
import { CurrentUser, logoutAuth } from "../auth/AuthPage";

export default function Header({ setFilter }) {
  const navigate = useNavigate();

  const [test, setTest] = useState("");

  // ricezione utente collegato v1
  const user = CurrentUser();
  const CenterText = () => {
    if (user == "ospite") {
      return <p>Welcome, login or register with "sign in" button</p>;
    }
    if (user == "Initialising User...") {
      <p>"Initialising User..."</p>;
    }
    if (user == "Error currentUser") {
      return <p>ERROR: contact developer</p>;
    }
    return (
      <div className={styles.userDiv}>
        <input
          className={styles.input}
          placeholder="search"
          onChange={(e) => {
            setFilter(e.target.value);
          }}
        ></input>
      </div>
    );
  };

  // non uso i valori che raccolgo in home perchè non posso catturare lo stato intermedio "in collegamento"
  const Autenticate = () => {
    if (user == "ospite") {
      return (
        <div>
          <button
            className={styles.button}
            onClick={() => navigate("/LoginPage")}
          >
            Sign-in
          </button>
        </div>
      );
    }
    if (user == "Initialising User...") {
      return (
        <div>
          <p>Initialising User...</p>
        </div>
      );
    }
    if (user == "Error currentUser") {
      return (
        <div>
          <p>Error user</p>
        </div>
      );
    }
    return (
      <div className={styles.userDiv}>
        <button className={styles.button} onClick={logoutAuth}>
          logout
        </button>
        <p className={styles.user}>{CurrentUser()}</p>
      </div>
    );
  };

  return (
    <div id="container" className={styles.flexgrid + " " + styles.container}>
      {/* left */}
      <div
        id="hamburger-home"
        className={styles.col30 + " " + styles.left + " " + styles.start}
      >
        <button className={styles.hamburger}>
          <div className={styles.imageH}>
            <img className={styles.hamburgerCss} src={hamburgerIcon}></img>
          </div>
        </button>
        <button className={styles.logo} onClick={() => navigate("/Home")}>
          <div className={styles.imageL}>
            <img src={logo}></img>
          </div>
        </button>
      </div>

      {/* mid */}
      <div id="search-bar" className={styles.col40 + " " + styles.mid}>
        {/* <CenterText setFilter={setFilter/> */}
        <div className={styles.userDiv}>
          <input
            className={styles.input}
            placeholder="search"
            onChange={(e) => {
              setFilter(e.target.value);
            }}
          ></input>
        </div>
      </div>

      {/* right */}
      <div id="login" className={styles.col30 + " " + styles.right}>
        <Autenticate />
      </div>
    </div>
  );
}
