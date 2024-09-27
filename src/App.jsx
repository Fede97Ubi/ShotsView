import Header from "./components/header/Header";

import styles from "./app.module.css";

// Questa è la pagina di facciata, vorrei usarla per creare una pagina che viene vista solo una volta
// appena si entra, una pagina di welcome
function App() {
  return (
    <div className="App">
      <Header />
      <h1>patatina wecome</h1>
    </div>
  );
}

export default App;
