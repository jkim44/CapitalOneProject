import React, { useState, useEffect, useRef } from "react";
import Header from "../components/Header";
import Card from "react-bootstrap/Card";
import "../styles/EasyMode.css";
import {
  Button,
  ButtonGroup,
  Container,
  Image,
  CardGroup,
  Modal,
  Form,
} from "react-bootstrap";
import arrow from "../images/rightarrow.png";
import AddTransaction from "../components/AddTransaction";
import { useNavigate } from "react-router-dom";
import TransactionPage from "./TransactionPage";

function EasyMode() {
  //console.log(JSON.parse(sessionStorage.getItem("transactions")));
  let navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);

  // Setup for deposit modal
  const [showModal, setShowModal] = useState(false);

  const handleModalOpen = () => {
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

  // Set this amount to the total the bank account has
  const [total, setTotal] = useState();
  const amount = useRef();

  function handleClick() {
    navigate("/transaction");
  }

  function handleDeposit() {
    setTotal(total + parseInt(amount.current.value));
    setShowModal(false);
    const amount_data = JSON.stringify({
      amount: parseInt(amount.current.value),
    });
    fetch(`http://localhost:8000/api/v1/amount`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: amount_data,
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch data.");
        }
        return res.json();
      })
      .then((data) => {
        setTotal(data);
      })
      .catch((error) => {
        console.error("Failed to fetch amount data.", error);
      });
  }

  useEffect(() => {
    fetch_tran_list();
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
  const fetch_tran_list = async () => {
    fetch(`http://localhost:8000/api/v1/list`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Transaction list failed to load.");
        }
        return res.json();
      })
      .then((data) => {
        //console.log(data);
        let lists = [];
        data.forEach((transaction) => {
          //console.log(transaction);
          const trimmed_tran = {
            id: transaction.user_id,
            name: transaction.buy_from,
            date: transaction.date,
            time: transaction.time,
            amount: transaction.amount,
            category: transaction.category,
          };
          lists.push(trimmed_tran);
        });
        //transactions = data;
        setTransactions(lists);
        //console.log(lists);
      })
      .catch((error) => {
        console.error("List.js file: ", error);
      });
  };

  return (
    <div>
      <Header />
      <br></br>
      <div
        className="title-region"
        style={{ display: "flex", alignItems: "center" }}
      >
        <p className="page-title">Personal Banking</p>
        <div style={{ marginLeft: "auto" }}>
          <AddTransaction />
        </div>
      </div>
      {/* Spacing here and on first page needs to be consistent. */}
      <div style={{ display: "flex", marginTop: "2rem" }}>
        <Card className="card-left" border="dark border-2">
          <Card.Header
            as="h4"
            className="card-headers card-header-clickable"
            text="white"
            onClick={handleClick}
          >
            Checking Account
          </Card.Header>
          <Card.Body
            className="card-body-1 card-headers card-header-clickable"
            style={{ height: "-2rem" }}
            onClick={handleClick}
          >
            <Card.Text style={{ margin: 0 }}>xxxxxxxx1234</Card.Text>
            <Card.Text>${total}</Card.Text>
          </Card.Body>
          <Card.Body className="card-body-2">
            <Card.Text style={{ margin: 0 }}>Recent Transactions</Card.Text>
          </Card.Body>
          <Card.Body
            className="card-body-3"
            style={{ maxHeight: "300px", overflowY: "auto" }}
          >
            {transactions.map((transaction) => (
              <Card
                key={transaction.id}
                className="mb-3"
                style={{ border: "1px solid #ccc" }}
              >
                <Card.Body>
                  <p>
                    {transaction.name} | Amount: ${transaction.amount}
                  </p>
                  <p>
                    {transaction.date} {transaction.time}
                  </p>
                </Card.Body>
              </Card>
            ))}
          </Card.Body>
        </Card>

        <div className="button-div">
          <Button className="button">
            <Image
              src={arrow}
              alt="right-arrow"
              style={{ width: "100%", backgroundColor: "white" }}
            />
          </Button>
          <div></div>
          <Button className="button">
            <Image
              src={arrow}
              alt="right-arrow"
              style={{
                width: "100%",
                backgroundColor: "white",
                transform: "scaleX(-1)",
              }}
            />
          </Button>
        </div>

        <Card className="card-right" border="dark border-2">
          <Card.Header as="h4" className="card-headers">
            Savings Account
          </Card.Header>
          <Card.Body className="card-body-1">
            <Card.Text style={{ margin: 0 }}>xxxxxxxx5678</Card.Text>
            <Card.Text>$10000</Card.Text>
          </Card.Body>
          <Card.Body className="card-body-2">
            <Card.Text style={{ margin: 0 }}>Recent Transactions</Card.Text>
          </Card.Body>
          <Card.Body className="card-body-3">
            {/* EDIT TO PUT SOME TRANSACTIONS!!!! */}
          </Card.Body>
        </Card>

        <Container
          style={{ width: "25%", marginRight: "6%", paddingRight: "" }}
        >
          <CardGroup className="credit-card" border="dark border-2">
            <Card className="card-headers">
              <Card.Header as="h4" className="card-headers">
                Credit Card
              </Card.Header>
              <Card.Body>
                <Card.Text style={{ margin: 0 }}>xxxxx9101112</Card.Text>
                <Card.Text>Balance: $100.00</Card.Text>
              </Card.Body>
            </Card>
            <div style={{ alignContent: "center" }}>
              <Button className="credit-card-button" variant="light">
                Pay Now
              </Button>
            </div>
          </CardGroup>

          <Card className="send-money" border="dark border-2">
            <Card.Header as="h4" className="card-headers">
              Send/Receive Money
            </Card.Header>
            <div className="payment-methods">
              <ButtonGroup>
                <Button variant="light" className="trans-button">
                  Apple
                </Button>
                <Button variant="light" className="trans-button">
                  Google
                </Button>
                <Button variant="light" className="trans-button">
                  Zelle
                </Button>
                <Button variant="light" className="trans-button">
                  Venmo
                </Button>
              </ButtonGroup>
            </div>
          </Card>

          <Card className="deposit-money" border="dark border-2">
            <Card.Header as="h4" className="card-headers">
              Deposit Money
            </Card.Header>
            <Card.Body className="card-body-1">
              <Button
                className="deposit-button"
                variant="light"
                onClick={handleModalOpen}
              >
                Deposit Money
              </Button>
            </Card.Body>
            <Modal show={showModal} onHide={handleModalClose}>
              <Modal.Header closeButton>
                <Modal.Title>Deposit Money</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form>
                  <Form.Group className="form-group">
                    <Form.Label htmlFor="amount">Amount:</Form.Label>
                    <Form.Control
                      type="text"
                      className="form-control"
                      ref={amount}
                    />
                  </Form.Group>
                </Form>
              </Modal.Body>
              <Modal.Footer>
                <Button
                  variant="secondary"
                  onClick={handleModalClose}
                  style={{ marginRight: "10px" }}
                >
                  Close
                </Button>
                <Button variant="primary" onClick={handleDeposit}>
                  Deposit
                </Button>
              </Modal.Footer>
            </Modal>
          </Card>
        </Container>
      </div>
    </div>
  );
}

export default EasyMode;
