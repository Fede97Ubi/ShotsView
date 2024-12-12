import Header from "./components/header/Header";
import { notifierRequest } from "./components/notifier/Notifier";
import styles from "./app.module.css";

// Questa è la pagina di facciata, vorrei usarla per creare una pagina che viene vista solo una volta
// appena si entra, una pagina di welcome
function App() {
  notifierRequest("Hello!");
  return (
    <div className="App">
      <Header />
      <h1>wecome</h1>
      <p className={styles.text}>
        Il progetto si prepone l'obbiettivo di creare un archivio online per
        ogni utente che si registra assegnado un area privata dove caricare
        scaricare e vedere i propri file e la possibilità di creare delle
        cartelle condivise dove più utenti possono interagire. E' pensato per
        essere una galleria online di foto per condividere con altri utenti.
      </p>
      <br></br>
      <p className={styles.text2}>
        Clicca in alto a destra per registrarti o effettuare il login
      </p>
    </div>
  );
}

export default App;
