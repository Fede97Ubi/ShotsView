import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../header/Header";
import { loginAuth } from "./AuthPage";
import styles from "./authPage.module.css";

export default function LoginPage() {
  const navigate = useNavigate();
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");

  const handleEnterKey = (e) => {
    if (e.key === "Enter") {
      login();
    }
  };

  const [loginExitCode, setLoginExitCode] = useState("success");
  const login = async () => {
    var reg = await loginAuth(Email, Password);
    setLoginExitCode(reg);
    if (reg == "success") {
      navigate("/Home");
    }
  };

  const ErrorMessage = () => {
    if (loginExitCode !== "success") {
      return <p className={styles.errorColor}>{loginExitCode}</p>;
    }
  };
  return (
    <div className={styles.ofsetHeader}>
      <Header />

      <div className={styles.box}>
        <div className={styles.credentialForm}>
          logged in with
          {/* <p>test: email try2@try.com pw 123456</p> */}
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
            <button className={styles.button} onClick={login}>
              login
            </button>
          </div>
        </div>
        <p className={styles.textBlack}>or</p>
        <button
          onClick={() => navigate("/RegisterPage")}
          className={styles.texting}
        >
          register
        </button>
      </div>
    </div>
  );
}
