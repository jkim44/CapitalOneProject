import "../App.css";
import React from "react";
import TransactionList from "../components/TransactionList";
import Header from "../components/Header";
import PageTitle from "../components/PageInfo";
import Navigation from "./Navbar";
import AddTransaction from "../components/AddTransaction";
import { useState, useEffect, useRef } from "react";

function TransactionPage() {
  //console.log(JSON.parse(sessionStorage.getItem("transactions")));

  // Temp value, could potentially display
  const [total, setTotal] = useState(
    JSON.parse(sessionStorage.getItem("total")) || 0,
  );
  useEffect(() => {
    fetch_amount_data();
  }, [total]);

  const fetch_amount_data = async () => {
    fetch(`http://localhost:8000/api/v1/get_amount`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("failed to get total valu data.");
        }
        return res.json();
      })
      .then((data) => {
        setTotal(data);
      })
      .catch((error) => {
        console.error("failed to get the amount: ", error);
      });
  };

  return (
    <>
      <div>
        <Header />
        <br></br>
        <div
          className="title-region"
          style={{ display: "flex", alignItems: "center" }}
        >
          <PageTitle title="Checking Account" amount={total} />
          <p>${total}</p>
          <div style={{ marginLeft: "auto" }}>{/* <AddTransaction /> */}</div>
        </div>
        <TransactionList />
      </div>
    </>
  );
}

export default TransactionPage;
