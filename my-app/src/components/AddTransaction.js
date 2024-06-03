import React, { useState, useEffect, useRef } from "react";
import {
  Button,
  ButtonGroup,
  Container,
  Image,
  CardGroup,
  Modal,
  Form,
} from "react-bootstrap";

window.backend_port = 8000;

function AddTransaction() {
  const [showModal, setShowModal] = useState(false);
  const [allTransactions, setAllTransactions] = useState(
    JSON.parse(sessionStorage.getItem("transactions")) || [],
  );
  const [total, setTotal] = useState(
    JSON.parse(sessionStorage.getItem("total")),
  );
  const vendorValue = useRef();
  const amountValue = useRef();

  const handleButtonClick = () => {
    setShowModal(true);
  };

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

  const handleSubmit = (e) => {
    e.preventDefault();

    // Process the input values
    const newTransaction = {
      vendor: vendorValue.current.value,
      amount: amountValue.current.value,
    };
    const updatedTransactions = [...allTransactions, newTransaction];
    sessionStorage.setItem("transactions", JSON.stringify(updatedTransactions));
    setAllTransactions(updatedTransactions); // Update the state with the updated transactions array

    //decrease the amount added by the transaction
    const amount_data = JSON.stringify({
      amount: parseInt(amountValue.current.value),
    });
    fetch(`http://localhost:8000/api/v1/sub_amount`, {
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
        sessionStorage.setItem("total", total);
      })
      .catch((error) => {
        console.error("Failed to fetch amount data.", error);
      });

    // Reset the form and hide it
    setShowModal(false);

    const data = {
      buy_from: newTransaction.vendor,
      amount: newTransaction.amount,
    };
    console.log(window.backend_port);
    fetch(`http://localhost:${window.backend_port}/api/v1/transaction`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("failed to store transaction data");
        }
      })
      .then((data) => console.log(data))
      .catch((error) => {
        console.error("Error storing transaction data:", error);
      });
  };

  return (
    <div>
      <Button
        onClick={handleButtonClick}
        style={{ backgroundColor: "#004a99", borderColor: "black" }}
      >
        Add Transaction
      </Button>
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Transaction</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="Vendor">
              <Form.Label>Buy from:</Form.Label>
              <Form.Control type="text" ref={vendorValue} />
            </Form.Group>
            <Form.Group controlId="Amount">
              <Form.Label>Amount:</Form.Label>
              <Form.Control type="text" ref={amountValue} />
            </Form.Group>
            <br></br>
            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default AddTransaction;
