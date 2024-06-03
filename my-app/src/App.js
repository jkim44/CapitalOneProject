import "./App.css";
import React, { useEffect, useState } from "react";
import TransactionList from "./components/TransactionList";
import Header from "./components/Header";
import PageTitle from "./components/PageInfo";
import PagesRouter from "./pages/PagesRouter";
import TransactionPage from "./pages/TransactionPage";

function App() {
  const [backendData, setBackendData] = useState([{}]);

  /**
  useEffect(() => {
    fetch("/api")
      .then((response) => response.json())
      .then((data) => {
        setBackendData(data);
      });
  }, []);
  **/

  return <PagesRouter />;
}

export default App;
