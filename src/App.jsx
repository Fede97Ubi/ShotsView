import Header from "./components/header/Header";

import styles from "./app.module.css";

// Questa è la pagina di facciata, vorrei usarla per creare una pagina che viene vista solo una volta
// appena si entra, una pagina di welcome
function App() {
  return (
    <div className="App">
      <Header />
      <h1>wecome</h1>
      <p>
        questa è la pagina di benvenuto, ci andrebbero novità, pubblicità,
        aggiornamenti vari, oppure da rimuovere ed andare subito alla propria
        galleria
      </p>
    </div>
  );
}

export default App;
