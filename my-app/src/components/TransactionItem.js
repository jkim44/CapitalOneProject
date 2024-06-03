import React, { useState, useEffect, Component } from "react";
import "../styles/TransactionItem.css";
import { Modal, Button, Form } from "react-bootstrap";

function TransactionItem({ transaction, categories, addCategory }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("default");
  const [notes, setNotes] = useState(transaction.notes || "");
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [categoryError, setCategoryError] = useState("");

  useEffect(() => {
    const savedNotes = sessionStorage.getItem(`notes-${transaction.id}`);
    if (savedNotes) {
      setNotes(savedNotes);
    }
    //set initial category
    const data = JSON.stringify({ id: transaction.id });
    fetch(`http://localhost:${window.backend_port}/api/v1/data`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: data,
    })
      .then((response) => response.json())
      .then((data) => {
        //console.log(data);
        const category_res = data.category;
        const note = data.note;
        console.log(category_res);
        //setSelectedCategory(category_res);
        setNotes(note);
      })
      .catch((error) => console.log("Error in Item file:", error));
    console.log(selectedCategory);
  }, [transaction.id, selectedCategory, transaction.category]);

  const handleSummaryClick = (event) => {
    event.stopPropagation(); // revent click from bubbling to expanded details
    setIsExpanded(!isExpanded);
  };

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
    console.log(selectedCategory, event.target.value);
  };

  const handleAddNewCategoryClick = () => {
    setCategoryError("");
    setShowCategoryModal(true);
    //console.log("2");
  };

  const handleCategoryNameChange = (event) => {
    const input = event.target.value;
    setNewCategoryName(input);
  };

  const handleNotesChange = (event) => {
    setNotes(event.target.value);
  };

  const handleSaveCategory = () => {
    sessionStorage.setItem(`category-${transaction.id}`, selectedCategory);
    console.log(selectedCategory);

    const data = JSON.stringify({
      id: transaction.id,
      category: selectedCategory,
    });
    console.log(data);
    fetch(`http://localhost:${window.backend_port}/api/v1/save_category`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: data,
    })
      .then((response) => response.json())
      .then((data) => {
        //const note = data.note; //TODO
        //setNotes(note);
      })
      .catch((error) => console.log("Error in Item file(2):", error));

    //setSelectedCategory(event.target.value);
    alert("Category has been saved.");
  };

  const handleSaveNewCategory = () => {
    console.log(typeof newCategoryName);
    if (newCategoryName.trim() !== "" && newCategoryName.length <= 15) {
      addCategory(newCategoryName.trim());
      setNewCategoryName("");
      setShowCategoryModal(false); // close the modal
      console.log(newCategoryName);
      const data = {
        category: newCategoryName,
        id: transaction.id,
      };
      fetch(`http://localhost:${window.backend_port}/api/v1/category`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("failed to store data in backend");
          }
        })
        .then((data) => console.log(data))
        .catch((error) => {
          console.error("Error storing data in backend:", error);
        });
      console.log(JSON.stringify(data));
    } else {
      setCategoryError(
        "Please enter a valid category name (category name cannot be empty or too long).",
      );
    }
  };

  const handleSaveNotes = () => {
    sessionStorage.setItem(`notes-${transaction.id}`, notes);
    alert("Notes have been saved.");
    const data = JSON.stringify({
      id: transaction.id,
      note: notes,
    });
    console.log(data);
    fetch(`http://localhost:${window.backend_port}/api/v1/note`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: data,
    })
      .then((response) => response.json())
      .then((data) => {
        const note = data.note;
        setNotes(note);
      })
      .catch((error) => console.log("Error in Item file(2):", error));
  };

  return (
    <div className={`transaction-item ${isExpanded ? "expanded" : ""}`}>
      <div className="transaction-summary" onClick={handleSummaryClick}>
        <p className="transaction-name">{transaction.name}</p>
        <p className="transaction-date">
          {transaction.date} {transaction.time}
        </p>
        <div className="transaction-amount">${transaction.amount}</div>
      </div>
      {isExpanded && (
        <div
          className="transaction-details"
          onClick={(e) => e.stopPropagation()}
        >
          <div
            style={{
              flexBasis: "80%",
              paddingLeft: ".5rem",
              fontSize: "1.2rem",
            }}
          >
            <p>Current Category: {transaction.category}</p>
          </div>
          <div className="transaction-category">
            <label htmlFor="category">Category:</label>
            <select
              id="category"
              value={selectedCategory}
              onChange={handleCategoryChange}
            >
              <option value="Select Category" disabled></option>
              {categories.map((category, index) => (
                <option
                  key={index}
                  value={category}
                  onChange={(value) => setSelectedCategory(value.target.value)}
                >
                  {category}
                </option>
              ))}
            </select>
            <Modal show={showCategoryModal}>
              <Modal.Body>
                Enter new category name:
                <Form.Control
                  onChange={(value) => {
                    setNewCategoryName(value.target.value);
                    console.log(typeof value.target.value);
                  }}
                />
              </Modal.Body>
              <Modal.Footer>
                <Button onClick={() => setShowCategoryModal(false)}>
                  Close
                </Button>
                <Button onClick={handleSaveNewCategory}>
                  Save New Category
                </Button>
              </Modal.Footer>
            </Modal>
            <button onClick={handleAddNewCategoryClick}>+ Add New</button>
            <button onClick={handleSaveCategory}>Save Category</button>
          </div>
          <div className="transaction-notes">
            <label htmlFor="notes">Notes: </label>
            <textarea
              id="notes"
              value={notes}
              onChange={handleNotesChange}
            ></textarea>
            <button onClick={handleSaveNotes}>Save Notes</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default TransactionItem;
